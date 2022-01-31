import { CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { FoodSchema } from './food.entity';

@Entity('nutritions')
export class NutritionalSchema extends CoreEntityT {
  @Column({ nullable: true })
  calcium: number;
  @Column({ nullable: true })
  carbohydrates: number;
  @Column({ nullable: true })
  cholesterol: number;
  @Column('simple-json', { nullable: true })
  energy: {
    unit: string;
    value: number;
  };
  @Column({ nullable: true })
  fat: number;
  @Column({ nullable: true })
  fiber: number;
  @Column({ nullable: true })
  iron: number;
  @Column({ nullable: true })
  monounsaturated_fat: number;
  @Column({ nullable: true })
  polyunsaturated_fat: number;
  @Column({ nullable: true })
  potassium: number;
  @Column({ nullable: true })
  protein: number;
  @Column({ nullable: true })
  saturated_fat: number;
  @Column({ nullable: true })
  sodium: number;
  @Column({ nullable: true })
  sugar: number;
  @Column({ nullable: true })
  trans_fat: number;
  @Column({ nullable: true })
  vitamin_a: number;
  @Column({ nullable: true })
  vitamin_c: number;

  @OneToOne(() => FoodSchema, (ft: FoodSchema) => ft.nutritional_contents, {
    cascade: true,
  })
  food: FoodSchema;
}
