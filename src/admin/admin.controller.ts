import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AdminControllerDocs,
  AdminCreateAdminDocs,
  AdminDeleteCarDocs,
  AdminDeleteChatDocs,
  AdminGenerateStickersDocs,
  AdminGetCarDocs,
  AdminGetChatDocs,
  AdminGetUserDocs,
  AdminListCarsDocs,
  AdminListChatsDocs,
  AdminListStickersDocs,
  AdminListUsersDocs,
  AdminSummaryDocs,
  AdminUpdateCarDocs,
} from '../swagger/docs';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminBatchStickersDto } from './dto/admin-batch-stickers.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminCarDto } from './dto/update-admin-car.dto';

@AdminControllerDocs()
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('summary')
  @UseGuards(AdminGuard)
  @AdminSummaryDocs()
  summary() {
    return this.admin.summary();
  }

  @Post('create')
  @HttpCode(201)
  @AdminCreateAdminDocs()
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.admin.createAdmin(dto);
  }

  @Get('users')
  @UseGuards(AdminGuard)
  @AdminListUsersDocs()
  listUsers() {
    return this.admin.listUsers();
  }

  @Get('users/:id')
  @UseGuards(AdminGuard)
  @AdminGetUserDocs()
  async getUser(@Param('id') id: string) {
    const data = await this.admin.getUser(id);
    if (!data) throw new NotFoundException('User not found');
    return data;
  }

  @Get('cars')
  @UseGuards(AdminGuard)
  @AdminListCarsDocs()
  listCars() {
    return this.admin.listCars();
  }

  @Get('cars/:id')
  @UseGuards(AdminGuard)
  @AdminGetCarDocs()
  async getCar(@Param('id') id: string) {
    const data = await this.admin.getCar(id);
    if (!data) throw new NotFoundException('Car not found');
    return data;
  }

  @Patch('cars/:id')
  @UseGuards(AdminGuard)
  @AdminUpdateCarDocs()
  async updateCar(@Param('id') id: string, @Body() dto: UpdateAdminCarDto) {
    const car = await this.admin.updateCar(id, dto);
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  @Delete('cars/:id')
  @UseGuards(AdminGuard)
  @AdminDeleteCarDocs()
  deleteCar(@Param('id') id: string) {
    return this.admin.deleteCar(id);
  }

  @Get('chats')
  @UseGuards(AdminGuard)
  @AdminListChatsDocs()
  listChats() {
    return this.admin.listChats();
  }

  @Get('chats/:id')
  @UseGuards(AdminGuard)
  @AdminGetChatDocs()
  async getChat(@Param('id') id: string) {
    const data = await this.admin.getChat(id);
    if (!data) throw new NotFoundException('Chat not found');
    return data;
  }

  @Delete('chats/:id')
  @UseGuards(AdminGuard)
  @AdminDeleteChatDocs()
  deleteChat(@Param('id') id: string) {
    return this.admin.deleteChat(id);
  }

  @Get('qr-stickers')
  @UseGuards(AdminGuard)
  @AdminListStickersDocs()
  listStickers(@Query('status') status?: 'assigned' | 'unassigned') {
    return this.admin.listStickers(status);
  }

  @Post('qr-stickers/batch')
  @UseGuards(AdminGuard)
  @AdminGenerateStickersDocs()
  generateStickers(@Body() dto: AdminBatchStickersDto) {
    return this.admin.generateStickers(dto.count);
  }
}
