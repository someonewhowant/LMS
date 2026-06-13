import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    create(req: any, createBookmarkDto: CreateBookmarkDto): Promise<{
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
    findAll(req: any): import(".prisma/client").Prisma.PrismaPromise<({
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
    remove(req: any, postId: number): Promise<{
        id: number;
        createdAt: Date;
        postId: number;
        userId: number;
    }>;
}
