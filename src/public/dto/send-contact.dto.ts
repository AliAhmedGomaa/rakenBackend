import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SendContactDto {
  @ApiProperty({
    example: 'Hello, is your car blocking my driveway?',
    maxLength: 4000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  text!: string;

  @ApiPropertyOptional({
    description:
      'Opaque token from the first contact response; omit on first message.',
    example: 'a1b2c3d4e5f6789012345678901234ab',
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  visitorToken?: string;

  @ApiPropertyOptional({ example: 'Neighbor', maxLength: 60 })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  displayName?: string;
}
