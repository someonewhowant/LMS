import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(req: any, createPostDto: CreatePostDto): Promise<{
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
        author: {
            email: string;
            id: number;
            role: string;
        };
    } & {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        published: boolean;
        categoryId: number;
        authorId: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
        author: {
            email: string;
            id: number;
            role: string;
        };
    } & {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        published: boolean;
        categoryId: number;
        authorId: number;
    })[]>;
    findOne(id: number): Promise<{
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
        author: {
            email: string;
            id: number;
            role: string;
        };
    } & {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        published: boolean;
        categoryId: number;
        authorId: number;
    }>;
    update(id: number, updatePostDto: UpdatePostDto): Promise<{
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
        author: {
            email: string;
            id: number;
            role: string;
        };
    } & {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        published: boolean;
        categoryId: number;
        authorId: number;
    }>;
    remove(id: number): Promise<{
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        published: boolean;
        categoryId: number;
        authorId: number;
    }>;
}
