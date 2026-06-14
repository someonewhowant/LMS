import { PrismaService } from '../prisma/prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
export declare class AchievementsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateAchievementDto): Promise<{
        description: string;
        name: string;
        id: number;
        points: number;
        createdAt: Date;
        updatedAt: Date;
        iconUrl: string | null;
        criteria: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        description: string;
        name: string;
        id: number;
        points: number;
        createdAt: Date;
        updatedAt: Date;
        iconUrl: string | null;
        criteria: string;
    }[]>;
    grantAchievement(userId: number, criteria: string): Promise<({
        achievement: {
            description: string;
            name: string;
            id: number;
            points: number;
            createdAt: Date;
            updatedAt: Date;
            iconUrl: string | null;
            criteria: string;
        };
    } & {
        id: number;
        userId: number;
        awardedAt: Date;
        achievementId: number;
    }) | null>;
    getMyAchievements(userId: number): import(".prisma/client").Prisma.PrismaPromise<({
        achievement: {
            description: string;
            name: string;
            id: number;
            points: number;
            createdAt: Date;
            updatedAt: Date;
            iconUrl: string | null;
            criteria: string;
        };
    } & {
        id: number;
        userId: number;
        awardedAt: Date;
        achievementId: number;
    })[]>;
    getLeaderboard(): import(".prisma/client").Prisma.PrismaPromise<{
        email: string;
        role: string;
        id: number;
        points: number;
    }[]>;
}
