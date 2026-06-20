import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Raken Admin', minLength: 2 })
  @IsString()
  @MinLength(2)
  fullName!: string;

  @ApiProperty({ example: 'admin@raken.app' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '+966501111111' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'secureAdminPass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
