import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export const CAR_COLORS = [
  'white',
  'silver',
  'black',
  'red',
  'blue',
  'green',
  'yellow',
  'gray',
] as const;

export type CarColor = (typeof CAR_COLORS)[number];
export type CarStatus = 'active' | 'paused';

export type CarDocument = HydratedDocument<Car>;

@Schema({ timestamps: true })
export class Car {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  plate!: string;

  @Prop({ required: true, trim: true })
  make!: string;

  @Prop({ required: true, trim: true })
  model!: string;

  @Prop()
  year?: number;

  @Prop({ required: true, enum: CAR_COLORS })
  color!: CarColor;

  @Prop({ trim: true })
  nickname?: string;

  @Prop({ required: true, enum: ['active', 'paused'], default: 'active' })
  status!: CarStatus;

  /** Assigned pre-printed QR sticker code (unique across fleet). */
  @Prop({ trim: true, unique: true, sparse: true, index: true })
  qrCode?: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);

// One owner can't reuse the same plate twice.
CarSchema.index({ ownerId: 1, plate: 1 }, { unique: true });

/* eslint-disable @typescript-eslint/no-explicit-any */
CarSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
/* eslint-enable @typescript-eslint/no-explicit-any */
