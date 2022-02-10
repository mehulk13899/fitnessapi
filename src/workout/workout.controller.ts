import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { categoryType } from './entities/workout.entity';
import { GetExercisesDto } from './dto/create-workout.dto';

@ApiTags('WorkOut & Exercises')
@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post('create_exercises_table')
  create() {
    return this.workoutService.create();
  }

  @Get('get_exercises_by_categoryid')
  @ApiQuery({ name: 'category', enum: categoryType })
  getWorkoutById(
    @Query('category') category: categoryType = categoryType.cardio,
  ) {
    return this.workoutService.getWorkoutById(category);
  }

  @Get('get_all_exercises')
  findAllworkout(@Query() query: GetExercisesDto) {
    return this.workoutService.findAllworkout(query);
  }
  // @Get('GetworkoutbyCategoryId')
  // @ApiQuery({ name: 'category', enum: categoryType })
  // findOne(@Query('category') category: categoryType = categoryType.cardio) {
  //   return this.workoutService.findOne(category);
  // }
}
