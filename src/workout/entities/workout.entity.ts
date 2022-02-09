import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('exercises')
export class ExercisesSchema {
  @PrimaryGeneratedColumn()
  auto_id: number;

  @Column({ nullable: true })
  id: string;

  @Column({ nullable: true })
  uuid: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  exercise_base: number;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  creation_date: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  muscles: string;

  @Column({ nullable: true })
  muscles_secondary: string;

  @Column({ nullable: true })
  language: number;

  @Column({ nullable: true })
  license: number;

  @Column({ nullable: true })
  license_author: string;

  @Column('simple-array')
  equipment: number[];

  @Column('simple-array')
  variations: number[];
}

export enum muscle {
  abdominals = 'abdominals',
  hamstrings = 'hamstrings',
  adductors = 'adductors',
  quadriceps = 'quadriceps',
  biceps = 'biceps',
  shoulders = 'shoulders',
  chest = 'chest',
  middle_back = 'middle back',
  calves = 'calves',
  glutes = 'glutes',
  lower_back = 'lower back',
  lats = 'lats',
  triceps = 'triceps',
  traps = 'traps',
  forearms = 'forearms',
  neck = 'neck',
  abductors = 'abductors',
  null = '',

}
export enum forceType {
  pulls = 'pull',
  push = 'push',
  static = 'static',
  null = '',

}
export enum levelType {
  beginner = 'beginner',
  intermediate = 'intermediate',
  expert = 'expert',
  null = '',

}
export enum mechanicType {
  compound = 'compound',
  isolation = 'isolation',
  null = '',

}
export enum equipmentType {
  bodyonly = 'body only',
  machine = 'machine',
  other = 'other',
  foamroll = 'foam roll',
  kettlebells = 'kettlebells',
  dumbbell = 'dumbbell',
  cable = 'cable',
  barbell = 'barbell',
  medicineball = 'medicine ball',
  bands = 'bands',
  exerciseball = 'exercise ball',
  curlbar = 'e-z curl bar',
  null = '',

}
export enum categoryType {
  strength = 'strength',
  stretching = 'stretching',
  plyometrics = 'plyometrics',
  strongman = 'strongman',
  powerlifting = 'powerlifting',
  cardio = 'cardio',
  olympic_weightlifting = 'olympic weightlifting',
  null = '',

}
export class WorkoutModel {
  name: string;
  description: string;
  aliases: string[];
  instructions: string[];
  tips: string[];
  primary_muscles: muscle[];
  secondary_muscles: muscle[];
  force: forceType;
  level: levelType;
  mechanic: mechanicType;
  equipment: equipmentType;
  category: categoryType;
}
@Entity('workout')
export class WorkoutSchema extends CoreEntityT {
  @Column({})
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  aliases: string[];

  @Column('simple-array', { nullable: true })
  instructions: string[];

  @Column('simple-array', { nullable: true })
  tips: string[];

  @Column('simple-array', { nullable: true })
  primaryMuscles: string[];

  @Column('simple-array', { nullable: true })
  secondaryMuscles: string[];

  @Column({
    type: 'enum',
    enum: forceType,
    nullable: true,
  })
  force: forceType;
  @Column({
    type: 'enum',
    enum: levelType,
    nullable: true,
  })
  level: levelType;
  @Column({
    type: 'enum',
    enum: mechanicType,
    nullable: true,
  })
  mechanic: mechanicType;
  @Column({
    type: 'enum',
    enum: equipmentType,
    nullable: true,
  })
  equipment: equipmentType;
  @Column({
    type: 'enum',
    enum: categoryType,
    nullable: true,
  })
  category: categoryType;
}
