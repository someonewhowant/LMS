import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../ui/badge/badge';
import { AvatarComponent } from '../../ui/avatar/avatar';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
}

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, AvatarComponent],
  template: `
<article class="group bg-surface-container-low rounded-xl p-lg border border-outline-variant hover:border-primary/30 hover:bg-surface-container transition-all duration-300 cursor-pointer flex flex-col h-full">
  <!-- Author & Date -->
  <div class="flex items-center justify-between mb-md">
    <div class="flex items-center gap-sm">
      <app-avatar [src]="article.author.avatar" [alt]="article.author.name" size="sm"></app-avatar>
      <div>
        <div class="text-on-surface text-[14px] font-bold">{{ article.author.name }}</div>
        <div class="text-on-surface-variant text-[12px]">{{ article.date }}</div>
      </div>
    </div>
    <div class="flex items-center gap-xs text-on-surface-variant text-[12px] font-label-caps">
      <span class="material-symbols-outlined text-[16px]">schedule</span>
      <span>{{ article.readTime }}</span>
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1">
    <h2 class="text-[20px] font-bold text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
      {{ article.title }}
    </h2>
    <p class="text-on-surface-variant text-body-md line-clamp-3 mb-md">
      {{ article.excerpt }}
    </p>
  </div>

  <!-- Tags -->
  <div class="flex flex-wrap gap-2 mt-auto">
    <app-badge *ngFor="let tag of article.tags" variant="tag">{{ tag }}</app-badge>
  </div>
</article>
  `,
  styles: ``
})
export class ArticleCardComponent {
  @Input({ required: true }) article!: Article;
}
