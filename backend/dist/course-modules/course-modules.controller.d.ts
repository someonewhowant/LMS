import { CourseModulesService } from './course-modules.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
export declare class CourseModulesController {
    private readonly courseModulesService;
    constructor(courseModulesService: CourseModulesService);
    create(req: any, createCourseModuleDto: CreateCourseModuleDto): Promise<{
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
    update(req: any, id: number, updateCourseModuleDto: UpdateCourseModuleDto): Promise<{
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
    remove(req: any, id: number): Promise<{
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string | null;
        order: number;
        courseId: number;
    }>;
}
