import { PrismaService } from '../prisma/prisma.service';
import { TrackActivityDto } from './dto/track-activity.dto';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    trackActivity(userId: number, dto: TrackActivityDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        action: string;
        details: string | null;
    }>;
    getDashboard(userId: number): Promise<{
        points: number;
        totalEnrollments: number;
        totalQuizzesTaken: number;
        totalAchievements: number;
        lastLoginAt: Date | null | undefined;
        recentActivities: {
            id: number;
            createdAt: Date;
            userId: number;
            action: string;
            details: string | null;
        }[];
    }>;
}
