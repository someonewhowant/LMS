import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogService, Post, Comment } from '../../services/blog.service';
import { BookmarkService } from '../../services/bookmark.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post-detail.html'
})
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly blogService = inject(BlogService);
  private readonly bookmarkService = inject(BookmarkService);
  readonly authService = inject(AuthService);

  readonly post = signal<Post | null>(null);
  readonly isBookmarked = signal<boolean>(false);
  readonly newCommentText = signal<string>('');
  readonly isSavingComment = signal<boolean>(false);

  parsedHtmlContent = '';

  ngOnInit() {
    const idOrSlug = this.route.snapshot.paramMap.get('idOrSlug');
    if (idOrSlug) {
      this.loadPost(idOrSlug);
    } else {
      this.router.navigate(['/blog']);
    }
  }

  loadPost(idOrSlug: string) {
    this.blogService.getPostByIdOrSlug(idOrSlug).subscribe({
      next: (data) => {
        this.post.set(data);
        this.parsedHtmlContent = this.parseMarkdown(data.content);
        this.checkBookmarkStatus(data.id);
      },
      error: () => {
        alert('Ошибка при загрузке статьи');
        this.router.navigate(['/blog']);
      }
    });
  }

  checkBookmarkStatus(postId: number) {
    this.bookmarkService.checkBookmark('post', postId).subscribe({
      next: (res) => this.isBookmarked.set(res.bookmarked)
    });
  }

  toggleBookmark() {
    const currentPost = this.post();
    if (!currentPost) return;

    this.bookmarkService.toggleBookmark('post', currentPost.id).subscribe({
      next: (res) => this.isBookmarked.set(res.bookmarked)
    });
  }

  addComment() {
    const text = this.newCommentText().trim();
    const currentPost = this.post();
    if (!text || !currentPost) return;

    this.isSavingComment.set(true);
    this.blogService.createComment(currentPost.id, text).subscribe({
      next: () => {
        this.isSavingComment.set(false);
        this.newCommentText.set('');
        // Reload post to fetch updated comments
        this.loadPost(String(currentPost.id));
      },
      error: () => {
        this.isSavingComment.set(false);
        alert('Ошибка добавления комментария');
      }
    });
  }

  parseMarkdown(content: string | undefined): string {
    if (!content) return '';
    let html = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-950 p-4 rounded-xl border border-slate-850 overflow-x-auto text-xs font-mono my-4 text-indigo-300"><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-900 px-1.5 py-0.5 rounded text-rose-400 font-mono text-xs">$1</code>');
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-base font-bold text-white mt-6 mb-2">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-8 mb-3">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-10 mb-4">$1</h2>');
    
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    
    // Bullet list items
    html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-300 my-1.5">$1</li>');
    
    // Paragraphs (split by empty line, wrap in p if not starts with tags)
    const paragraphs = html.split(/\n\s*\n/);
    return paragraphs.map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<pre') || trimmed.startsWith('<h') || trimmed.startsWith('<li')) {
        return trimmed;
      }
      return `<p class="leading-relaxed text-slate-350 text-sm my-4">${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
