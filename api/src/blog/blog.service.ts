import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { CategoryEntity } from './entities/category.entity';
import { TagEntity } from './entities/tag.entity';
import { CommentEntity } from './entities/comment.entity';
import { BookmarkEntity } from './entities/bookmark.entity';
import { UserEntity } from '../user/user.entity';

function slugify(text: string): string {
  const rus = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return text
    .toLowerCase()
    .split('')
    .map(char => rus[char] !== undefined ? rus[char] : char)
    .join('')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(BookmarkEntity)
    private readonly bookmarkRepository: Repository<BookmarkEntity>
  ) { }

  // Categories
  async createCategory(name: string): Promise<CategoryEntity> {
    const slug = slugify(name);
    const category = this.categoryRepository.create({ name, slug });
    return this.categoryRepository.save(category);
  }

  async getCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({ relations: { posts: true } });
  }

  // Tags
  async createTag(name: string): Promise<TagEntity> {
    const slug = slugify(name);
    const tag = this.tagRepository.create({ name, slug });
    return this.tagRepository.save(tag);
  }

  async getTags(): Promise<TagEntity[]> {
    return this.tagRepository.find();
  }

  // Posts
  async createPost(
    author: UserEntity,
    data: { title: string; content: string; coverImageUrl?: string; categoryId?: number; tagNames?: string[] }
  ): Promise<PostEntity> {
    let slug = slugify(data.title);
    const exists = await this.postRepository.findOne({ where: { slug } });
    if (exists) {
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    let category: CategoryEntity | undefined = undefined;
    if (data.categoryId) {
      const foundCategory = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
      if (foundCategory) {
        category = foundCategory;
      }
    }

    const tags: TagEntity[] = [];
    if (data.tagNames) {
      for (const tagName of data.tagNames) {
        const cleanName = tagName.trim();
        if (!cleanName) continue;
        let tag = await this.tagRepository.findOne({ where: { name: cleanName } });
        if (!tag) {
          tag = await this.createTag(cleanName);
        }
        tags.push(tag);
      }
    }

    const post = this.postRepository.create({
      title: data.title,
      slug,
      content: data.content,
      coverImageUrl: data.coverImageUrl,
      category,
      tags,
      author: author || undefined
    });

    return this.postRepository.save(post);
  }

  async getPosts(
    page: number = 1,
    limit: number = 10,
    sort: 'newest' | 'oldest' | 'discussed' | 'popular' = 'newest',
    categoryId?: number,
    tagId?: number,
    search?: string
  ): Promise<{ data: PostEntity[], total: number }> {
    const queryBuilder = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comments');

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (tagId) {
      queryBuilder.innerJoin('post.tags', 'tagFilter', 'tagFilter.id = :tagId', { tagId });
    }

    if (search) {
      queryBuilder.andWhere('(post.title LIKE :search OR post.content LIKE :search)', { search: `%${search}%` });
    }

    if (sort === 'newest') {
      queryBuilder.orderBy('post.createdAt', 'DESC');
    } else if (sort === 'oldest') {
      queryBuilder.orderBy('post.createdAt', 'ASC');
    } else if (sort === 'discussed') {
      // Order by number of comments
      queryBuilder.addSelect(
        subQuery => subQuery
          .select('COUNT(comment.id)')
          .from(CommentEntity, 'comment')
          .where('comment.postId = post.id'),
        'commentCount'
      ).orderBy('commentCount', 'DESC').addOrderBy('post.createdAt', 'DESC');
    } else if (sort === 'popular') {
      // Order by number of bookmarks
      queryBuilder.addSelect(
        subQuery => subQuery
          .select('COUNT(bookmark.id)')
          .from(BookmarkEntity, 'bookmark')
          .where('bookmark.targetType = :type', { type: 'post' })
          .andWhere('bookmark.targetId = post.id'),
        'bookmarkCount'
      ).orderBy('bookmarkCount', 'DESC').addOrderBy('post.createdAt', 'DESC');
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async getPostByIdOrSlug(idOrSlug: string): Promise<PostEntity> {
    const isId = /^\d+$/.test(idOrSlug);
    const post = await this.postRepository.findOne({
      where: isId ? { id: Number(idOrSlug) } : { slug: idOrSlug },
      relations: {
        category: true,
        tags: true,
        author: true,
        comments: {
          user: true
        }
      }
    });

    if (!post) {
      throw new NotFoundException('Статья не найдена');
    }

    // Sort comments descending/ascending
    if (post.comments) {
      post.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return post;
  }


  async updatePost(
    postId: number,
    user: UserEntity,
    data: { title?: string; content?: string; coverImageUrl?: string; categoryId?: number; tagNames?: string[] }
  ): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: { author: true, tags: true, category: true }
    });
    if (!post) throw new NotFoundException('Статья не найдена');

    if (post.author?.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет прав для редактирования');
    }

    if (data.title !== undefined) {
      post.title = data.title;
      post.slug = slugify(data.title);
    }
    if (data.content !== undefined) post.content = data.content;
    if (data.coverImageUrl !== undefined) post.coverImageUrl = data.coverImageUrl;

    if (data.categoryId !== undefined) {
      if (data.categoryId) {
        const cat = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
        post.category = (cat || undefined) as any;
      } else {
        post.category = undefined as any;
      }
    }

    if (data.tagNames) {
      const tags: TagEntity[] = [];
      for (const tagName of data.tagNames) {
        const clean = tagName.trim();
        if (!clean) continue;
        let tag = await this.tagRepository.findOne({ where: { name: clean } });
        if (!tag) tag = await this.createTag(clean);
        tags.push(tag);
      }
      post.tags = tags;
    }

    return this.postRepository.save(post);
  }

  async deletePost(postId: number, user: UserEntity): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: { author: true }
    });
    if (!post) throw new NotFoundException('Статья не найдена');
    if (post.author?.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет прав для удаления');
    }
    await this.postRepository.remove(post);
  }

  // Comments
  async createComment(postId: number, user: UserEntity, content: string): Promise<CommentEntity> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Статья не найдена');
    }

    const comment = this.commentRepository.create({
      content,
      post,
      user
    });

    return this.commentRepository.save(comment);
  }

  async updateComment(commentId: number, user: UserEntity, content: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: { user: true }
    });
    if (!comment) throw new NotFoundException('Комментарий не найден');
    if (comment.user?.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет прав для редактирования');
    }
    comment.content = content;
    return this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number, user: UserEntity): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: { user: true }
    });
    if (!comment) throw new NotFoundException('Комментарий не найден');
    if (comment.user?.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет прав для удаления');
    }
    await this.commentRepository.remove(comment);
  }

  // Bookmarks
  async getBookmarks(user: UserEntity): Promise<any[]> {
    const bookmarks = await this.bookmarkRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' }
    });

    const enriched: any[] = [];
    for (const b of bookmarks) {
      let title = '';
      let slugOrId = '';
      if (b.targetType === 'post') {
        const post = await this.postRepository.findOne({ where: { id: b.targetId } });
        if (post) {
          title = post.title;
          slugOrId = post.slug;
        }
      } else if (b.targetType === 'course') {
        const course = await this.postRepository.manager.getRepository('CourseEntity').findOne({ where: { id: b.targetId } });
        if (course) {
          title = (course as any).title;
          slugOrId = String(b.targetId);
        }
      }
      if (title) {
        enriched.push({
          id: b.id,
          targetType: b.targetType,
          targetId: b.targetId,
          createdAt: b.createdAt,
          title,
          slugOrId
        });
      }
    }
    return enriched;
  }

  async checkBookmark(
    user: UserEntity,
    targetType: 'post' | 'course',
    targetId: number
  ): Promise<{ bookmarked: boolean }> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        user: { id: user.id },
        targetType,
        targetId
      }
    });
    return { bookmarked: !!bookmark };
  }

  async toggleBookmark(
    user: UserEntity,
    targetType: 'post' | 'course',
    targetId: number
  ): Promise<{ bookmarked: boolean }> {
    const existing = await this.bookmarkRepository.findOne({
      where: {
        user: { id: user.id },
        targetType,
        targetId
      }
    });

    if (existing) {
      await this.bookmarkRepository.remove(existing);
      return { bookmarked: false };
    } else {
      const bookmark = this.bookmarkRepository.create({
        user,
        targetType,
        targetId
      });
      await this.bookmarkRepository.save(bookmark);
      return { bookmarked: true };
    }
  }
}
