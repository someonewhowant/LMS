import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class DashboardController {

  @ApiOperation({ summary: 'Access student dashboard data' })
  @ApiResponse({ status: 200, description: 'Student dashboard data retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied: Requires Student role' })
  @Roles('student')
  @Get('student/dashboard')
  getStudentDashboard() {
    return {
      message: 'Welcome to the Student Dashboard!',
      allowedFeatures: [
        'Course learning modules',
        'Tests and practical tasks',
        'Coding sandbox (send solutions)',
        'Peer review of other students',
        'Detailed progress analytics',
        'Chat with teachers'
      ],
      mockData: {
        enrolledCoursesCount: 3,
        overallProgressPercent: 68,
        peerReviewRequests: 2,
        unrepliedMessagesFromTeachers: 1
      }
    };
  }

  @ApiOperation({ summary: 'Access coding sandbox' })
  @ApiResponse({ status: 200, description: 'Sandbox environment initialized' })
  @Roles('student')
  @Get('student/coding_sandbox')
  getCodingSandbox() {
    return {
      message: 'Coding sandbox initialized successfully.',
      environment: 'NodeJS v20',
      allowedSubmissionsLeft: 10
    };
  }

  @ApiOperation({ summary: 'Access teacher dashboard data' })
  @ApiResponse({ status: 200, description: 'Teacher dashboard data retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied: Requires Teacher role' })
  @Roles('teacher')
  @Get('teacher/dashboard')
  getTeacherDashboard() {
    return {
      message: 'Welcome to the Teacher Dashboard!',
      allowedFeatures: [
        'Create, edit, and delete courses, modules, tasks, and tests',
        'View list of students and their profiles, track progress',
        'View course popularity and test difficulty analytics',
        'Chat with students'
      ],
      mockData: {
        activeCourses: 5,
        totalStudentsTaught: 124,
        averageTestCompletionRate: '82%',
        pendingTaskGradingCount: 8
      }
    };
  }

  @ApiOperation({ summary: 'Access administrative resources (Teacher or Admin)' })
  @ApiResponse({ status: 200, description: 'Administrative dashboard data retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied: Requires Admin or Teacher role' })
  @Roles('admin', 'teacher')
  @Get('admin/dashboard')
  getAdminDashboard() {
    return {
      message: 'Welcome to the Administration Panel!',
      allowedFeatures: [
        'Manage courses, modules, tests, and questions',
        'System logs and administrative resources'
      ],
      systemStatus: {
        databaseHealth: 'OK',
        activeUsersCount: 42,
        storageUsage: '14%'
      }
    };
  }

  @ApiOperation({ summary: 'Access blog management resources (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog management resources retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied: Requires Admin role' })
  @Roles('admin')
  @Get('admin/blog')
  getAdminBlog() {
    return {
      message: 'Welcome to Blog Management!',
      allowedFeatures: [
        'Publish new posts',
        'Edit and delete posts',
        'Manage blog categories and tags'
      ],
      mockData: {
        publishedPostsCount: 15,
        draftPostsCount: 3,
        totalBlogViewsCount: 4290
      }
    };
  }
}
