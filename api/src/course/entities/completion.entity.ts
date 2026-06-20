import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/user.entity';
import { CourseModuleEntity } from './module.entity';

@Entity('module_completions')
@Unique(['userId', 'moduleId'])
export class ModuleCompletionEntity {
  @ApiProperty({ example: 1, description: 'The unique identifier of the completion entry' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'The student identifier' })
  @Column()
  userId: number;

  @ApiProperty({ example: 1, description: 'The module identifier' })
  @Column()
  moduleId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => CourseModuleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module: CourseModuleEntity;

  @ApiProperty()
  @CreateDateColumn()
  completedAt: Date;
}
