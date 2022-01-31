import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('workout')
export class WorkoutSchema {
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
