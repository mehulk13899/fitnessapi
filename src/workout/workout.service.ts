import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { ExerciseList, ExercisModel } from './models/exerciselist.models';
import { Logger } from '@nestjs/common';
import { map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutSchema } from './entities/workout.entity';
@Injectable()
export class WorkoutService {
  private WORKOUT_BASEURL: string =
    'https://wger.de/api/v2/exercise/?format=json&language=2&limit=419';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(WorkoutSchema) private workOut: Repository<WorkoutSchema>,
  ) {}

  async create() {
    let workouts: ExerciseList[] = await this.getAllData();
    console.log(workouts);
    workouts.map(async (workout) => {
      const data = await this.workOut.findOne({ id: workout?.id });
      if (!data) {
        workout.description = workout?.description?.replace(
          /<\/?[^>]+(>|$)/g,
          '',
        );
        await this.workOut.save({ ...workout });
      }
    });
  }
  async findAll() {
    return this.workOut.find();
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
    const data = await this.workOut.findOne({ id: id });
    if (!data) {
      {
        throw new NotFoundException({
          statusCode: 404,
          message: 'WorkOut not found',
          data: '',
        });
      }
    }
    return { data: data };
  }

  update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    return `This action updates a #${id} workout`;
  }

  remove(id: number) {
    var htmlString = "<div><h1>Hello World</h1>\n<p>It's me, Mario</p></div>";
    var txt = htmlString.replace(/<\/?[^>]+(>|$)/g, '');
    console.log(txt);
    return `This action removes a #${id} workout`;
  }
}
