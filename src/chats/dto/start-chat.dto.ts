import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import type { ContactMethod } from '../../common/schemas/chat.schema';

export class StartChatDto {
  @IsMongoId()
  carId!: string;

  @IsOptional()
  @IsString()
  participantLabel?: string;

  @IsOptional()
  @IsEnum(['chat', 'call', 'sms'])
  contactMethod?: ContactMethod;

  @IsOptional()
  @IsString()
  initialMessage?: string;
}
