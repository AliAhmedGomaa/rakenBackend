import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  text!: string;

  /** Optional override for who sent it. Defaults to 'me' (the car owner). */
  @IsOptional()
  @IsString()
  senderId?: string;
}
