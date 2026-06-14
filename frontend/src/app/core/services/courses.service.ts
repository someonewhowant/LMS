import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/api`;

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private http = inject(HttpClient);

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${API_URL}/courses`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${API_URL}/courses/${id}`);
  }

  createCourse(course: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/courses`, course);
  }

  createModule(module: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/course-modules`, module);
  }

  createAssignment(assignment: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/assignments`, assignment);
  }

  createQuiz(quiz: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/quizzes`, quiz);
  }
}
