import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => PostEntity, (post) => post.category)
  posts: PostEntity[];
}
