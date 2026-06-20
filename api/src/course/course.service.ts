import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from './entities/course.entity';
import { CourseModuleEntity } from './entities/module.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(CourseModuleEntity)
    private readonly moduleRepo: Repository<CourseModuleEntity>
  ) {}

  async findAll(): Promise<CourseEntity[]> {
    return this.courseRepo.find({
      relations: { modules: true },
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: number): Promise<CourseEntity> {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: { modules: true }
    });

    if (!course) {
      throw new NotFoundException(`Курс с ID ${id} не найден`);
    }

    // Sort modules by order ascending
    course.modules.sort((a, b) => a.order - b.order);
    return course;
  }

  async createCourse(data: { title: string; description?: string }): Promise<CourseEntity> {
    const course = this.courseRepo.create(data);
    return this.courseRepo.save(course);
  }

  async updateCourse(id: number, data: { title?: string; description?: string }): Promise<CourseEntity> {
    const course = await this.findOne(id);
    Object.assign(course, data);
    return this.courseRepo.save(course);
  }

  async deleteCourse(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepo.remove(course);
  }

  async findModule(moduleId: number): Promise<CourseModuleEntity> {
    const mod = await this.moduleRepo.findOne({
      where: { id: moduleId },
      relations: { course: true }
    });
    if (!mod) {
      throw new NotFoundException(`Модуль с ID ${moduleId} не найден`);
    }
    return mod;
  }

  async createModule(courseId: number, data: { title: string; description?: string; order?: number; theoryContent?: string; giftContent?: string }): Promise<CourseModuleEntity> {
    // Verify course exists
    await this.findOne(courseId);

    const mod = this.moduleRepo.create({
      ...data,
      courseId
    });
    return this.moduleRepo.save(mod);
  }

  async updateModule(moduleId: number, data: { title?: string; description?: string; order?: number; theoryContent?: string; giftContent?: string }): Promise<CourseModuleEntity> {
    const mod = await this.findModule(moduleId);
    Object.assign(mod, data);
    return this.moduleRepo.save(mod);
  }

  async deleteModule(moduleId: number): Promise<void> {
    const mod = await this.findModule(moduleId);
    await this.moduleRepo.remove(mod);
  }
}
