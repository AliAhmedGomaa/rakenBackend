import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model, Types } from 'mongoose';
import * as QRCode from 'qrcode';
import {
  QrSticker,
  QrStickerDocument,
} from '../common/schemas/qr-sticker.schema';

export type QrStickerView = {
  code: string;
  status: 'unassigned' | 'assigned';
  url: string;
  dataUrl?: string;
  carId?: string;
};

@Injectable()
export class QrStickersService {
  constructor(
    @InjectModel(QrSticker.name)
    private readonly stickerModel: Model<QrStickerDocument>,
    private readonly config: ConfigService,
  ) {}

  buildPublicUrl(code: string): string {
    let base =
      this.config.get<string>('PUBLIC_QR_BASE_URL') ??
      'https://raken-web.vercel.app';
    base = base.replace(/\/+$/, '');
    if (!base.endsWith('/c')) {
      base = `${base}/c`;
    }
    return `${base}/${code}`;
  }

  /** Parse scanned payload — full URL or raw code. */
  normalizeScannedCode(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) {
      throw new BadRequestException('QR code is empty.');
    }

    try {
      if (/^https?:\/\//i.test(trimmed)) {
        const url = new URL(trimmed);
        const match = url.pathname.match(/\/c\/([^/?#]+)/i);
        if (match?.[1]) return decodeURIComponent(match[1]);
      }
    } catch {
      // fall through — treat as raw code
    }

    return trimmed.replace(/^\/c\//i, '').split(/[/?#]/)[0] ?? trimmed;
  }

  async lookupForOwner(code: string): Promise<QrStickerView> {
    const normalized = this.normalizeScannedCode(code);
    const sticker = await this.stickerModel
      .findOne({ code: normalized })
      .exec();
    if (!sticker) {
      throw new NotFoundException('This QR sticker was not found.');
    }
    return this.toView(sticker);
  }

  async requireUnassigned(code: string): Promise<QrStickerDocument> {
    const normalized = this.normalizeScannedCode(code);
    const sticker = await this.stickerModel
      .findOne({ code: normalized })
      .exec();
    if (!sticker) {
      throw new NotFoundException('This QR sticker was not found.');
    }
    if (sticker.status === 'assigned') {
      throw new ConflictException('This QR sticker is already linked to a car.');
    }
    return sticker;
  }

  async assignToCar(
    code: string,
    carId: Types.ObjectId,
    ownerId: string,
  ): Promise<QrStickerDocument> {
    const sticker = await this.requireUnassigned(code);
    sticker.status = 'assigned';
    sticker.carId = carId;
    sticker.assignedBy = new Types.ObjectId(ownerId);
    sticker.assignedAt = new Date();
    await sticker.save();
    return sticker;
  }

  async unassignByCarId(carId: Types.ObjectId): Promise<void> {
    await this.stickerModel
      .updateMany(
        { carId },
        {
          $set: { status: 'unassigned' },
          $unset: { carId: 1, assignedBy: 1, assignedAt: 1 },
        },
      )
      .exec();
  }

  async findCarIdByCode(code: string): Promise<Types.ObjectId | null> {
    const normalized = this.normalizeScannedCode(code);
    const sticker = await this.stickerModel
      .findOne({ code: normalized, status: 'assigned' })
      .exec();
    return sticker?.carId ?? null;
  }

  async publicStatus(code: string) {
    const normalized = this.normalizeScannedCode(code);
    const sticker = await this.stickerModel.findOne({ code: normalized }).exec();
    if (!sticker) {
      throw new NotFoundException('Sticker not found');
    }
    return {
      code: sticker.code,
      assigned: sticker.status === 'assigned',
      url: this.buildPublicUrl(sticker.code),
    };
  }

  async generateBatch(count: number): Promise<QrStickerView[]> {
    const n = Math.min(Math.max(count, 1), 500);
    const created: QrStickerView[] = [];

    for (let i = 0; i < n; i++) {
      const code = this.mintCode();
      try {
        const doc = await this.stickerModel.create({ code, status: 'unassigned' });
        created.push(await this.toViewWithImage(doc));
      } catch (err) {
        if ((err as { code?: number }).code === 11000) {
          i--;
          continue;
        }
        throw err;
      }
    }

    return created;
  }

  async renderDataUrl(code: string): Promise<string> {
    return QRCode.toDataURL(this.buildPublicUrl(code), {
      margin: 1,
      width: 512,
      color: { dark: '#0F1226', light: '#FFFFFF' },
    });
  }

  private mintCode(): string {
    return randomBytes(5).toString('base64url');
  }

  private toView(sticker: QrStickerDocument): QrStickerView {
    return {
      code: sticker.code,
      status: sticker.status,
      url: this.buildPublicUrl(sticker.code),
      carId: sticker.carId?.toString(),
    };
  }

  private async toViewWithImage(
    sticker: QrStickerDocument,
  ): Promise<QrStickerView> {
    const view = this.toView(sticker);
    view.dataUrl = await this.renderDataUrl(sticker.code);
    return view;
  }
}
