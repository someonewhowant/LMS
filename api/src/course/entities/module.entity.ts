import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CourseEntity } from './course.entity';

@Entity('course_modules')
export class CourseModuleEntity {
  @ApiProperty({ example: 1, description: 'The unique identifier of the module' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'The parent course identifier' })
  @Column()
  courseId: number;

  @ApiProperty({ example: 'Introduction to Components', description: 'The title of the module' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Learn about Angular components, selectors, and templates.', description: 'The description of the module' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 1, description: 'The order of the module within the course' })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiProperty({ example: '# Component Basics\n...', description: 'Theory content in Markdown format' })
  @Column({ type: 'text', nullable: true })
  theoryContent: string;

  @ApiProperty({ example: '// GIFT format quiz\n::Q1:: What is... {=Correct ~Wrong}', description: 'Quiz content in GIFT format' })
  @Column({ type: 'text', nullable: true })
  giftContent: string;

  @ManyToOne(() => CourseEntity, (course) => course.modules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: CourseEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
