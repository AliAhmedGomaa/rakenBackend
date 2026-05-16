import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ContactMethod = 'chat' | 'call' | 'sms';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export type MessageDocument = HydratedDocument<Message>;
export type ChatDocument = HydratedDocument<Chat>;

@Schema({ _id: true, timestamps: false })
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id!: Types.ObjectId;

  /** 'me' = the car owner (auth user); otherwise the anonymous contact label. */
  @Prop({ required: true })
  senderId!: string;

  @Prop({ required: true, trim: true, maxlength: 4000 })
  text!: string;

  @Prop({ required: true })
  timestamp!: number;

  @Prop({ required: true, enum: ['sent', 'delivered', 'read'], default: 'sent' })
  status!: MessageStatus;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Car', required: true, index: true })
  carId!: Types.ObjectId;

  /** Plate snapshot at creation (so chat keeps context if the car is renamed). */
  @Prop({ required: true })
  carPlate!: string;

  @Prop({ required: true })
  participantLabel!: string;

  @Prop({ required: true, enum: ['chat', 'call', 'sms'], default: 'chat' })
  contactMethod!: ContactMethod;

  @Prop({ type: [MessageSchema], default: [] })
  messages!: Message[];

  @Prop({ default: 0 })
  unreadCount!: number;

  /**
   * Opaque token issued to the anonymous web visitor that started this thread.
   * When the same visitor sends another message we append to the same chat
   * instead of creating a new one.
   */
  @Prop({ index: true })
  visitorToken?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

/* eslint-disable @typescript-eslint/no-explicit-any */
MessageSchema.set('toJSON', {
  virtuals: false,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

ChatSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    if (Array.isArray(ret.messages)) {
      ret.messages = ret.messages.map((m: Record<string, unknown>) => {
        const id = m._id ?? m.id;
        const out: Record<string, unknown> = { ...m, id };
        delete out._id;
        return out;
      });
    }
    return ret;
  },
});
/* eslint-enable @typescript-eslint/no-explicit-any */
