import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodSchema } from './entities/food.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodSchema]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'mysecret',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [FoodsController],
  providers: [FoodsService],
})
export class FoodsModule {}
