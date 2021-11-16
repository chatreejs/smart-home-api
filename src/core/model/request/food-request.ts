import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class FoodRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  unit: string;

  @ApiProperty()
  @IsDateString()
  buyDate: string;

  @ApiProperty()
  @IsDateString()
  expireDate: string;
}
