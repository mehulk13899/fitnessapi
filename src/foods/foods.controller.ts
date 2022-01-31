import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Foods')
@Controller()
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post('addfood')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  create(@Req() req, @Body() createFoodDto: CreateFoodDto) {
    const id = req?.user?.payload?.id || 1;
    return this.foodsService.create(createFoodDto, id);
  }

  @Get('getfood')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  findOne(@Req() req, @Query('date') date: string) {
    const id = req?.user?.payload?.id || 1;
    return this.foodsService.findOne(+id, date);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
  //   return this.foodsService.update(+id, updateFoodDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.foodsService.remove(+id);
  // }
}
