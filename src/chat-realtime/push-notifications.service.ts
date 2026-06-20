import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schemas/user.schema';

export type ChatPushPayload = {
  chatId: string;
  carPlate: string;
  participantLabel: string;
  preview: string;
};

@Injectable()
export class PushNotificationsService {
  private readonly log = new Logger(PushNotificationsService.name);
  private initialized = false;

  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    this.initFirebase();
  }

  private initFirebase() {
    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.config.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.config
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      this.log.warn(
        'Push notifications disabled — set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY',
      );
      return;
    }

    try {
      if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
      this.initialized = true;
    } catch (err) {
      this.log.error('Failed to initialize Firebase Admin', err);
    }
  }

  async notifyOwnerNewMessage(ownerId: string, payload: ChatPushPayload) {
    if (!this.initialized) return;

    const user = await this.userModel.findById(ownerId).exec();
    if (!user?.pushTokens?.length) return;

    const tokens = [...new Set(user.pushTokens.map(t => t.token))];
    if (!tokens.length) return;

    const title = `${payload.participantLabel} · ${payload.carPlate}`;
    const body =
      payload.preview.length > 120
        ? `${payload.preview.slice(0, 117)}…`
        : payload.preview;

    try {
      const res = await getMessaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: {
          type: 'chat_message',
          chatId: payload.chatId,
        },
        apns: {
          payload: { aps: { sound: 'default', badge: 1 } },
        },
        android: { priority: 'high' },
      });

      const stale: string[] = [];
      res.responses.forEach((r, i) => {
        if (
          !r.success &&
          r.error?.code === 'messaging/registration-token-not-registered'
        ) {
          stale.push(tokens[i]!);
        }
      });

      if (stale.length) {
        await this.userModel
          .updateOne(
            { _id: ownerId },
            { $pull: { pushTokens: { token: { $in: stale } } } },
          )
          .exec();
      }
    } catch (err) {
      this.log.error(`Push send failed for owner ${ownerId}`, err);
    }
  }
}
