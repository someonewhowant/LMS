import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    enroll(userId: number, data: CreateEnrollmentDto): Promise<{
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
        id: number;
        createdAt: Date;
        userId: number;
        courseId: number;
    }>;
    findAllByUser(userId: number): import(".prisma/client").Prisma.PrismaPromise<({
        course: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        courseId: number;
    })[]>;
    unenroll(userId: number, courseId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        courseId: number;
    }>;
}
