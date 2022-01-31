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

  @Post('createWorkoutTable')
  create() {
    return this.workoutService.create();
  }

  @Get('getAllWorkout')
  findAll() {
    return this.workoutService.findAll();
  }

  @Get('getWorkoutById/:id')
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
