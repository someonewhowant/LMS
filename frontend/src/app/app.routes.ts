import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent)
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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
