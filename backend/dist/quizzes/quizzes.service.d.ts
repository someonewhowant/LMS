import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
export declare class QuizzesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(teacherId: number, userRole: string, data: CreateQuizDto): Promise<({
        questions: ({
            options: {
                id: number;
                text: string;
                isCorrect: boolean;
                questionId: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            quizId: number;
        })[];
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        moduleId: number;
    }) | null>;
    findOne(id: number): Promise<{
        questions: ({
            options: {
                id: number;
                text: string;
                isCorrect: boolean;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            quizId: number;
        })[];
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        moduleId: number;
    }>;
    getQuizForStudent(id: number): Promise<{
        questions: ({
            options: {
                id: number;
                text: string;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            quizId: number;
        })[];
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        moduleId: number;
    }>;
    submitQuiz(id: number, userId: number, dto: SubmitQuizDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        quizId: number;
        score: number;
        total: number;
    }>;
    getMyResults(userId: number): Promise<({
        quiz: {
            description: string | null;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            moduleId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        quizId: number;
        score: number;
        total: number;
    })[]>;
}
