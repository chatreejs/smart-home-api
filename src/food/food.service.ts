import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FoodRequest } from 'src/core/model/request/food-request';
import { Repository } from 'typeorm';
import { Food } from './food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Food>> {
    return paginate<Food>(this.foodRepository, options);
  }

  async findAll(): Promise<Food[]> {
    return this.foodRepository.find();
  }

  async findById(id: number): Promise<Food> {
    return this.foodRepository.findOne(id);
  }

  async findByIds(ids: number[]): Promise<Food[]> {
    return this.foodRepository.findByIds(ids);
  }

  createFood(data: FoodRequest): void {
    const food = new Food();
    food.name = data.name;
    food.quantity = data.quantity;
    food.unit = data.unit;
    food.buyDate = new Date(data.buyDate);
    food.expireDate = new Date(data.expireDate);
    this.foodRepository.save(food);
  }

  updateFood(id: number, data: FoodRequest): void {
    const food = new Food();
    food.name = data.name;
    food.quantity = data.quantity;
    food.unit = data.unit;
    food.buyDate = new Date(data.buyDate);
    food.expireDate = new Date(data.expireDate);
    this.foodRepository.update(id, food);
  }

  deleteFood(id: number): void {
    this.foodRepository.delete(id);
  }

  deleteMultipleFoods(ids: number[]): void {
    this.foodRepository.delete(ids);
  }
}
