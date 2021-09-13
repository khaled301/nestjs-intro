import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserInterface } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ){}

  async create(user: UserInterface): Promise<string>{
    user.password = await bcrypt.hash(user.password, 12);
    const createdUser = await this.userRepository.save(user);
    return  `User ${createdUser.name} has created.`;
  }

  async login(email: string, password: string): Promise<[string, boolean]>{
    const user = await this.userRepository.findOne({email});

    if(!await bcrypt.compare(password, user.password)){
      return ['Invalid credentials!', false];
    }

    return [user.name, true];
  }

  findOne(id: number) {
    return 'findOne';
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
