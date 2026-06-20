export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  specialization?: string;
  experience?: number;
  lastOpenedCourseId?: number;
  lastOpenedModuleId?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
