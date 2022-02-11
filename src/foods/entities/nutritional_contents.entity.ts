import { CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { FoodSchema } from './food.entity';

@Entity('nutritions')
export class NutritionalSchema extends CoreEntityT {
  @Column({ type: "float8", nullable: true })
  calcium: number;
  @Column({ type: "float8", nullable: true })
  carbohydrates: number;
  @Column({ type: "float8", nullable: true })
  cholesterol: number;
  @Column('simple-json', { nullable: true })
  energy: {
    unit: string;
    value: number;
  };
  @Column({ type: "float8", nullable: true })
  fat: number;
  @Column({ type: "float8", nullable: true })
  fiber: number;
  @Column({ type: "float8", nullable: true })
  iron: number;
  @Column({ type: "float8", nullable: true })
  monounsaturated_fat: number;
  @Column({ type: "float8", nullable: true })
  polyunsaturated_fat: number;
  @Column({ type: "float8", nullable: true })
  potassium: number;
  @Column({ type: "float8", nullable: true })
  protein: number;
  @Column({ type: "float8", nullable: true })
  saturated_fat: number;
  @Column({ type: "float8", nullable: true })
  sodium: number;
  @Column({ type: "float8", nullable: true })
  sugar: number;
  @Column({ type: "float8", nullable: true })
  trans_fat: number;
  @Column({ type: "float8", nullable: true })
  vitamin_a: number;
  @Column({ type: "float8", nullable: true })
  vitamin_c: number;

  @OneToOne(() => FoodSchema, (ft: FoodSchema) => ft.nutritional_contents, {
    cascade: true,
  })
  food: FoodSchema;
}
