import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type QrStickerStatus = 'unassigned' | 'assigned';

export type QrStickerDocument = HydratedDocument<QrSticker>;

@Schema({ timestamps: true })
export class QrSticker {
  /** Short code embedded in the printed QR URL (`/c/<code>`). */
  @Prop({ required: true, unique: true, trim: true, index: true })
  code!: string;

  @Prop({
    required: true,
    enum: ['unassigned', 'assigned'],
    default: 'unassigned',
  })
  status!: QrStickerStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Car' })
  carId?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedBy?: Types.ObjectId;

  @Prop()
  assignedAt?: Date;
}

export const QrStickerSchema = SchemaFactory.createForClass(QrSticker);

/* eslint-disable @typescript-eslint/no-explicit-any */
QrStickerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
/* eslint-enable @typescript-eslint/no-explicit-any */
