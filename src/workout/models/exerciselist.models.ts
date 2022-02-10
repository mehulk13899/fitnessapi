export interface ExercisModel {
  results: ExerciseList[];
  count: number;
  next: string;
  previous: string;
}
export interface ExerciseList {
  id: number;
  uuid: string;
  name: string;
  exercise_base: number;
  status: string;
  description: string;
  creation_date: string;
  muscles: string;
  muscles_secondary: string;
  language: number;
  license: number;
  license_author: string;
  variations: any[];
}
