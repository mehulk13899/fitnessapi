import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserT } from 'src/users/entities/user.entity';
import { getRepository, LessThan, Repository } from 'typeorm';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food, Foods, FoodSchema } from './entities/food.entity';
import { NutritionalSchema } from './entities/nutritional_contents.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(FoodSchema)
    private foodRepository: Repository<FoodSchema>,
  ) {}
  nutritionalSchemaRepositry = getRepository(NutritionalSchema);
  userRepositry = getRepository(UserT);

  async create(createFoodDto: CreateFoodDto, id: number) {
    const user = await this.userRepositry.findOne(id);
    if (!user) {
      return {
        message: 'User not found',
      };
    }
    createFoodDto?.breakfast?.map(async (foodItem: Food) => {
      await this.createfood(foodItem, user, 'breakfast');
    });

    createFoodDto?.lunch?.map(async (foodItem: Food) => {
      await this.createfood(foodItem, user, 'lunch');
    });

    createFoodDto?.snacks?.map(async (foodItem: Food) => {
      await this.createfood(foodItem, user, 'snacks');
    });

    createFoodDto?.dinner?.map(async (foodItem: Food) => {
      await this.createfood(foodItem, user, 'dinner');
    });

    return await this.userRepositry.findOne(id);
  }

  async createfood(foodItem: Food, user: UserT, type: string) {
    const food = new FoodSchema();
    food.country_code = foodItem?.country_code;
    food.deleted = foodItem?.deleted;
    food.description = foodItem?.description;
    food.serving_sizes = foodItem?.serving_sizes;
    food.type = type;
    food.food_id = foodItem?.food_id;

    await this.foodRepository.save(food);
    await this.foodRepository.update({ id: food.id }, { user: user });

    if (foodItem?.nutritional_contents) {
      await this.nutritionalSchemaRepositry.save({
        ...foodItem?.nutritional_contents,
        food: food,
      });
    }
  }
  findAll() {
    return `This action returns all foods`;
  }

  async findOne(id: number, date: string) {
    var result = {
      lunch: [],
      breakfast: [],
      dinner: [],
      snacks: [],
      water: [],
    };
    const dated = new Date(date);
    const userd = await this.userRepositry.findOne(id);
    result.lunch = await this.foodRepository.find({
      where: { type: 'lunch', created_at: LessThan(dated), user: userd },
    });
    result.breakfast = await this.foodRepository.find({
      where: { type: 'breakfast', created_at: LessThan(dated), user: userd },
    });
    result.dinner = await this.foodRepository.find({
      where: { type: 'dinner', created_at: LessThan(dated), user: userd },
    });
    result.snacks = await this.foodRepository.find({
      where: { type: 'snacks', created_at: LessThan(dated), user: userd },
    });
    return result;
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }
}
