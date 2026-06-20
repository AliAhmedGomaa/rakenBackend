import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schemas/user.schema';
import type { AuthUser } from '../auth/current-user.decorator';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = (await super.canActivate(context)) as boolean;
    if (!activated) return false;

    const req = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const authUser = req.user;
    if (!authUser?.id) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel.findById(authUser.id).exec();
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Admin access required.');
    }

    return true;
  }
}
