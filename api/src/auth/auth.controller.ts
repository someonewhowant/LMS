import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate user and return JWT token' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({ status: 201, description: 'Student successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @Post('register/student')
  async registerStudent(@Body() dto: RegisterStudentDto) {
    return this.authService.registerStudent(dto);
  }

  @ApiOperation({ summary: 'Register a new instructor/teacher' })
  @ApiResponse({ status: 201, description: 'Instructor successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @Post('register/teacher')
  async registerTeacher(@Body() dto: RegisterTeacherDto) {
    return this.authService.registerTeacher(dto);
  }

  @ApiOperation({ summary: 'Register a new administrator' })
  @ApiResponse({ status: 201, description: 'Admin successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @Post('register/admin')
  async registerAdmin(@Body() dto: RegisterStudentDto) {
    return this.authService.registerAdmin(dto);
  }

  @ApiOperation({ summary: 'Get current user profile info' })
  @ApiResponse({ status: 200, description: 'Profile info retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }
}
