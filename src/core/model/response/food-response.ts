import { ApiProperty } from '@nestjs/swagger';

export class FoodResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  buyDate: Date;

  @ApiProperty()
  expireDate: Date;

  @ApiProperty()
  status: FoodStatus;
}

export enum FoodStatus {
  Active = 'active',
  Soon = 'soon',
  Expired = 'expired',
}
