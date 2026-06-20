import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { UserEntity } from '../../user/user.entity';

@Entity('bookmarks')
@Index(['user', 'targetType', 'targetId'], { unique: true })
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column()
  targetType: 'post' | 'course';

  @Column({ type: 'int' })
  targetId: number;

  @CreateDateColumn()
  createdAt: Date;
}
