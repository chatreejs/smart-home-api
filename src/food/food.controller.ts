import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FoodRequest } from 'src/core/model/request/food-request';
import {
  FoodResponse,
  FoodStatus,
} from 'src/core/model/response/food-response';
import { FoodService } from './food.service';

@ApiTags('Food')
@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @HttpCode(200)
  @HttpCode(204)
  @ApiResponse({ type: [FoodResponse] })
  async getFoods(): Promise<FoodResponse[]> {
    const foods = await this.foodService.findAll();
    if (foods.length == 0) {
      return null;
    }
    return foods.map((food) => {
      const now = new Date();
      return <FoodResponse>{
        id: food.id,
        name: food.name,
        quantity: food.quantity,
        buyDate: food.buyDate,
        expireDate: food.expireDate,
        status: now > food.expireDate ? FoodStatus.Expired : FoodStatus.Active,
      };
    });
  }

  @Get(':foodId')
  @HttpCode(200)
  @HttpCode(404)
  @ApiParam({ name: 'foodId' })
  @ApiResponse({ type: FoodResponse })
  async getFoodById(@Param('foodId') foodId): Promise<FoodResponse> {
    console.log(typeof foodId);
    const food = await this.foodService.findById(foodId);
    if (food == null) {
      return null;
    }
    const now = new Date();
    return <FoodResponse>{
      id: food.id,
      name: food.name,
      quantity: food.quantity,
      buyDate: food.buyDate,
      expireDate: food.expireDate,
      status: now > food.expireDate ? FoodStatus.Expired : FoodStatus.Active,
    };
  }

  @Post()
  @HttpCode(201)
  @ApiBody({ type: FoodRequest })
  createFood(@Body() food: FoodRequest) {
    this.foodService.createFood(food);
  }

  @Patch()
  updateFood() {
    return null;
  }

  @Delete()
  deleteFood() {
    return null;
  }
}
