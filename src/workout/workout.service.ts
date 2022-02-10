import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseList, ExercisModel } from './models/exerciselist.models';
import { Logger } from '@nestjs/common';
import { map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  categoryType,
  WorkoutModel,
  WorkoutSchema,
} from './entities/workout.entity';
import workoutJson from './../../exercises.json';
import { GetExercisesDto } from './dto/create-workout.dto';

const workout = plainToClass(WorkoutModel, workoutJson.exercises);
@Injectable()
export class WorkoutService {
  private WORKOUT_BASEURL: string =
    'https://wger.de/api/v2/exercise/?format=json&language=2&limit=419';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(WorkoutSchema)
    private workoutRepository: Repository<WorkoutSchema>,
  ) {}

  async create() {
    let workouts: ExerciseList[] = await this.getAllData();
    workouts.map(async (workout) => {
      const data = await this.workoutRepository.findOne({ id: +workout.id });
      if (!data) {
        workout.description = workout?.description?.replace(
          /<\/?[^>]+(>|$)/g,
          '',
        );
        if (workout['equipment']) {
          var equipment_api = workout['equipment']
          delete workout['equipment'];
        }
        await this.workoutRepository.save({ ...workout, equipment_api });
      }
    });
    workout.map(async (work) => {
      await this.workoutRepository.save({ ...work });
    });
    return {
      message: 'succses',
    };
  }

  async getWorkoutById(id: string) {
    const data = await this.workoutRepository.find({
      category: categoryType[`${id}`],
    });
    if (!data) {
      {
        throw new NotFoundException({
          statusCode: 404,
          message: 'workout not found',
          data: '',
        });
      }
    }
    return { data: data };
  }
  async findAllworkout(query: GetExercisesDto) {
    return this.workoutRepository.find({
      take: query?.limit,
      where: [{
        category: Like(`%${query?.category}%`),
      }]
    });
  }
  async getAllData() {
    let workOutData: ExerciseList[] = [];
    await this.httpService
      .get<ExercisModel>(this.WORKOUT_BASEURL)
      ?.pipe(
        map((response) => {
          if (response.status === 200) {
            return response.data;
          }
          return;
        }),
      )
      .forEach((response) => {
        const list = response.results ?? [];
        workOutData.push(...list);
      });
    return workOutData;
  }

}
