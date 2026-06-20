import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { CAR_COLORS } from '../../common/schemas/car.schema';
import type { CarColor, CarStatus } from '../../common/schemas/car.schema';

export class UpdateAdminCarDto {
  @ApiPropertyOptional({ example: 'XYZ 9876', minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  plate?: string;

  @ApiPropertyOptional({ example: 'Toyota' })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional({ example: 'Camry' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 2022, minimum: 1950, maximum: 2100 })
  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({ enum: CAR_COLORS, example: 'white' })
  @IsOptional()
  @IsIn(CAR_COLORS as unknown as string[])
  color?: CarColor;

  @ApiPropertyOptional({ example: 'Daily driver' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ enum: ['active', 'paused'], example: 'active' })
  @IsOptional()
  @IsEnum(['active', 'paused'])
  status?: CarStatus;
}
