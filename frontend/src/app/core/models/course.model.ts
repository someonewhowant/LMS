import { User } from './user.model';

export interface Course {
  id: number;
  title: string;
  description?: string;
  isPublished: boolean;
  teacherId: number;
  teacher?: User;
  modules?: CourseModule[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CourseModule {
  id: number;
  title: string;
  content?: string;
  order: number;
  courseId: number;
  assignments?: Assignment[];
  quizzes?: Quiz[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  maxScore: number;
  dueDate?: string | Date;
  moduleId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  course?: Course;
  createdAt: string | Date;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  moduleId: number;
  questions?: Question[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Question {
  id: number;
  text: string;
  quizId: number;
  options?: QuestionOption[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
  questionId: number;
}

export interface UserQuizResult {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  total: number;
  createdAt: string | Date;
}
