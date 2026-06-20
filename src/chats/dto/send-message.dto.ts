import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'Sorry — moving it now.', maxLength: 4000 })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  text!: string;

  @ApiPropertyOptional({
    description: "Optional override for who sent it. Defaults to 'me' (the car owner).",
    example: 'me',
  })
  @IsOptional()
  @IsString()
  senderId?: string;
}
