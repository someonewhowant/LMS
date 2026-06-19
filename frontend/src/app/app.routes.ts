import { Routes } from '@angular/router';

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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
