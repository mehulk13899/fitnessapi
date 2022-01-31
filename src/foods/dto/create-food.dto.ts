import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  isArray,
  IsBoolean,
  IsEmpty,
  IsNumber,
  IsObject,
  isObject,
  IsString,
} from 'class-validator';

export class NutritionsDto {
  @IsNumber()
  @ApiPropertyOptional()
  calcium?: number;
  @IsNumber()
  @ApiPropertyOptional()
  carbohydrates?: number;
  @IsNumber()
  @ApiPropertyOptional()
  cholesterol?: number;
  @ApiPropertyOptional()
  @IsObject()
  energy?: {
    unit?: string;
    value?: number;
  };
  @IsNumber()
  @ApiPropertyOptional()
  fat?: number;
  @IsNumber()
  @ApiPropertyOptional()
  fiber?: number;
  @IsNumber()
  @ApiPropertyOptional()
  iron?: number;
  @IsNumber()
  @ApiPropertyOptional()
  monounsaturated_fat?: number;
  @IsNumber()
  @ApiPropertyOptional()
  polyunsaturated_fat?: number;
  @IsNumber()
  @ApiPropertyOptional()
  potassium?: number;
  @IsNumber()
  @ApiPropertyOptional()
  protein?: number;
  @IsNumber()
  @ApiPropertyOptional()
  saturated_fat?: number;
  @IsNumber()
  @ApiPropertyOptional()
  sodium?: number;
  @IsNumber()
  @ApiPropertyOptional()
  sugar?: number;
  @IsNumber()
  @ApiPropertyOptional()
  trans_fat?: number;
  @IsNumber()
  @ApiPropertyOptional()
  vitamin_a?: number;
  @IsNumber()
  @ApiPropertyOptional()
  vitamin_c?: number;
}

export class WaterDto {
  @IsString()
  @ApiPropertyOptional()
  unit: string;
  @IsNumber()
  @ApiPropertyOptional()
  contains: number;
}

export class FoodDto {
  @IsString()
  @ApiPropertyOptional()
  country_code: string;
  @IsBoolean()
  @ApiPropertyOptional()
  deleted: boolean;
  @IsString()
  @ApiPropertyOptional()
  description: string;
  @IsNumber()
  @ApiPropertyOptional()
  food_id: number;
  @ApiPropertyOptional()
  @IsObject()
  nutritional_contents: NutritionsDto;
  @IsNumber()
  @ApiPropertyOptional()
  serving_sizes: number;
}

export class CreateFoodDto {
  @ApiPropertyOptional()
  breakfast?: Array<FoodDto>;

  @ApiPropertyOptional()
  lunch?: Array<FoodDto>;

  @ApiPropertyOptional()
  dinner?: Array<FoodDto>;

  @ApiPropertyOptional()
  snacks?: Array<FoodDto>;

  @ApiPropertyOptional()
  water?: WaterDto;
}
