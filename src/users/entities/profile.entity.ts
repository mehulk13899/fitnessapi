import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  OneToOne,
} from 'typeorm';
import {  UserT } from './user.entity';

export enum FoodPreference {
  NonVegetarian = 'Non-Vegetarian',
  vegetarian = 'vegetarian',
  vegan = 'vegan',
  jain = 'jain',
  eggatarian = 'eggatarian',
}
export enum FitnessLevel {
  beginner = 'beginner',
  intermidiate = 'intermidiate',
  professional = 'professional',
}
export enum Gender {
  male = 'male',
  female = 'female',
}
export class ProfileEntity  {
  photo?: string;
  name?: string;
  gender?: Gender;
  height?: string;
  weight?: string;
  target_weight?: string;
  date_of_birth?: string;
  fat_percentage?: string;
  food_preference?: FoodPreference;
  fitness_level?: FitnessLevel;
  bio?: string;
}

export class UserSocialEntity  {
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  linkedin_link?: string;
}

export class ContactInfoEntity  {
  
  email_verified?: boolean;
  mobile_number?: string;
  mobile_verified?: boolean;
  code?: string;
  country?: string;
}


@Entity('profiles')
export class ProfileSchema extends CoreEntityT {
  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  target_weight: string;

  @Column({ nullable: true })
  date_of_birth: string;

  @Column({ nullable: true })
  fat_percentage: string;

  @Column({
    type: 'enum',
    enum: FoodPreference,
    default: FoodPreference.vegetarian,
  })
  food_preference: FoodPreference;

  @Column({
    type: 'enum',
    enum: FitnessLevel,
    default: FitnessLevel.beginner,
  })
  fitness_level: FitnessLevel;

  @Column({ nullable: true })
  bio: string;

  @OneToOne(() => UserT, (usert: UserT) => usert.profile, {
    cascade: true,
  })
  user: UserT;
}

@Entity('socials')
export class UserSocialSchema extends CoreEntityT {
  @Column({ nullable: true })
  facebook_link: string;

  @Column({ nullable: true })
  instagram_link: string;

  @Column({ nullable: true })
  twitter_link: string;

  @Column({ nullable: true })
  linkedin_link: string;

  @OneToOne(() => UserT, (usert: UserT) => usert.social, {
    cascade: true,
  })
  user: UserT;
}


@Entity('contactinfo')
export class ContactInfoSchema extends CoreEntityT {
  
  @Column({ nullable: true })
  mobile_number: string;
  
  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  code: string;

  @Column({ default: false })
  mobile_verified: boolean;

  @Column({ default: false })
  email_verified: boolean;

  @OneToOne(() => UserT, (usert: UserT) => usert.contact_info, {
    cascade: true,
  })
  user: UserT;
}

