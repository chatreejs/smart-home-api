import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class FoodRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsDateString()
  buyDate: string;

  @ApiProperty()
  @IsDateString()
  expireDate: string;
}
