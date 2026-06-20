import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  UsersControllerDocs,
  UsersMeDocs,
  UsersUpdateMeDocs,
} from '../swagger/docs';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@UsersControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @UsersMeDocs()
  me(@CurrentUser() user: AuthUser) {
    return this.users.findById(user.id);
  }

  @Patch('me')
  @UsersUpdateMeDocs()
  updateMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.users.update(user.id, dto);
  }
}
