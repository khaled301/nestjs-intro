import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserInterface } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ){}

  async create(user: UserInterface): Promise<string>{
    user.password = await bcrypt.hash(user.password, 12);
    const createdUser = await this.userRepository.save(user);

    if(!createdUser){
      return 'Something went wrong!';
    }

    return  `User ${createdUser.name} has created.`;
  }

  async login(email: string, password: string): Promise<[string, boolean, string]>{
    const user = await this.userRepository.findOne({email});

    if(!await bcrypt.compare(password, user.password)){
      return ['Invalid credentials!', false, ''];
    }

    const jwt = await this.jwtService.signAsync({id: user.id});

    return [user.name, true, jwt];
    // return [user.name, true];
  }

  async verifyCookie(cookie: string){
    return await this.jwtService.verifyAsync(cookie);
  }

  async findOne(userId: number) {
    const userData = await this.userRepository.findOne({id: userId});

    if(!userData){
      return false;
    }

    const {password, id, ...results} = userData;

    return results;
  }

  findAll() {
    return `This action returns all users`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
