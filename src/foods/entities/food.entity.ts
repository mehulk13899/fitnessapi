import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { UserT } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { NutritionalSchema } from './nutritional_contents.entity';

export class NutritionalContents extends CoreEntity {
  calcium: number;
  carbohydrates: number;
  cholesterol: number;
  energy: {
    unit: string;
    value: number;
  };
  fat: number;
  fiber: number;
  iron: number;
  monounsaturated_fat: number;
  polyunsaturated_fat: number;
  potassium: number;
  protein: number;
  saturated_fat: number;
  sodium: number;
  sugar: number;
  trans_fat: number;
  vitamin_a: number;
  vitamin_c: number;
}

export class Water extends CoreEntity {
  unit: string;
  contains: number;
}
export class Food extends CoreEntity {
  country_code: string;
  deleted: boolean;
  description: string;
  food_id: number;
  food_name: string;
  nutritional_contents: NutritionalContents;
  serving_sizes: number;
}
export class Foods extends CoreEntity {
  breakfast: Array<Food>;
  lunch: Array<Food>;
  dinner: Array<Food>;
  snacks: Array<Food>;
  water: Water;
}

@Entity('foods')
export class FoodSchema extends CoreEntityT {
  @Column({ nullable: true })
  country_code: string;
  @Column({ nullable: true })
  deleted: boolean;
  @Column({ nullable: true })
  food_id: number;
  @Column({ nullable: true })
  food_name: string;
  @Column({ nullable: true })
  description: string;
  @Column({ nullable: true })
  serving_sizes: number;

  @Column({ nullable: true })
  type: string;

  @OneToOne(() => NutritionalSchema, (nt: NutritionalSchema) => nt.food, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  nutritional_contents: NutritionalSchema;

  @ManyToOne(() => UserT, (tag: UserT) => tag.foods, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserT;
}
