import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

const ANALYTICS_API = 'http://localhost:3000/api/analytics';
const ENROLLMENTS_API = 'http://localhost:3000/api/enrollments';

export interface DashboardStats {
  points: number;
  totalEnrollments: number;
  totalQuizzesTaken: number;
  totalAchievements: number;
  lastLoginAt: string;
  recentActivities: any[];
}

export interface EnrollmentResponse {
  id: number;
  createdAt: string;
  course: Course;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${ANALYTICS_API}/dashboard`);
  }

  getEnrolledCourses(): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(ENROLLMENTS_API);
  }
}
