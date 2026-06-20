import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CategoryEntity } from './entities/category.entity';
import { TagEntity } from './entities/tag.entity';
import { CommentEntity } from './entities/comment.entity';
import { BookmarkEntity } from './entities/bookmark.entity';
import { UserEntity } from '../user/user.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BookmarkController } from './bookmark.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      CategoryEntity,
      TagEntity,
      CommentEntity,
      BookmarkEntity,
      UserEntity
    ])
  ],
  controllers: [BlogController, BookmarkController],
  providers: [BlogService],
  exports: [BlogService]
})
export class BlogModule {}
