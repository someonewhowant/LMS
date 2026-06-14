import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AssignmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(teacherId: number, userRole: string, data: CreateAssignmentDto): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        maxScore: number;
        dueDate: Date | null;
        moduleId: number;
    }>;
    findAllByModule(moduleId: number): import(".prisma/client").Prisma.PrismaPromise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        maxScore: number;
        dueDate: Date | null;
        moduleId: number;
    }[]>;
    findOne(id: number): Promise<{
        module: {
            course: {
                description: string | null;
                title: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                isPublished: boolean;
                teacherId: number;
            };
        } & {
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            content: string | null;
            order: number;
            courseId: number;
        };
    } & {
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        maxScore: number;
        dueDate: Date | null;
        moduleId: number;
    }>;
    update(id: number, teacherId: number, userRole: string, data: UpdateAssignmentDto): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        maxScore: number;
        dueDate: Date | null;
        moduleId: number;
    }>;
    remove(id: number, teacherId: number, userRole: string): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        maxScore: number;
        dueDate: Date | null;
        moduleId: number;
    }>;
}
