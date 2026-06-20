import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UserEntity {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'student@eduflow.com', description: 'The email address of the user' })
  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @ApiProperty({ example: 'John Doe', description: 'The full name of the user' })
  @Column()
  fullName: string;

  @ApiProperty({ example: 'student', enum: ['student', 'teacher', 'admin'], description: 'The role of the user' })
  @Column()
  role: 'student' | 'teacher' | 'admin';

  @ApiProperty({ example: 'cs', required: false, description: 'The specialization area (teachers only)' })
  @Column({ nullable: true })
  specialization?: string;

  @ApiProperty({ example: 5, required: false, description: 'Years of experience (teachers only)' })
  @Column({ type: 'int', nullable: true })
  experience?: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
