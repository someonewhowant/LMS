import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css'
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
  readonly limit = signal<number>(9);
  readonly sortOrder = signal<string>('newest');

  readonly selectedCategoryId = signal<number | undefined>(undefined);
  readonly selectedTagId = signal<number | undefined>(undefined);
  readonly searchQuery = signal<string>('');
  readonly showMobileFilters = signal<boolean>(false);

  // Category creation fields
  newCategoryName = '';
  isSavingCategory = false;

  // Computed
  readonly featuredPost = computed(() => {
    const all = this.posts();
    return this.currentPage() === 1 && !this.selectedCategoryId() && !this.selectedTagId() && !this.searchQuery()
      ? all[0] ?? null
      : null;
  });

  readonly gridPosts = computed(() => {
    const all = this.posts();
    return this.featuredPost() ? all.slice(1) : all;
  });

  readonly selectedCategoryName = computed(() => {
    const id = this.selectedCategoryId();
    if (!id) return null;
    return this.categories().find(c => c.id === id)?.name ?? null;
  });

  readonly selectedTagName = computed(() => {
    const id = this.selectedTagId();
    if (!id) return null;
    return this.tags().find(t => t.id === id)?.name ?? null;
  });

  readonly hasActiveFilter = computed(() => {
    return !!this.selectedCategoryId() || !!this.selectedTagId() || !!this.searchQuery();
  });

  readonly sortLabel = computed(() => {
    const labels: Record<string, string> = {
      newest: 'Сначала новые',
      oldest: 'Сначала старые',
      discussed: 'Самые обсуждаемые',
      popular: 'Популярные'
    };
    return labels[this.sortOrder()] || 'Сортировка';
  });

  ngOnInit() {
    this.loadData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalPosts() / this.limit());
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage();
    const pages: number[] = [];
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);
      if (current <= 2) { start = 2; end = 4; }
      if (current >= total - 1) { start = total - 3; end = total - 1; }
      if (start > 2) pages.push(-1); // ellipsis
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < total - 1) pages.push(-1); // ellipsis
      pages.push(total);
    }
    return pages;
  }

  calcReadingTime(content: string): number {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  getExcerpt(content: string, maxLen: number = 160): string {
    if (!content) return '';
    // Strip markdown syntax for cleaner previews
    const clean = content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/[-*]\s/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return clean.length > maxLen ? clean.substring(0, maxLen) + '…' : clean;
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
    this.showMobileFilters.set(false);
    this.loadPosts();
  }

  selectTag(id: number | undefined) {
    this.selectedTagId.set(id);
    this.selectedCategoryId.set(undefined);
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.showMobileFilters.set(false);
    this.loadPosts();
  }

  clearFilters() {
    this.selectedCategoryId.set(undefined);
    this.selectedTagId.set(undefined);
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

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.loadPosts();
    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update(p => p + 1);
      this.loadPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      next: () => {
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
