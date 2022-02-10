export class CreateWorkoutDto { }

export class GetExercisesDto {
  category?: string;
  limit?: number = 15;
}
