import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(req: any, createCourseDto: CreateCourseDto): import(".prisma/client").Prisma.Prisma__CourseClient<{
        teacher: {
            email: string;
            id: number;
            role: string;
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
            id: number;
            role: string;
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
            id: number;
            role: string;
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
    update(req: any, id: number, updateCourseDto: UpdateCourseDto): Promise<{
        teacher: {
            email: string;
            id: number;
            role: string;
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
    remove(req: any, id: number): Promise<{
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        teacherId: number;
    }>;
}
