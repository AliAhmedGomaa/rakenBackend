import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import type { Server, Socket } from 'socket.io';
import { Chat, ChatDocument } from '../common/schemas/chat.schema';
import { ChatRealtimeService } from './chat-realtime.service';

type HandshakeAuth = {
  token?: string;
  visitorToken?: string;
  chatId?: string;
};

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: true, credentials: true },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly log = new Logger(ChatGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly realtime: ChatRealtimeService,
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  afterInit() {
    this.realtime.setServer(this.server);
    this.log.log('Chat WebSocket gateway ready (/chat)');
  }

  handleConnection(client: Socket) {
    void this.authenticate(client);
  }

  handleDisconnect(_client: Socket) {
    // rooms cleaned up automatically
  }

  @SubscribeMessage('join')
  async handleOwnerJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId?: string },
  ) {
    const ownerId = client.data.ownerId as string | undefined;
    if (!ownerId || !body?.chatId) return { ok: false };

    const chat = await this.chatModel.findById(body.chatId).exec();
    if (!chat || chat.ownerId.toString() !== ownerId) {
      return { ok: false };
    }

    await client.join(this.realtime.chatRoom(body.chatId));
    return { ok: true, chatId: body.chatId };
  }

  @SubscribeMessage('join_visitor')
  async handleVisitorJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId?: string; visitorToken?: string },
  ) {
    if (!body?.chatId || !body?.visitorToken) return { ok: false };
    const ok = await this.verifyVisitor(body.chatId, body.visitorToken);
    if (!ok) return { ok: false };

    client.data.role = 'visitor';
    client.data.chatId = body.chatId;
    await client.join(this.realtime.chatRoom(body.chatId));
    return { ok: true, chatId: body.chatId };
  }

  private async authenticate(client: Socket) {
    const auth = (client.handshake.auth ?? {}) as HandshakeAuth;

    if (auth.token) {
      try {
        const payload = this.jwt.verify<{ sub: string }>(auth.token, {
          secret: this.config.getOrThrow<string>('JWT_SECRET'),
        });
        client.data.role = 'owner';
        client.data.ownerId = payload.sub;
        await client.join(this.realtime.ownerRoom(payload.sub));
        return;
      } catch {
        client.disconnect(true);
        return;
      }
    }

    if (auth.visitorToken && auth.chatId) {
      const ok = await this.verifyVisitor(auth.chatId, auth.visitorToken);
      if (!ok) {
        client.disconnect(true);
        return;
      }
      client.data.role = 'visitor';
      client.data.chatId = auth.chatId;
      await client.join(this.realtime.chatRoom(auth.chatId));
    }
  }

  private async verifyVisitor(chatId: string, visitorToken: string) {
    const chat = await this.chatModel.findById(chatId).exec();
    return !!chat && chat.visitorToken === visitorToken;
  }
}
