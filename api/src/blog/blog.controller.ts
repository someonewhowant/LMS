import { Controller, Get, Post, Param, Body, Query, Request, UseGuards, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BlogService } from './blog.service';

@ApiTags('blog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Получить список всех постов' })
  @Get('posts')
  async getPosts(
    @Query('categoryId') categoryId?: number,
    @Query('tagId') tagId?: number
  ) {
    return this.blogService.getPosts(categoryId, tagId);
  }

  @ApiOperation({ summary: 'Поиск постов блога' })
  @Get('posts/search')
  async searchPosts(@Query('q') query: string) {
    return this.blogService.searchPosts(query || '');
  }

  @ApiOperation({ summary: 'Получить пост по ID или Slug' })
  @Get('posts/:idOrSlug')
  async getPost(@Param('idOrSlug') idOrSlug: string) {
    return this.blogService.getPostByIdOrSlug(idOrSlug);
  }

  @ApiOperation({ summary: 'Создать новый пост' })
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @Post('posts')
  async createPost(
    @Request() req,
    @Body() data: { title: string; content: string; categoryId?: number; tagNames?: string[] }
  ) {
    return this.blogService.createPost(req.user, data);
  }

  @ApiOperation({ summary: 'Добавить комментарий к посту' })
  @Post('posts/:id/comments')
  async createComment(
    @Param('id', ParseIntPipe) postId: number,
    @Request() req,
    @Body() data: { content: string }
  ) {
    return this.blogService.createComment(postId, req.user, data.content);
  }

  @ApiOperation({ summary: 'Получить все категории' })
  @Get('categories')
  async getCategories() {
    return this.blogService.getCategories();
  }

  @ApiOperation({ summary: 'Создать категорию' })
  @UseGuards(RolesGuard)
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
