import { User } from './user.model';

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string | Date;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  author?: User;
  categoryId: number;
  category?: Category;
  tags?: Tag[];
  comments?: Comment[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  author?: User;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Bookmark {
  id: number;
  userId: number;
  postId: number;
  post?: Post;
  createdAt: string | Date;
}
