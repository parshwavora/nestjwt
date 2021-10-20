import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { users } from './user.entity';

@Injectable()
export class AppService {
 constructor(
 @InjectRepository(users) 
 public readonly userRepository:Repository<users>){
 }

// creating users
async create(data:any): Promise<users> {
return this.userRepository.save(data);
 }
//login module
async findone(condition:any): Promise<users>{
  return this.userRepository.findOne(condition)
}
}


