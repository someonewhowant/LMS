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

  readonly totalPosts = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly sortOrder = signal<string>('newest');

  readonly selectedCategoryId = signal<number | undefined>(undefined);
  readonly selectedTagId = signal<number | undefined>(undefined);
  readonly searchQuery = signal<string>('');

  // Category creation fields
  newCategoryName = '';
  isSavingCategory = false;

  ngOnInit() {
    this.loadData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalPosts() / this.limit());
  }

  calcReadingTime(content: string): number {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  loadData() {
    this.loadPosts();
    this.blogService.getCategories().subscribe(cats => this.categories.set(cats));
    this.blogService.getTags().subscribe(ts => this.tags.set(ts));
    this.loadBookmarks();
  }

  loadPosts() {
    const q = this.searchQuery().trim() || undefined;
    this.blogService.getPosts(
      this.currentPage(),
      this.limit(),
      this.sortOrder(),
      this.selectedCategoryId(),
      this.selectedTagId(),
      q
    ).subscribe(res => {
      this.posts.set(res.data);
      this.totalPosts.set(res.total);
    });
  }

  loadBookmarks() {
    if (this.authService.currentUser()) {
      this.bookmarkService.getBookmarks().subscribe(bms => this.bookmarks.set(bms));
    }
  }

  selectCategory(id: number | undefined) {
    this.selectedCategoryId.set(id);
    this.selectedTagId.set(undefined);
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.loadPosts();
  }

  selectTag(id: number | undefined) {
    this.selectedTagId.set(id);
    this.selectedCategoryId.set(undefined);
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.loadPosts();
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.selectedCategoryId.set(undefined);
    this.selectedTagId.set(undefined);
    this.currentPage.set(1);
    this.loadPosts();
  }

  changeSort(sort: string) {
    this.sortOrder.set(sort);
    this.currentPage.set(1);
    this.loadPosts();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update(p => p + 1);
      this.loadPosts();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadPosts();
    }
  }

  toggleBookmark(post: Post) {
    this.bookmarkService.toggleBookmark('post', post.id).subscribe(() => {
      this.loadBookmarks();
    });
  }

  isBookmarked(postId: number): boolean {
    return this.bookmarks().some(b => b.targetType === 'post' && b.targetId === postId);
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



  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
