export interface User {
  id: number;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  points: number;
  lastLoginAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  // Relationships
  achievements?: UserAchievement[];
  activities?: UserActivity[];
}

export interface UserActivity {
  id: number;
  userId: number;
  action: string;
  details?: string;
  createdAt: string | Date;
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  awardedAt: string | Date;
  achievement?: Achievement;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  criteria: string;
  points: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
