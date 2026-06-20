import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class RegisterTeacherDto {
  @ApiProperty({ example: 'teacher@eduflow.com', description: 'Teacher email' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Teacher password' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'Dr. Jane Doe', description: 'Teacher full name' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({ example: 'cs', description: 'Specialization/Subject area' })
  @IsString()
  @IsNotEmpty({ message: 'Specialization is required' })
  specialization: string;

  @ApiProperty({ example: 5, description: 'Years of teaching experience' })
  @IsNumber()
  @Min(0, { message: 'Experience cannot be negative' })
  experience: number;
}
