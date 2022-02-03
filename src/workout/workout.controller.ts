import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WorkOut')
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

  @Post('getWorkoutById/:id')
  getWorkoutById(@Param('id') id: string) {
    return this.workoutService.getWorkoutById(id);
  }

  @Get('getAllexercises')
  findAll() {
    return this.workoutService.findAll();
  }

  @Get('getexercisesById/:id')
  findOne(@Param('id') id: string) {
    return this.workoutService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWorkoutDto: UpdateWorkoutDto) {
  //   return this.workoutService.update(+id, updateWorkoutDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.workoutService.remove(+id);
  // }
}
