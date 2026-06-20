import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import type { ContactMethod } from '../../common/schemas/chat.schema';

export class StartChatDto {
  @ApiProperty({ example: '6a07d176824ed76b0203e9e8' })
  @IsMongoId()
  carId!: string;

  @ApiPropertyOptional({ example: 'Neighbor #1' })
  @IsOptional()
  @IsString()
  participantLabel?: string;

  @ApiPropertyOptional({ enum: ['chat', 'call', 'sms'], example: 'chat' })
  @IsOptional()
  @IsEnum(['chat', 'call', 'sms'])
  contactMethod?: ContactMethod;

  @ApiPropertyOptional({ example: 'Hello, is this your car?' })
  @IsOptional()
  @IsString()
  initialMessage?: string;
}
