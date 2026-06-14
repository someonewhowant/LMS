import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/api/achievements`;

export interface Achievement {
  id: number;
  name: string;
  description: string;
  points: number;
  criteria: string;
  iconUrl?: string;
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  awardedAt: string;
  achievement: Achievement;
}

export interface LeaderboardUser {
  id: number;
  email: string;
  points: number;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private http = inject(HttpClient);

  getAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(API_URL);
  }

  getMyAchievements(): Observable<UserAchievement[]> {
    return this.http.get<UserAchievement[]>(`${API_URL}/my`);
  }

  getLeaderboard(): Observable<LeaderboardUser[]> {
    return this.http.get<LeaderboardUser[]>(`${API_URL}/leaderboard`);
  }
}
