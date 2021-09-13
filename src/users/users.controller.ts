import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserInterface } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string>{
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string): Promise<string>{
    const user = await this.usersService.login(email, password);

    if(!user[1]){
      throw new BadRequestException('Invalid credentials');
    }

    return `User ${user[0]} has logged in.`;
  }

  @Get()
  findAll() {
    return 'This is findAll()';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
