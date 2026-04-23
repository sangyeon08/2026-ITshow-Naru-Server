import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, Min, ValidateNested, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty() @IsUUID() menuId: string;
  @ApiProperty() @IsNumber() @Min(1) quantity: number;
}

export class CreateOrderDto {
  @ApiProperty() @IsUUID() storeId: string;
  @ApiProperty({ type: [CreateOrderItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => CreateOrderItemDto) items: CreateOrderItemDto[];
  @ApiProperty() @IsString() @IsNotEmpty() deliveryAddress: string;
  @ApiProperty() @IsString() @IsNotEmpty() paymentMethod: string;
  @ApiPropertyOptional() @IsOptional() @IsString() specialRequest?: string;
}
