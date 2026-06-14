import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/api/quizzes`;

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private http = inject(HttpClient);

  getQuiz(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/${id}`);
  }

  submitQuiz(id: number, answers: Record<number, number>): Observable<any> {
    return this.http.post<any>(`${API_URL}/${id}/submit`, { answers });
  }

  getMyResults(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/my/results`);
  }
}
