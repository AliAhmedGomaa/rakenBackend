import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from '../common/schemas/car.schema';
import { Chat, ChatDocument } from '../common/schemas/chat.schema';
import { User, UserDocument } from '../common/schemas/user.schema';
import { QrStickersService } from '../qr-stickers/qr-stickers.service';
import { SendContactDto } from './dto/send-contact.dto';

export type PublicCarView = {
  id: string;
  plate: string;
  make: string;
  model: string;
  year?: number;
  color: string;
  nickname?: string;
  /** Whether the car is currently accepting contact (status === 'active'). */
  acceptingContact: boolean;
  owner: {
    /** First name only — never the full email. */
    firstName: string;
    /** Phone is exposed only if owner provided one. */
    phone?: string;
  };
  /** Which contact methods the visitor can use. */
  methods: Array<'chat' | 'call' | 'sms'>;
};

export type PublicContactResult = {
  chatId: string;
  visitorToken: string;
  messageId: string;
  participantLabel: string;
  ok: true;
};

@Injectable()
export class PublicService {
  private readonly log = new Logger(PublicService.name);

  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly qrStickers: QrStickersService,
  ) {}

  /**
   * Public scan route uses the pre-printed sticker code (`/c/:code`).
   * Legacy car Mongo IDs still resolve for older deployments.
   */
  private async resolveCar(codeOrId: string): Promise<CarDocument> {
    const trimmed = codeOrId.trim();
    const fromSticker = await this.qrStickers.findCarIdByCode(trimmed);
    if (fromSticker) {
      const car = await this.carModel.findById(fromSticker).exec();
      if (car) return car;
    }

    if (Types.ObjectId.isValid(trimmed)) {
      const legacy = await this.carModel.findById(trimmed).exec();
      if (legacy) return legacy;
    }

    throw new NotFoundException('Car not found');
  }

  async getPublicCar(codeOrId: string): Promise<PublicCarView> {
    const car = await this.resolveCar(codeOrId);

    const owner = await this.userModel.findById(car.ownerId).exec();
    if (!owner) {
      this.log.warn(
        `public car lookup: missing owner doc for ownerId=${String(car.ownerId)} car=${car.id}`,
      );
    }

    const methods: Array<'chat' | 'call' | 'sms'> = ['chat'];
    if (owner?.phone) {
      methods.push('call', 'sms');
    }

    const firstName = owner
      ? ((owner.fullName ?? '').trim().split(/\s+/)[0] || 'Owner')
      : 'Owner';

    return {
      id: car.id,
      plate: car.plate,
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
      nickname: car.nickname,
      acceptingContact: car.status === 'active',
      owner: {
        firstName,
        phone: owner?.phone,
      },
      methods,
    };
  }

  async sendContact(
    codeOrId: string,
    dto: SendContactDto,
  ): Promise<PublicContactResult> {
    const car = await this.resolveCar(codeOrId);

    // Re-use an existing thread for this visitor, otherwise create a fresh one.
    const token = dto.visitorToken ?? this.mintVisitorToken();
    let chat = dto.visitorToken
      ? await this.chatModel
          .findOne({ carId: car._id, visitorToken: dto.visitorToken })
          .exec()
      : null;

    if (!chat) {
      const count = await this.chatModel
        .countDocuments({ ownerId: car.ownerId })
        .exec();
      chat = new this.chatModel({
        ownerId: car.ownerId,
        carId: car._id,
        carPlate: car.plate,
        participantLabel:
          dto.displayName?.trim() || `Anonymous #${count + 1}`,
        contactMethod: 'chat',
        visitorToken: token,
        messages: [],
        unreadCount: 0,
      });
    }

    const messageId = new Types.ObjectId();
    chat.messages.push({
      _id: messageId,
      senderId: 'other',
      text: dto.text.trim(),
      timestamp: Date.now(),
      status: 'delivered',
    });
    chat.unreadCount = (chat.unreadCount ?? 0) + 1;
    await chat.save();

    return {
      ok: true,
      chatId: chat.id,
      visitorToken: token,
      messageId: messageId.toString(),
      participantLabel: chat.participantLabel,
    };
  }

  async getVisitorThread(codeOrId: string, visitorToken: string) {
    const car = await this.resolveCar(codeOrId);
    const chat = await this.chatModel
      .findOne({ carId: car._id, visitorToken })
      .exec();
    if (!chat) {
      return { messages: [] as Array<{ id: string; senderId: string; text: string; timestamp: number; status: string }>, participantLabel: null };
    }
    return {
      chatId: chat.id,
      participantLabel: chat.participantLabel,
      messages: chat.messages.map(m => ({
        id: m._id.toString(),
        senderId: m.senderId,
        text: m.text,
        timestamp: m.timestamp,
        status: m.status,
      })),
    };
  }

  private mintVisitorToken() {
    return randomBytes(16).toString('hex');
  }

  getStickerStatus(code: string) {
    return this.qrStickers.publicStatus(code);
  }
}
