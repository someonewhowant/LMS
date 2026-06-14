import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
export declare class CourseModulesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(teacherId: number, userRole: string, data: CreateCourseModuleDto): Promise<{
        assignments: {
            description: string;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            maxScore: number;
            dueDate: Date | null;
            moduleId: number;
        }[];
    } & {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string | null;
        order: number;
        courseId: number;
    }>;
    findAllByCourse(courseId: number): import(".prisma/client").Prisma.PrismaPromise<({
        assignments: {
            description: string;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            maxScore: number;
            dueDate: Date | null;
            moduleId: number;
        }[];
    } & {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string | null;
        order: number;
        courseId: number;
    })[]>;
    findOne(id: number): Promise<{
        course: {
            description: string | null;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isPublished: boolean;
            teacherId: number;
        };
        assignments: {
            description: string;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            maxScore: number;
            dueDate: Date | null;
            moduleId: number;
        }[];
    } & {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string | null;
        order: number;
        courseId: number;
    }>;
    update(id: number, teacherId: number, userRole: string, data: UpdateCourseModuleDto): Promise<{
        assignments: {
            description: string;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            maxScore: number;
            dueDate: Date | null;
            moduleId: number;
        }[];
    } & {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string | null;
        order: number;
        courseId: number;
    }>;
    remove(id: number, teacherId: number, userRole: string): Promise<{
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string | null;
        order: number;
        courseId: number;
    }>;
}
