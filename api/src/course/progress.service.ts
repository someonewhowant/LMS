import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CourseModuleEntity } from './entities/module.entity';
import { ModuleCompletionEntity } from './entities/completion.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(CourseModuleEntity)
    private readonly moduleRepo: Repository<CourseModuleEntity>,
    @InjectRepository(ModuleCompletionEntity)
    private readonly completionRepo: Repository<ModuleCompletionEntity>
  ) {}

  async updateLastOpened(userId: number, courseId: number, moduleId: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    user.lastOpenedCourseId = courseId;
    user.lastOpenedModuleId = moduleId;
    return this.userRepo.save(user);
  }

  async completeModule(userId: number, moduleId: number): Promise<ModuleCompletionEntity> {
    // Check if module exists
    const mod = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!mod) {
      throw new NotFoundException(`Модуль с ID ${moduleId} не найден`);
    }

    // Check if already completed
    let completion = await this.completionRepo.findOne({
      where: { userId, moduleId }
    });

    if (!completion) {
      completion = this.completionRepo.create({ userId, moduleId });
      await this.completionRepo.save(completion);
    }

    // Also automatically update last opened module/course
    await this.updateLastOpened(userId, mod.courseId, moduleId);

    return completion;
  }

  async getCourseProgress(userId: number, courseId: number): Promise<{
    totalModules: number;
    completedModules: number;
    percentage: number;
    completedModuleIds: number[];
  }> {
    // Fetch all module IDs of this course
    const modules = await this.moduleRepo.find({
      where: { courseId },
      select: { id: true }
    });

    const totalModules = modules.length;
    if (totalModules === 0) {
      return {
        totalModules: 0,
        completedModules: 0,
        percentage: 0,
        completedModuleIds: []
      };
    }

    const moduleIds = modules.map((m) => m.id);

    // Fetch completions by user for these module IDs
    const completions = await this.completionRepo.find({
      where: {
        userId
      }
    });

    // Filter completions to only those that belong to the course modules
    const courseCompletions = completions.filter((c) => moduleIds.includes(c.moduleId));
    const completedModules = courseCompletions.length;
    const completedModuleIds = courseCompletions.map((c) => c.moduleId);

    const percentage = Math.round((completedModules / totalModules) * 100);

    return {
      totalModules,
      completedModules,
      percentage,
      completedModuleIds
    };
  }
}
