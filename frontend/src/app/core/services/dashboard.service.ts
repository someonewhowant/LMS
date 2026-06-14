import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

import { environment } from '../../../environments/environment';

const ANALYTICS_API = `${environment.apiUrl}/api/analytics`;
const ENROLLMENTS_API = `${environment.apiUrl}/api/enrollments`;

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

  enroll(courseId: number): Observable<any> {
    return this.http.post(ENROLLMENTS_API, { courseId });
  }

  trackActivity(action: string, details?: string): Observable<any> {
    return this.http.post(`${ANALYTICS_API}/track`, { action, details });
  }
}
