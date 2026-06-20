import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { CourseModuleEntity } from './entities/module.entity';
import { ModuleCompletionEntity } from './entities/completion.entity';
import { UserEntity } from '../user/user.entity';
import { CourseService } from './course.service';
import { ProgressService } from './progress.service';
import { CourseController } from './course.controller';
import { ProgressController } from './progress.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseModuleEntity,
      ModuleCompletionEntity,
      UserEntity
    ])
  ],
  controllers: [CourseController, ProgressController],
  providers: [CourseService, ProgressService],
  exports: [CourseService, ProgressService]
})
export class CourseModule {}
