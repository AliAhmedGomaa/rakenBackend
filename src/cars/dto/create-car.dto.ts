import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { CAR_COLORS } from '../../common/schemas/car.schema';
import type { CarColor, CarStatus } from '../../common/schemas/car.schema';

export class CreateCarDto {
  @ApiProperty({ example: 'ABC 1234', minLength: 2 })
  @IsString()
  @MinLength(2)
  plate!: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @MinLength(1)
  make!: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  @MinLength(1)
  model!: string;

  @ApiPropertyOptional({ example: 2022, minimum: 1950, maximum: 2100 })
  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(2100)
  year?: number;

  @ApiProperty({ enum: CAR_COLORS, example: 'white' })
  @IsIn(CAR_COLORS as unknown as string[])
  color!: CarColor;

  @ApiPropertyOptional({ example: 'Daily driver' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ enum: ['active', 'paused'], example: 'active' })
  @IsOptional()
  @IsEnum(['active', 'paused'])
  status?: CarStatus;

  @ApiProperty({
    description: 'Scanned pre-printed QR sticker (URL or raw code)',
    example: 'RK-8F2K9M',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  qrCode!: string;
}
