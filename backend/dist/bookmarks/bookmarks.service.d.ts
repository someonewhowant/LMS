import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
export declare class BookmarksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, data: CreateBookmarkDto): Promise<{
        post: {
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            published: boolean;
            categoryId: number;
            authorId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        postId: number;
        userId: number;
    }>;
    findAllByUser(userId: number): import(".prisma/client").Prisma.PrismaPromise<({
        post: {
            category: {
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
            };
            tags: {
                name: string;
                id: number;
                createdAt: Date;
            }[];
        } & {
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            published: boolean;
            categoryId: number;
            authorId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        postId: number;
        userId: number;
    })[]>;
    remove(userId: number, postId: number): Promise<{
        id: number;
        createdAt: Date;
        postId: number;
        userId: number;
    }>;
}
