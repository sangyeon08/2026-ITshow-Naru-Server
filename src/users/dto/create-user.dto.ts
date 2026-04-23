import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsArray } from 'class-validator';
import { Nationality } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(6) password: string;
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional({ enum: Nationality }) @IsOptional() @IsEnum(Nationality) nationality?: Nationality;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() allergies?: string[];
}
