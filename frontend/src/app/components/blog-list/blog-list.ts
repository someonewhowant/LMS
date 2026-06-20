import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BlogService, Post, Category, Tag } from '../../services/blog.service';
import { BookmarkService, Bookmark } from '../../services/bookmark.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog-list.html'
})
export class BlogListComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly bookmarkService = inject(BookmarkService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly posts = signal<Post[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly tags = signal<Tag[]>([]);
  readonly bookmarks = signal<Bookmark[]>([]);

  readonly selectedCategoryId = signal<number | undefined>(undefined);
  readonly selectedTagId = signal<number | undefined>(undefined);
  readonly searchQuery = signal<string>('');

  // Post creation fields
  readonly showCreateModal = signal<boolean>(false);
  newPostTitle = '';
  newPostContent = '';
  newPostCategoryId: number | undefined = undefined;
  newPostTagNames = '';
  isSavingPost = false;

  // Category creation fields
  newCategoryName = '';
  isSavingCategory = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadPosts();
    this.blogService.getCategories().subscribe(cats => this.categories.set(cats));
    this.blogService.getTags().subscribe(ts => this.tags.set(ts));
    this.loadBookmarks();
  }

  loadPosts() {
    const q = this.searchQuery().trim();
    if (q) {
      this.blogService.searchPosts(q).subscribe(posts => this.posts.set(posts));
    } else {
      this.blogService.getPosts(this.selectedCategoryId(), this.selectedTagId()).subscribe(posts => this.posts.set(posts));
    }
  }

  loadBookmarks() {
    this.bookmarkService.getBookmarks().subscribe(bms => this.bookmarks.set(bms));
  }

  selectCategory(id: number | undefined) {
    this.selectedCategoryId.set(id);
    this.selectedTagId.set(undefined);
    this.searchQuery.set('');
    this.loadPosts();
  }

  selectTag(id: number | undefined) {
    this.selectedTagId.set(id);
    this.selectedCategoryId.set(undefined);
    this.searchQuery.set('');
    this.loadPosts();
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.selectedCategoryId.set(undefined);
    this.selectedTagId.set(undefined);
    this.loadPosts();
  }

  toggleBookmark(post: Post) {
    this.bookmarkService.toggleBookmark('post', post.id).subscribe(() => {
      this.loadBookmarks();
    });
  }

  isBookmarked(postId: number): boolean {
    return this.bookmarks().some(b => b.targetType === 'post' && b.targetId === postId);
  }

  savePost() {
    if (!this.newPostTitle.trim() || !this.newPostContent.trim()) {
      alert('Заполните заголовок и содержание!');
      return;
    }

    this.isSavingPost = true;
    const tagNames = this.newPostTagNames
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    this.blogService.createPost({
      title: this.newPostTitle,
      content: this.newPostContent,
      categoryId: this.newPostCategoryId ? Number(this.newPostCategoryId) : undefined,
      tagNames
    }).subscribe({
      next: (post) => {
        this.isSavingPost = false;
        this.showCreateModal.set(false);
        this.resetPostForm();
        this.loadPosts();
      },
      error: (err) => {
        this.isSavingPost = false;
        alert('Ошибка при создании публикации. Попробуйте еще раз.');
      }
    });
  }

  saveCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;

    this.isSavingCategory = true;
    this.blogService.createCategory(name).subscribe({
      next: (cat) => {
        this.isSavingCategory = false;
        this.newCategoryName = '';
        this.blogService.getCategories().subscribe(cats => this.categories.set(cats));
      },
      error: () => {
        this.isSavingCategory = false;
        alert('Ошибка создания категории');
      }
    });
  }

  resetPostForm() {
    this.newPostTitle = '';
    this.newPostContent = '';
    this.newPostCategoryId = undefined;
    this.newPostTagNames = '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
