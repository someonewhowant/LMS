import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
