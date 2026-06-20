import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class BatchGenerateDto {
  @ApiProperty({ example: 100, minimum: 1, maximum: 500 })
  @IsInt()
  @Min(1)
  @Max(500)
  count!: number;
}
