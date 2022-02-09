import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FoodsModule } from './foods/foods.module';
import { WorkoutModule } from './workout/workout.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, 
      host: "localhost", // reema - 09-02-2022
      port: +process.env.DB_PORT,
      port: 5432, // reema - 09-02-2022
      username: process.env.DB_USER,
      username: "postgres", // reema - 09-02-2022
      password: process.env.DB_PASSWORD,
      password:"actowis", // reema - 09-02-2022
      database: process.env.DB_NAME,
      database:"fitnessapp", // reema - 09-02-2022
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize:process.env.SYNCHRONIZE?true:false,
      synchronize:true, // reema - 09-02-2022
      autoLoadEntities: process.env.SYNCHRONIZE?true:false,
      autoLoadEntities: true,// reema - 09-02-2022
    }),
    FoodsModule,
    WorkoutModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


