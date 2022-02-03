import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseList, ExercisModel } from './models/exerciselist.models';
import { Logger } from '@nestjs/common';
import { map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ExercisesSchema,
  WorkoutModel,
  WorkoutSchema,
} from './entities/workout.entity';
import workoutJson from './../../exercises.json';

const workout = plainToClass(WorkoutModel, workoutJson.exercises);
@Injectable()
export class WorkoutService {
  private WORKOUT_BASEURL: string =
    'https://wger.de/api/v2/exercise/?format=json&language=2&limit=419';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ExercisesSchema)
    private exercisesRepository: Repository<ExercisesSchema>,
    @InjectRepository(WorkoutSchema)
    private workoutRepository: Repository<WorkoutSchema>,
  ) {}

  async create() {
    let workouts: ExerciseList[] = await this.getAllData();
    workouts.map(async (workout) => {
      const data = await this.exercisesRepository.findOne({ id: workout?.id });
      if (!data) {
        workout.description = workout?.description?.replace(
          /<\/?[^>]+(>|$)/g,
          '',
        );
        await this.exercisesRepository.save({ ...workout });
      }
    });
  }
  async createWorkoutTable() {
    workout.map(async (work) => {
      await this.workoutRepository.save({ ...work });
    });
    return {
      message: 'succses',
    };
  }
  async getWorkoutById(id: string) {
    const data = await this.workoutRepository.findOne({ id: +id });
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
  async findAll() {
    return this.exercisesRepository.find();
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
  async findOne(id: string) {
    const data = await this.exercisesRepository.findOne({ id: id });
    console.log(data);
    if (!data) {
      {
        throw new NotFoundException({
          statusCode: 404,
          message: 'exercises not found',
          data: '',
        });
      }
    }
    return { data: data };
  }
}
