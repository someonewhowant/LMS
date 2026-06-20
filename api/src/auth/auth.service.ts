import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { UserEntity } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(user);
    
    // Remove password before returning
    const userResponse = { ...user };
    delete userResponse.password;

    return {
      token,
      user: userResponse,
    };
  }

  async registerStudent(dto: RegisterStudentDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      role: 'student',
    });

    const token = this.generateToken(newUser);
    const userResponse = { ...newUser };
    delete userResponse.password;

    return {
      token,
      user: userResponse,
    };
  }

  async registerTeacher(dto: RegisterTeacherDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      role: 'teacher',
      specialization: dto.specialization,
      experience: dto.experience,
    });

    const token = this.generateToken(newUser);
    const userResponse = { ...newUser };
    delete userResponse.password;

    return {
      token,
      user: userResponse,
    };
  }

  async registerAdmin(dto: RegisterStudentDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      role: 'admin',
    });

    const token = this.generateToken(newUser);
    const userResponse = { ...newUser };
    delete userResponse.password;

    return {
      token,
      user: userResponse,
    };
  }

  private generateToken(user: UserEntity): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
