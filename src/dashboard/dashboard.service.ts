import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from '../common/schemas/car.schema';
import { Chat, ChatDocument } from '../common/schemas/chat.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  async summary(ownerId: string) {
    const oid = new Types.ObjectId(ownerId);

    const [cars, chatStats, recentChats] = await Promise.all([
      this.carModel.find({ ownerId: oid }).exec(),
      this.chatModel
        .aggregate<{ total: number; unreadThreads: number; unreadMessages: number }>([
          { $match: { ownerId: oid } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              unreadThreads: {
                $sum: { $cond: [{ $gt: ['$unreadCount', 0] }, 1, 0] },
              },
              unreadMessages: { $sum: '$unreadCount' },
            },
          },
        ])
        .exec(),
      this.chatModel
        .find({ ownerId: oid })
        .sort({ updatedAt: -1 })
        .limit(5)
        .exec(),
    ]);

    const activeCars = cars.filter(c => c.status === 'active').length;
    const stats = chatStats[0] ?? {
      total: 0,
      unreadThreads: 0,
      unreadMessages: 0,
    };

    return {
      cars: {
        total: cars.length,
        active: activeCars,
        paused: cars.length - activeCars,
      },
      chats: {
        total: stats.total,
        unreadThreads: stats.unreadThreads,
        unreadMessages: stats.unreadMessages,
      },
      recentChats: recentChats.map(c => c.toJSON()),
    };
  }
}
