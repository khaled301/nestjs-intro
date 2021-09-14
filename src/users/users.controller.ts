import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Res, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login( 
    @Body('email') email: string, 
    @Body('password' ) password: string, 
    @Res({passthrough: true}) response: Response 
  ) {
    try {
      const user = await this.usersService.login(email, password);

      if(!user[1]){
        throw new BadRequestException('Invalid credentials');
      }

      response.cookie('jwt', user[2], {httpOnly: true});

      return {
        message: `User ${user[0]} has logged in.`
      };      
    } catch (error) {
      throw new UnauthorizedException(`Something went wrong!`);      
    }
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.usersService.verifyCookie(cookie);

      if(!data){
        throw new UnauthorizedException('Invalid request!');
      }

      const user = await this.usersService.findOne(data['id']);

      if(!user){
        throw new UnauthorizedException('Invalid request!');
      }

      return user;   

    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'User has been logged out.'
    }
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
