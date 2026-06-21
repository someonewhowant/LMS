import {
  Controller, Get, Post, Put, Delete, Param, Body, Query, Request,
  UseGuards, UseInterceptors, UploadedFile, ParseIntPipe, HttpStatus
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BlogService } from './blog.service';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'blog');

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {
    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  // ── Posts ───────────────────────────────────────────

  @ApiOperation({ summary: 'Получить список всех постов' })
  @Get('posts')
  async getPosts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'newest' | 'oldest' | 'discussed' | 'popular',
    @Query('categoryId') categoryId?: number,
    @Query('tagId') tagId?: number,
    @Query('q') search?: string
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 10;
    return this.blogService.getPosts(p, l, sort, categoryId, tagId, search);
  }

  @ApiOperation({ summary: 'Получить пост по ID или Slug' })
  @Get('posts/:idOrSlug')
  async getPost(@Param('idOrSlug') idOrSlug: string) {
    return this.blogService.getPostByIdOrSlug(idOrSlug);
  }

  @ApiOperation({ summary: 'Создать новый пост' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @Post('posts')
  async createPost(
    @Request() req,
    @Body() data: { title: string; content: string; coverImageUrl?: string; categoryId?: number; tagNames?: string[] }
  ) {
    return this.blogService.createPost(req.user, data);
  }

  @ApiOperation({ summary: 'Обновить пост' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('posts/:id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() data: { title?: string; content?: string; coverImageUrl?: string; categoryId?: number; tagNames?: string[] }
  ) {
    return this.blogService.updatePost(id, req.user, data);
  }

  @ApiOperation({ summary: 'Удалить пост' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('posts/:id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    await this.blogService.deletePost(id, req.user);
    return { deleted: true };
  }

  // ── Comments ───────────────────────────────────────

  @ApiOperation({ summary: 'Добавить комментарий к посту' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('posts/:id/comments')
  async createComment(
    @Param('id', ParseIntPipe) postId: number,
    @Request() req,
    @Body() data: { content: string }
  ) {
    return this.blogService.createComment(postId, req.user, data.content);
  }

  @ApiOperation({ summary: 'Обновить комментарий' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('comments/:id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() data: { content: string }
  ) {
    return this.blogService.updateComment(id, req.user, data.content);
  }

  @ApiOperation({ summary: 'Удалить комментарий' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    await this.blogService.deleteComment(id, req.user);
    return { deleted: true };
  }

  // ── Image Upload ───────────────────────────────────

  @ApiOperation({ summary: 'Загрузить изображение для поста' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        if (!existsSync(UPLOAD_DIR)) {
          mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        cb(null, UPLOAD_DIR);
      },
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
      const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
      if (allowed.test(extname(file.originalname))) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  }))
  async uploadImage(@UploadedFile() file: any) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    const url = `http://localhost:3000/uploads/blog/${file.filename}`;
    return { url, filename: file.filename };
  }

  // ── Categories & Tags ──────────────────────────────

  @ApiOperation({ summary: 'Получить все категории' })
  @Get('categories')
  async getCategories() {
    return this.blogService.getCategories();
  }

  @ApiOperation({ summary: 'Создать категорию' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @Post('categories')
  async createCategory(@Body() data: { name: string }) {
    return this.blogService.createCategory(data.name);
  }

  @ApiOperation({ summary: 'Получить все теги' })
  @Get('tags')
  async getTags() {
    return this.blogService.getTags();
  }
}
