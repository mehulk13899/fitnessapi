import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get('getAllUser')
  getAllUsers() {
    return this.usersService.getUsers();
  }

  @Get('getUserById/:id')
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put('updateuserprofile/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('deleteUser/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('activeUser/:id')
  activeUser(@Param('id') id: number) {
    return this.usersService.activeUser(id);
  }
  @Post('deactiveUser/:id')
  deactiveUser(@Param('id') id: number) {
    return this.usersService.deactiveUser(id);
  }
}
