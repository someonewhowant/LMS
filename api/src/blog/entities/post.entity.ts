import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { TagEntity } from './tag.entity';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../../user/user.entity';

@Entity('posts')
export class PostEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @ManyToOne(() => CategoryEntity, (category) => category.posts, { onDelete: 'SET NULL', nullable: true })
  category: CategoryEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.posts, { cascade: true })
  @JoinTable({ name: 'post_tags' })
  tags: TagEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true })
  comments: CommentEntity[];

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  author: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
