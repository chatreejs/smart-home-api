import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
    @Query('search') search = '',
  ): Promise<Pagination<FoodResponse>> {
    limit = limit > 100 ? 100 : limit;
    console.log(search);
    const pagination = await this.foodService.paginateFilterByName(
      {
        page,
        limit,
      },
      search,
    );
    return <Pagination<FoodResponse>>{
      items: pagination.items.map((food) => {
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
    return <FoodResponse>{
      ...food,
      status: this.getExpirationStatus(food),
    };
  }

  @Version('1')
  @Post()
  @ApiBody({ type: FoodRequest })
  createFood(@Body() food: FoodRequest): void {
    this.foodService.createFood(food);
  }

  @Version('1')
  @Put(':foodId')
  @ApiParam({ name: 'foodId' })
  @ApiBody({ type: FoodRequest })
  async updateFood(
    @Param('foodId') foodId: string,
    @Body() foodRequest: FoodRequest,
  ): Promise<void> {
    const food = await this.foodService.findById(+foodId);
    if (food === null || food === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.foodService.updateFood(+foodId, foodRequest);
  }

  @Version('1')
  @Delete(':foodId')
  @ApiParam({ name: 'foodId' })
  async deleteFood(@Param('foodId') foodId: string): Promise<void> {
    const food = await this.foodService.findById(+foodId);
    if (food === null || food === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.foodService.deleteFood(+foodId);
  }

  @Version('1')
  @Delete()
  @ApiQuery({ name: 'foodIds', required: true })
  async deleteFoods(@Query('foodIds') foodIds: string): Promise<void> {
    const foodIdsArray = foodIds.split('^').map((id) => +id);
    const foods = await this.foodService.findByIds(foodIdsArray);
    if (foods.length === 0) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.foodService.deleteMultipleFoods(foodIdsArray);
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
