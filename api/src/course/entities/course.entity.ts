import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CourseModuleEntity } from './module.entity';

@Entity('courses')
export class CourseEntity {
  @ApiProperty({ example: 1, description: 'The unique identifier of the course' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Introduction to Angular', description: 'The title of the course' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Learn the basics of Angular framework', description: 'The course description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => CourseModuleEntity, (module) => module.course, { cascade: true })
  modules: CourseModuleEntity[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
