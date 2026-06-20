import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from '../common/schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { QrStickersService } from '../qr-stickers/qr-stickers.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
    private readonly qrStickers: QrStickersService,
  ) {}

  list(ownerId: string) {
    return this.carModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .sort({ createdAt: -1 })
      .exec()
      .then(docs => docs.map(d => d.toJSON()));
  }

  async create(ownerId: string, dto: CreateCarDto) {
    const sticker = await this.qrStickers.requireUnassigned(dto.qrCode);
    const normalizedCode = sticker.code;

    try {
      const doc = new this.carModel({
        ownerId: new Types.ObjectId(ownerId),
        plate: dto.plate.trim(),
        make: dto.make.trim(),
        model: dto.model.trim(),
        year: dto.year,
        color: dto.color,
        nickname: dto.nickname?.trim() || undefined,
        status: dto.status ?? 'active',
        qrCode: normalizedCode,
      });
      const car = await doc.save();
      await this.qrStickers.assignToCar(
        normalizedCode,
        car._id,
        ownerId,
      );
      return car.toJSON();
    } catch (err) {
      if ((err as { code?: number }).code === 11000) {
        const key = (err as { keyPattern?: Record<string, unknown> })
          .keyPattern;
        if (key?.qrCode) {
          throw new ConflictException(
            'This QR sticker is already linked to another car.',
          );
        }
        throw new ConflictException(
          'You already have a car registered with this plate.',
        );
      }
      throw err;
    }
  }

  async findOne(ownerId: string, id: string) {
    const car = await this.requireOwned(ownerId, id);
    return car.toJSON();
  }

  async update(ownerId: string, id: string, dto: UpdateCarDto) {
    const car = await this.requireOwned(ownerId, id);
    if (dto.plate !== undefined) car.set('plate', dto.plate.trim());
    if (dto.make !== undefined) car.set('make', dto.make.trim());
    if (dto.model !== undefined) car.set('model', dto.model.trim());
    if (dto.year !== undefined) car.set('year', dto.year);
    if (dto.color !== undefined) car.set('color', dto.color);
    if (dto.nickname !== undefined)
      car.set('nickname', dto.nickname.trim() || undefined);
    if (dto.status !== undefined) car.set('status', dto.status);
    try {
      await car.save();
    } catch (err) {
      if ((err as { code?: number }).code === 11000) {
        throw new ConflictException(
          'You already have a car registered with this plate.',
        );
      }
      throw err;
    }
    return car.toJSON();
  }

  async remove(ownerId: string, id: string) {
    const car = await this.requireOwned(ownerId, id);
    await this.qrStickers.unassignByCarId(car._id);
    await car.deleteOne();
    return { ok: true };
  }

  async qr(ownerId: string, id: string) {
    const car = await this.requireOwned(ownerId, id);
    if (!car.qrCode) {
      throw new NotFoundException(
        'No QR sticker is linked to this car. Scan a printed sticker when adding the car.',
      );
    }
    const url = this.qrStickers.buildPublicUrl(car.qrCode);
    const dataUrl = await this.qrStickers.renderDataUrl(car.qrCode);
    return {
      carId: car.id,
      qrCode: car.qrCode,
      plate: car.plate,
      url,
      dataUrl,
    };
  }

  private async requireOwned(ownerId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Car not found');
    }
    const car = await this.carModel.findById(id).exec();
    if (!car || car.ownerId.toString() !== ownerId) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }
}
