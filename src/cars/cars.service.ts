import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as QRCode from 'qrcode';
import { Car, CarDocument } from '../common/schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
    private readonly config: ConfigService,
  ) {}

  list(ownerId: string) {
    return this.carModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .sort({ createdAt: -1 })
      .exec()
      .then(docs => docs.map(d => d.toJSON()));
  }

  async create(ownerId: string, dto: CreateCarDto) {
    try {
      // Mongoose's `create()` typing conflicts with our `model` field name,
      // so we build a new document via `new this.carModel(...)` instead.
      const doc = new this.carModel({
        ownerId: new Types.ObjectId(ownerId),
        plate: dto.plate.trim(),
        make: dto.make.trim(),
        model: dto.model.trim(),
        year: dto.year,
        color: dto.color,
        nickname: dto.nickname?.trim() || undefined,
        status: dto.status ?? 'active',
      });
      const car = await doc.save();
      return car.toJSON();
    } catch (err) {
      if ((err as { code?: number }).code === 11000) {
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
    await car.deleteOne();
    return { ok: true };
  }

  /**
   * Builds the QR payload for a car. The QR encodes a deep link / URL that
   * a stranger can scan to reach the anonymous contact flow for that car.
   * Returns both the raw payload and a data-URI image so the client can
   * decide how to render it.
   */
  async qr(ownerId: string, id: string) {
    const car = await this.requireOwned(ownerId, id);
    // PUBLIC_QR_BASE_URL: optional origin (e.g. http://172.20.10.2:4200) or full
    // prefix including /c (e.g. http://172.20.10.2:4200/c). Default is LAN dev web.
    let base =
      this.config.get<string>('PUBLIC_QR_BASE_URL') ??
      'http://172.20.10.2:4200/c';
    base = base.replace(/\/+$/, '');
    if (!base.endsWith('/c')) {
      base = `${base}/c`;
    }
    const url = `${base}/${car.id}`;
    const dataUrl = await QRCode.toDataURL(url, {
      margin: 1,
      width: 512,
      color: { dark: '#0F1226', light: '#FFFFFF' },
    });
    return {
      carId: car.id,
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
