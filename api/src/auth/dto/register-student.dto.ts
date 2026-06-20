import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterStudentDto {
  @ApiProperty({ example: 'student@eduflow.com', description: 'Student email' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Student password' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Student full name' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;
}
