import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);

// Note: mongoose's transform typing is strict; using `any` for ret keeps the
// transform readable while letting us reshape the response.
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
