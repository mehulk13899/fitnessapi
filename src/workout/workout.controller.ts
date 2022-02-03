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

@ApiTags('WorkOut & Exercises')
@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post('createxercisesTable')
  create() {
    return this.workoutService.create();
  }

  @Post('createWorkoutTable')
  createWorkoutTable() {
    return this.workoutService.createWorkoutTable();
  }

  @Get('GetworkoutbyCategoryId')
  @ApiQuery({ name: 'category', enum: categoryType })
  getWorkoutById(
    @Query('category') category: categoryType = categoryType.cardio,
  ) {
    return this.workoutService.getWorkoutById(category);
  }

  @Get('getAllexercises')
  findAll() {
    return this.workoutService.findAll();
  }

  @Get('getAllworkouts')
  findAllworkout() {
    return this.workoutService.findAllworkout();
  }
  // @Get('GetworkoutbyCategoryId')
  // @ApiQuery({ name: 'category', enum: categoryType })
  // findOne(@Query('category') category: categoryType = categoryType.cardio) {
  //   return this.workoutService.findOne(category);
  // }
}
