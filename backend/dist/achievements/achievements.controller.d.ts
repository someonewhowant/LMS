import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    create(createAchievementDto: CreateAchievementDto): Promise<{
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
    getMyAchievements(req: any): import(".prisma/client").Prisma.PrismaPromise<({
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
