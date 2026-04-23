import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export enum ExchangeType { TO_KRW = 'TO_KRW', FROM_KRW = 'FROM_KRW' }

export class ExchangeDto {
  @ApiProperty({ enum: ExchangeType }) @IsEnum(ExchangeType) direction: ExchangeType;
  @ApiProperty() @IsNumber() @Min(0.01) amount: number;
  @ApiProperty({ example: 'JPY' }) @IsString() currency: string;
}
