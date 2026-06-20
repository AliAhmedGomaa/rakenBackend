import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schemas/user.schema';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user.toJSON();
  }

  async update(id: string, dto: UpdateProfileDto) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...(dto.fullName !== undefined ? { fullName: dto.fullName.trim() } : {}),
          ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
          ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
        },
        { new: true },
      )
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user.toJSON();
  }

  async registerPushToken(id: string, dto: RegisterPushTokenDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    const now = new Date();
    const existing = user.pushTokens?.find(t => t.token === dto.token);
    if (existing) {
      existing.platform = dto.platform;
      existing.updatedAt = now;
    } else {
      user.pushTokens = user.pushTokens ?? [];
      user.pushTokens.push({
        token: dto.token,
        platform: dto.platform,
        updatedAt: now,
      });
    }

    await user.save();
    return { ok: true };
  }
}
