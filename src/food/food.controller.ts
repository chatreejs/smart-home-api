import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FoodRequest } from 'src/core/model/request/food-request';
import {
  FoodResponse,
  FoodStatus,
} from 'src/core/model/response/food-response';
import { Food } from './food.entity';
import { FoodService } from './food.service';

@ApiTags('Food')
@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Version('1')
  @Get()
  @ApiResponse({ type: [FoodResponse] })
  async getFoods(): Promise<FoodResponse[]> {
    const foods = await this.foodService.findAll();
    if (foods.length == 0) {
      return null;
    }
    return foods.map((food) => {
      const now = new Date();
      return <FoodResponse>{
        ...food,
        status: this.getExpirationStatus(food),
      };
    });
  }

  @Version('1')
  @Get('index')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<FoodResponse>> {
    limit = limit > 100 ? 100 : limit;
    const pagination = await this.foodService.paginate({
      page,
      limit,
    });
    return <Pagination<FoodResponse>>{
      items: pagination.items.map((food) => {
        const now = new Date();
        return <FoodResponse>{
          ...food,
          status: this.getExpirationStatus(food),
        };
      }),
      meta: pagination.meta,
    };
  }

  @Version('1')
  @Get(':foodId')
  @ApiParam({ name: 'foodId' })
  @ApiResponse({ type: FoodResponse })
  async getFoodById(@Param('foodId') foodId: string): Promise<FoodResponse> {
    const food = await this.foodService.findById(+foodId);
    if (food === null || food === undefined) {
      throw new NotFoundException();
    }
    const now = new Date();
    return <FoodResponse>{
      ...food,
      status: this.getExpirationStatus(food),
    };
  }

  @Version('1')
  @Post()
  @ApiBody({ type: FoodRequest })
  createFood(@Body() food: FoodRequest) {
    this.foodService.createFood(food);
  }

  @Version('1')
  @Patch(':foodId')
  updateFood(@Param('foodId') foodId: string) {
    return null;
  }

  @Version('1')
  @Delete()
  deleteFood() {
    return null;
  }

  private getExpirationStatus(food: Food): FoodStatus {
    const now = new Date();
    const dateDiff = food.expireDate.getTime() - now.getTime();
    if (dateDiff < 0) {
      return FoodStatus.Expired;
    } else if (dateDiff < 1000 * 60 * 60 * 24 * 3) {
      return FoodStatus.Soon;
    }
    return FoodStatus.Active;
  }
}
