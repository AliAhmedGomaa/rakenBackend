import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserRole = 'owner' | 'admin';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ trim: true })
  phone?: string;

  /** bcrypt hash — never returned to clients. */
  @Prop({ required: true, select: false })
  passwordHash!: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ required: true, enum: ['owner', 'admin'], default: 'owner' })
  role!: UserRole;

  /** FCM device tokens for chat push notifications. */
  @Prop({
    type: [
      {
        token: { type: String, required: true },
        platform: { type: String, enum: ['ios', 'android'], required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  pushTokens!: Array<{
    token: string;
    platform: 'ios' | 'android';
    updatedAt: Date;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);

/* eslint-disable @typescript-eslint/no-explicit-any */
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});
/* eslint-enable @typescript-eslint/no-explicit-any */
