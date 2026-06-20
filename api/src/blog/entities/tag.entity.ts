import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => PostEntity, (post) => post.tags)
  posts: PostEntity[];
}
