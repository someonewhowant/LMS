import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    create(req: any, createAssignmentDto: CreateAssignmentDto): Promise<{
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
    update(req: any, id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        maxScore: number;
        dueDate: Date | null;
        moduleId: number;
    }>;
    remove(req: any, id: number): Promise<{
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
