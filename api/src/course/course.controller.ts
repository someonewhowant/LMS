import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CourseService } from './course.service';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // ── Public (no auth) ──────────────────────────────────────

  @ApiOperation({ summary: 'Публичный каталог курсов (без авторизации)' })
  @ApiResponse({ status: 200, description: 'Каталог курсов возвращен' })
  @ApiQuery({ name: 'q', required: false, description: 'Поисковый запрос по названию/описанию' })
  @Get('catalog')
  async catalog(@Query('q') q?: string) {
    return this.courseService.findAllPublic(q);
  }

  // ── Authenticated ─────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить список всех курсов (авторизованный)' })
  @ApiResponse({ status: 200, description: 'Список курсов успешно возвращен' })
  @Get()
  async findAll() {
    return this.courseService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить курс с модулями' })
  @ApiResponse({ status: 200, description: 'Курс успешно возвращен' })
  @ApiResponse({ status: 404, description: 'Курс не найден' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Создать новый курс' })
  @ApiResponse({ status: 201, description: 'Курс успешно создан' })
  @Roles('teacher', 'admin')
  @Post()
  async createCourse(@Body() data: { title: string; description?: string }) {
    return this.courseService.createCourse(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Обновить существующий курс' })
  @ApiResponse({ status: 200, description: 'Курс успешно обновлен' })
  @Roles('teacher', 'admin')
  @Patch(':id')
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { title?: string; description?: string }
  ) {
    return this.courseService.updateCourse(id, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Удалить курс' })
  @ApiResponse({ status: 200, description: 'Курс успешно удален' })
  @Roles('teacher', 'admin')
  @Delete(':id')
  async deleteCourse(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteCourse(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Добавить модуль в курс' })
  @ApiResponse({ status: 201, description: 'Модуль успешно добавлен в курс' })
  @Roles('teacher', 'admin')
  @Post(':id/modules')
  async createModule(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() data: { title: string; description?: string; order?: number; theoryContent?: string; giftContent?: string }
  ) {
    return this.courseService.createModule(courseId, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Обновить существующий модуль' })
  @ApiResponse({ status: 200, description: 'Модуль успешно обновлен' })
  @Roles('teacher', 'admin')
  @Patch('modules/:moduleId')
  async updateModule(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Body() data: { title?: string; description?: string; order?: number; theoryContent?: string; giftContent?: string }
  ) {
    return this.courseService.updateModule(moduleId, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Удалить модуль из курса' })
  @ApiResponse({ status: 200, description: 'Модуль успешно удален' })
  @Roles('teacher', 'admin')
  @Delete('modules/:moduleId')
  async deleteModule(@Param('moduleId', ParseIntPipe) moduleId: number) {
    return this.courseService.deleteModule(moduleId);
  }
}
