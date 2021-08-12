import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodRequest } from 'src/core/model/request/food-request';
import { Repository } from 'typeorm';
import { Food } from './food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
  ) {}

  async findAll(): Promise<Food[]> {
    return await this.foodRepository.find();
  }

  async findById(id: number): Promise<Food> {
    return await this.foodRepository.findOne(id);
  }

  createFood(data: FoodRequest) {
    const food = new Food();
    food.name = data.name;
    food.quantity = data.quantity;
    food.buyDate = new Date(data.buyDate);
    food.expireDate = new Date(data.expireDate);
    this.foodRepository.save(food);
  }
}
