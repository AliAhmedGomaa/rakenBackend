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
  @IsString()
  @MinLength(2)
  plate!: string;

  @IsString()
  @MinLength(1)
  make!: string;

  @IsString()
  @MinLength(1)
  model!: string;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(2100)
  year?: number;

  @IsIn(CAR_COLORS as unknown as string[])
  color!: CarColor;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEnum(['active', 'paused'])
  status?: CarStatus;
}
