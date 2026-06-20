import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseModule {
  id: number;
  courseId: number;
  title: string;
  description: string;
  order: number;
  theoryContent?: string;
  giftContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  modules?: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogCourse {
  id: number;
  title: string;
  description: string;
  moduleCount: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/courses';

  /** Public catalog — no auth required */
  getPublicCatalog(query?: string): Observable<CatalogCourse[]> {
    const params: Record<string, string> = {};
    if (query?.trim()) params['q'] = query.trim();
    return this.http.get<CatalogCourse[]>(`${this.baseUrl}/catalog`, { params });
  }

  getCourses(): Observable<Course[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Course[]>(this.baseUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getCourseById(id: number): Observable<Course> {
    const token = localStorage.getItem('token');
    return this.http.get<Course>(`${this.baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  createCourse(course: { title: string; description?: string }): Observable<Course> {
    const token = localStorage.getItem('token');
    return this.http.post<Course>(this.baseUrl, course, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  createModule(courseId: number, moduleData: { title: string; description?: string; order?: number; theoryContent?: string; giftContent?: string }): Observable<CourseModule> {
    const token = localStorage.getItem('token');
    return this.http.post<CourseModule>(`${this.baseUrl}/${courseId}/modules`, moduleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateModule(moduleId: number, moduleData: { title?: string; description?: string; order?: number; theoryContent?: string; giftContent?: string }): Observable<CourseModule> {
    const token = localStorage.getItem('token');
    return this.http.patch<CourseModule>(`${this.baseUrl}/modules/${moduleId}`, moduleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteModule(moduleId: number): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.baseUrl}/modules/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
