import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';

export type ChatJson = {
  id: string;
  ownerId: string;
  [key: string]: unknown;
};

@Injectable()
export class ChatRealtimeService {
  private server: Server | null = null;

  setServer(server: Server) {
    this.server = server;
  }

  ownerRoom(ownerId: string) {
    return `owner:${ownerId}`;
  }

  chatRoom(chatId: string) {
    return `chat:${chatId}`;
  }

  emitChatUpdated(chat: { ownerId: unknown; id: unknown }) {
    if (!this.server) return;
    const ownerId = String(chat.ownerId);
    const chatId = String(chat.id);
    this.server.to(this.ownerRoom(ownerId)).emit('chat:updated', chat);
    this.server.to(this.chatRoom(chatId)).emit('chat:updated', chat);
  }

  isOwnerConnected(ownerId: string) {
    const room = this.server?.sockets?.adapter?.rooms?.get(
      this.ownerRoom(ownerId),
    );
    return (room?.size ?? 0) > 0;
  }
}
