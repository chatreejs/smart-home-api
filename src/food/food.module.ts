import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodController } from './food.controller';
import { Food } from './food.entity';
import { FoodService } from './food.service';

@Module({
  imports: [TypeOrmModule.forFeature([Food])],
  providers: [FoodService],
  controllers: [FoodController],
  exports: [FoodService],
})
export class FoodModule {}
