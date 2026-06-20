import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CarsControllerDocs,
  CarsCreateDocs,
  CarsFindOneDocs,
  CarsListDocs,
  CarsQrDocs,
  CarsRemoveDocs,
  CarsUpdateDocs,
} from '../swagger/docs';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@CarsControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('cars')
export class CarsController {
  constructor(private readonly cars: CarsService) {}

  @Get()
  @CarsListDocs()
  list(@CurrentUser() user: AuthUser) {
    return this.cars.list(user.id);
  }

  @Post()
  @CarsCreateDocs()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCarDto) {
    return this.cars.create(user.id, dto);
  }

  @Get(':id')
  @CarsFindOneDocs()
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.cars.findOne(user.id, id);
  }

  @Patch(':id')
  @CarsUpdateDocs()
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCarDto,
  ) {
    return this.cars.update(user.id, id, dto);
  }

  @Delete(':id')
  @CarsRemoveDocs()
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.cars.remove(user.id, id);
  }

  @Get(':id/qr')
  @CarsQrDocs()
  qr(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.cars.qr(user.id, id);
  }
}
