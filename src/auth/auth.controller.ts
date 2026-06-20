import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  AuthControllerDocs,
  AuthLoginDocs,
  AuthRegisterDocs,
} from '../swagger/docs';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@AuthControllerDocs()
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @AuthRegisterDocs()
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @AuthLoginDocs()
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
}
