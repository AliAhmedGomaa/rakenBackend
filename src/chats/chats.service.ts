import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from '../common/schemas/car.schema';
import { Chat, ChatDocument } from '../common/schemas/chat.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { StartChatDto } from './dto/start-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
  ) {}

  list(ownerId: string) {
    return this.chatModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .sort({ updatedAt: -1 })
      .exec()
      .then(docs => docs.map(d => d.toJSON()));
  }

  async findOne(ownerId: string, id: string) {
    const chat = await this.requireOwned(ownerId, id);
    return chat.toJSON();
  }

  async start(ownerId: string, dto: StartChatDto) {
    const car = await this.carModel.findById(dto.carId).exec();
    if (!car || car.ownerId.toString() !== ownerId) {
      throw new NotFoundException('Car not found');
    }

    const count = await this.chatModel
      .countDocuments({ ownerId: new Types.ObjectId(ownerId) })
      .exec();

    const chat = await this.chatModel.create({
      ownerId: new Types.ObjectId(ownerId),
      carId: car._id,
      carPlate: car.plate,
      participantLabel: dto.participantLabel ?? `Anonymous #${count + 1}`,
      contactMethod: dto.contactMethod ?? 'chat',
      messages: dto.initialMessage
        ? [
            {
              _id: new Types.ObjectId(),
              senderId: 'other',
              text: dto.initialMessage,
              timestamp: Date.now(),
              status: 'delivered',
            },
          ]
        : [],
      unreadCount: dto.initialMessage ? 1 : 0,
    });
    return chat.toJSON();
  }

  async sendMessage(ownerId: string, id: string, dto: SendMessageDto) {
    const chat = await this.requireOwned(ownerId, id);
    const senderId = dto.senderId ?? 'me';
    chat.messages.push({
      _id: new Types.ObjectId(),
      senderId,
      text: dto.text.trim(),
      timestamp: Date.now(),
      status: 'sent',
    });
    if (senderId !== 'me') {
      chat.unreadCount = (chat.unreadCount ?? 0) + 1;
    }
    await chat.save();
    return chat.toJSON();
  }

  async markRead(ownerId: string, id: string) {
    const chat = await this.requireOwned(ownerId, id);
    chat.unreadCount = 0;
    chat.messages.forEach(m => {
      if (m.senderId !== 'me' && m.status !== 'read') {
        m.status = 'read';
      }
    });
    chat.markModified('messages');
    await chat.save();
    return chat.toJSON();
  }

  async remove(ownerId: string, id: string) {
    const chat = await this.requireOwned(ownerId, id);
    await chat.deleteOne();
    return { ok: true };
  }

  private async requireOwned(ownerId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Chat not found');
    }
    const chat = await this.chatModel.findById(id).exec();
    if (!chat || chat.ownerId.toString() !== ownerId) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }
}
