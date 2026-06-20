import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/landing/landing').then((m) => m.LandingComponent)
  },
  {
    path: 'courses',
    loadComponent: () => import('./components/course-catalog/course-catalog').then((m) => m.CourseCatalogComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about-platform/about-platform').then((m) => m.AboutPlatformComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/profile-settings/profile-settings').then((m) => m.ProfileSettingsComponent),
    canActivate: [roleGuard(['student', 'teacher', 'admin'])]
  },
  {
    path: 'register/student',
    loadComponent: () => import('./components/register-student/register-student').then((m) => m.RegisterStudentComponent)
  },
  {
    path: 'register/teacher',
    loadComponent: () => import('./components/register-teacher/register-teacher').then((m) => m.RegisterTeacherComponent)
  },
  {
    path: 'student/dashboard',
    loadComponent: () => import('./components/student-dashboard/student-dashboard').then((m) => m.StudentDashboardComponent),
    canActivate: [roleGuard(['student'])]
  },
  {
    path: 'student/course/:courseId',
    loadComponent: () => import('./components/course-details/course-details').then((m) => m.CourseDetailsComponent),
    canActivate: [roleGuard(['student'])]
  },
  {
    path: 'student/course/:courseId/module/:moduleId',
    loadComponent: () => import('./components/module-viewer/module-viewer').then((m) => m.ModuleViewerComponent),
    canActivate: [roleGuard(['student'])]
  },
  {
    path: 'student/coding_sandbox',
    loadComponent: () => import('./components/student-coding-sandbox/student-coding-sandbox').then((m) => m.StudentCodingSandboxComponent),
    canActivate: [roleGuard(['student'])]
  },
  {
    path: 'teacher/dashboard',
    loadComponent: () => import('./components/teacher-dashboard/teacher-dashboard').then((m) => m.TeacherDashboardComponent),
    canActivate: [roleGuard(['teacher'])]
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
    canActivate: [roleGuard(['admin', 'teacher'])]
  },
  {
    path: 'blog',
    loadComponent: () => import('./components/blog-list/blog-list').then((m) => m.BlogListComponent),
    canActivate: [roleGuard(['student', 'teacher', 'admin'])]
  },
  {
    path: 'blog/post/:idOrSlug',
    loadComponent: () => import('./components/post-detail/post-detail').then((m) => m.PostDetailComponent),
    canActivate: [roleGuard(['student', 'teacher', 'admin'])]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
