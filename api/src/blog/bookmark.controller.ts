import { Controller, Get, Post, Body, Query, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BlogService } from './blog.service';

@ApiTags('bookmarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Получить все закладки текущего пользователя' })
  @Get()
  async getBookmarks(@Request() req) {
    return this.blogService.getBookmarks(req.user);
  }

  @ApiOperation({ summary: 'Проверить наличие объекта в закладках' })
  @Get('check')
  async checkBookmark(
    @Request() req,
    @Query('targetType') targetType: 'post' | 'course',
    @Query('targetId', ParseIntPipe) targetId: number
  ) {
    return this.blogService.checkBookmark(req.user, targetType, targetId);
  }

  @ApiOperation({ summary: 'Переключить закладку (добавить/удалить)' })
  @Post('toggle')
  async toggleBookmark(
    @Request() req,
    @Body() data: { targetType: 'post' | 'course'; targetId: number }
  ) {
    return this.blogService.toggleBookmark(req.user, data.targetType, data.targetId);
  }
}
