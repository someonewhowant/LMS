import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(teacherId: number, data: CreateCourseDto): import(".prisma/client").Prisma.Prisma__CourseClient<{
        teacher: {
            email: string;
            role: string;
            id: number;
        };
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        teacherId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        teacher: {
            email: string;
            role: string;
            id: number;
        };
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        teacherId: number;
    })[]>;
    findOne(id: number): Promise<{
        teacher: {
            email: string;
            role: string;
            id: number;
        };
        modules: ({
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
        })[];
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        teacherId: number;
    }>;
    update(id: number, teacherId: number, userRole: string, data: UpdateCourseDto): Promise<{
        teacher: {
            email: string;
            role: string;
            id: number;
        };
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        teacherId: number;
    }>;
    remove(id: number, teacherId: number, userRole: string): Promise<{
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        teacherId: number;
    }>;
}
