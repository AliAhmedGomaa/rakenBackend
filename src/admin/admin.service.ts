import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from '../common/schemas/car.schema';
import { Chat, ChatDocument } from '../common/schemas/chat.schema';
import {
  QrSticker,
  QrStickerDocument,
} from '../common/schemas/qr-sticker.schema';
import { User, UserDocument } from '../common/schemas/user.schema';
import { QrStickersService } from '../qr-stickers/qr-stickers.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminCarDto } from './dto/update-admin-car.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly log = new Logger(AdminService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(QrSticker.name)
    private readonly stickerModel: Model<QrStickerDocument>,
    private readonly qrStickers: QrStickersService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureSeedAdmin();
  }

  async summary() {
    const [owners, admins, cars, chats, stickers, stickerStats] =
      await Promise.all([
        this.userModel.countDocuments({ role: 'owner' }).exec(),
        this.userModel.countDocuments({ role: 'admin' }).exec(),
        this.carModel.countDocuments().exec(),
        this.chatModel.countDocuments().exec(),
        this.stickerModel.countDocuments().exec(),
        this.stickerModel
          .aggregate<{ assigned: number; unassigned: number }>([
            {
              $group: {
                _id: null,
                assigned: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'assigned'] }, 1, 0],
                  },
                },
                unassigned: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'unassigned'] }, 1, 0],
                  },
                },
              },
            },
          ])
          .exec(),
      ]);

    const ss = stickerStats[0] ?? { assigned: 0, unassigned: 0 };
    const unread = await this.chatModel
      .aggregate<{ total: number }>([
        { $group: { _id: null, total: { $sum: '$unreadCount' } } },
      ])
      .exec();

    const recentOwners = await this.userModel
      .find({ role: 'owner' })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    return {
      users: { owners, admins },
      cars: { total: cars },
      chats: { total: chats, unreadMessages: unread[0]?.total ?? 0 },
      stickers: {
        total: stickers,
        assigned: ss.assigned,
        unassigned: ss.unassigned,
      },
      recentOwners: recentOwners.map(u => u.toJSON()),
    };
  }

  listUsers() {
    return this.userModel
      .find({ role: 'owner' })
      .sort({ createdAt: -1 })
      .exec()
      .then(async users => {
        const ids = users.map(u => u._id);
        const counts = await this.carModel
          .aggregate<{ _id: Types.ObjectId; cars: number }>([
            { $match: { ownerId: { $in: ids } } },
            { $group: { _id: '$ownerId', cars: { $sum: 1 } } },
          ])
          .exec();
        const map = new Map(counts.map(c => [c._id.toString(), c.cars]));
        return users.map(u => ({
          ...u.toJSON(),
          carsCount: map.get(u.id) ?? 0,
        }));
      });
  }

  async getUser(id: string) {
    const user = await this.userModel.findOne({ _id: id, role: 'owner' }).exec();
    if (!user) return null;
    const [cars, chats] = await Promise.all([
      this.carModel.find({ ownerId: user._id }).sort({ createdAt: -1 }).exec(),
      this.chatModel
        .find({ ownerId: user._id })
        .sort({ updatedAt: -1 })
        .limit(20)
        .exec(),
    ]);
    return {
      user: user.toJSON(),
      cars: cars.map(c => c.toJSON()),
      recentChats: chats.map(c => c.toJSON()),
    };
  }

  listCars() {
    return this.carModel
      .find()
      .sort({ createdAt: -1 })
      .populate('ownerId', 'fullName email')
      .exec()
      .then(docs =>
        docs.map(d => {
          const json = d.toJSON() as unknown as Record<string, unknown>;
          const owner = d.ownerId as unknown as UserDocument | Types.ObjectId;
          if (owner && typeof owner === 'object' && 'email' in owner) {
            json.owner = {
              id: owner.id,
              fullName: owner.fullName,
              email: owner.email,
            };
          }
          delete json.ownerId;
          return json;
        }),
      );
  }

  async getCar(id: string) {
    const car = await this.carModel.findById(id).exec();
    if (!car) return null;
    const owner = await this.userModel.findById(car.ownerId).exec();
    return {
      car: car.toJSON(),
      owner: owner?.toJSON() ?? null,
    };
  }

  async updateCar(id: string, dto: UpdateAdminCarDto) {
    const car = await this.carModel.findById(id).exec();
    if (!car) return null;
    if (dto.plate !== undefined) car.set('plate', dto.plate.trim());
    if (dto.make !== undefined) car.set('make', dto.make.trim());
    if (dto.model !== undefined) car.set('model', dto.model.trim());
    if (dto.year !== undefined) car.set('year', dto.year);
    if (dto.color !== undefined) car.set('color', dto.color);
    if (dto.nickname !== undefined)
      car.set('nickname', dto.nickname.trim() || undefined);
    if (dto.status !== undefined) car.set('status', dto.status);
    await car.save();
    return car.toJSON();
  }

  async deleteCar(id: string) {
    const car = await this.carModel.findById(id).exec();
    if (!car) return { ok: false };
    await this.qrStickers.unassignByCarId(car._id);
    await car.deleteOne();
    return { ok: true };
  }

  listChats() {
    return this.chatModel
      .find()
      .sort({ updatedAt: -1 })
      .populate('ownerId', 'fullName email')
      .exec()
      .then(docs =>
        docs.map(d => {
          const json = d.toJSON() as unknown as Record<string, unknown>;
          const owner = d.ownerId as unknown as UserDocument | Types.ObjectId;
          if (owner && typeof owner === 'object' && 'email' in owner) {
            json.owner = {
              id: owner.id,
              fullName: owner.fullName,
              email: owner.email,
            };
          }
          delete json.ownerId;
          return json;
        }),
      );
  }

  async getChat(id: string) {
    const chat = await this.chatModel.findById(id).exec();
    if (!chat) return null;
    const owner = await this.userModel.findById(chat.ownerId).exec();
    return {
      chat: chat.toJSON(),
      owner: owner?.toJSON() ?? null,
    };
  }

  async deleteChat(id: string) {
    const chat = await this.chatModel.findById(id).exec();
    if (!chat) return { ok: false };
    await chat.deleteOne();
    return { ok: true };
  }

  listStickers(status?: 'assigned' | 'unassigned') {
    const filter = status ? { status } : {};
    return this.stickerModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(500)
      .exec()
      .then(docs => docs.map(d => d.toJSON()));
  }

  generateStickers(count: number) {
    return this.qrStickers.generateBatch(count);
  }

  async createAdmin(dto: CreateAdminDto) {
    const email = dto.email.toLowerCase().trim();
    const exists = await this.userModel.findOne({ email }).exec();
    if (exists) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      fullName: dto.fullName.trim(),
      email,
      phone: dto.phone?.trim(),
      passwordHash,
      role: 'admin',
    });

    return { user: created.toJSON() };
  }

  private async ensureSeedAdmin() {
    const email = this.config.get<string>('ADMIN_EMAIL')?.toLowerCase().trim();
    const password = this.config.get<string>('ADMIN_PASSWORD');
    const name = this.config.get<string>('ADMIN_NAME') ?? 'Raken Admin';
    if (!email || !password) return;

    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        this.log.log(`Promoted existing user to admin: ${email}`);
      }
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.userModel.create({
      fullName: name,
      email,
      passwordHash,
      role: 'admin',
    });
    this.log.log(`Seeded admin account: ${email}`);
  }
}
