import { Controller, Get, Post, Param, Body, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService } from './progress.service';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @ApiOperation({ summary: 'Обновить последний открытый курс и модуль пользователя' })
  @ApiResponse({ status: 200, description: 'Данные пользователя успешно обновлены' })
  @Post('last-opened')
  async updateLastOpened(
    @Request() req,
    @Body() data: { courseId: number; moduleId: number }
  ) {
    const userId = req.user.id;
    return this.progressService.updateLastOpened(userId, data.courseId, data.moduleId);
  }

  @ApiOperation({ summary: 'Отметить модуль как выполненный' })
  @ApiResponse({ status: 200, description: 'Модуль успешно помечен как выполненный' })
  @Post('complete/:moduleId')
  async completeModule(
    @Request() req,
    @Param('moduleId', ParseIntPipe) moduleId: number
  ) {
    const userId = req.user.id;
    return this.progressService.completeModule(userId, moduleId);
  }

  @ApiOperation({ summary: 'Получить процент прогресса по курсу для текущего студента' })
  @ApiResponse({ status: 200, description: 'Статистика прогресса успешно возвращена' })
  @Get('course/:courseId')
  async getCourseProgress(
    @Request() req,
    @Param('courseId', ParseIntPipe) courseId: number
  ) {
    const userId = req.user.id;
    return this.progressService.getCourseProgress(userId, courseId);
  }
}
