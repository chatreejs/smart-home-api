import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  createFood(data) {
    const food = new Food();
    food.name = data.name;
    food.quantity = data.quantity;
    food.buyDate = new Date(data.buyDate * 1000);
    food.expireDate = new Date(data.expireDate * 1000);
    this.foodRepository.save(food);
  }
}
