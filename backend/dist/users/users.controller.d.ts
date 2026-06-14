import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(data: CreateUserDto): Promise<{
        id: number;
        email: string;
        password: string;
        role: string;
        points: number;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: number;
        email: string;
        password: string;
        role: string;
        points: number;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        email: string;
        password: string;
        role: string;
        points: number;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, data: UpdateUserDto): Promise<{
        id: number;
        email: string;
        password: string;
        role: string;
        points: number;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: number;
        email: string;
        password: string;
        role: string;
        points: number;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
