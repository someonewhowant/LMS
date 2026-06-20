import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseProgress {
  totalModules: number;
  completedModules: number;
  percentage: number;
  completedModuleIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/progress';

  updateLastOpened(courseId: number, moduleId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.baseUrl}/last-opened`, { courseId, moduleId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  completeModule(moduleId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.baseUrl}/complete/${moduleId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getCourseProgress(courseId: number): Observable<CourseProgress> {
    const token = localStorage.getItem('token');
    return this.http.get<CourseProgress>(`${this.baseUrl}/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
