import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
<header class="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-md h-16 flex items-center justify-between px-margin-mobile md:px-margin-desktop border-b border-outline-variant">
  <div class="flex items-center gap-md">
    <div class="flex items-center gap-xs">
      <div class="h-8 w-8 rounded-sm bg-primary-container text-primary flex items-center justify-center font-bold">CB</div>
      <span class="font-display-lg-mobile text-[20px] text-primary tracking-tighter">CODEBLOG</span>
    </div>
    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-md ml-lg">
      <a class="text-primary font-label-caps text-label-caps hover:text-primary transition-colors border-b-2 border-primary pb-1" href="#">Learn</a>
      <a class="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors pb-1" href="#">Articles</a>
      <a class="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors pb-1" href="#">Roadmaps</a>
      <a class="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors pb-1" href="#">Community</a>
    </nav>
  </div>
  <div class="flex items-center gap-sm">
    <div class="hidden md:flex items-center bg-surface-container rounded px-3 py-1.5 border border-outline-variant mr-4">
      <span class="material-symbols-outlined text-[20px] text-outline">search</span>
      <input class="bg-transparent border-none focus:ring-0 text-code-sm font-body-md text-on-surface placeholder:text-outline ml-2 w-48 outline-none" placeholder="Search courses..." type="text"/>
    </div>
    <button (click)="toggleTheme()" class="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-all active:scale-95 cursor-pointer">
      <span class="material-symbols-outlined">{{ themeService.isDark ? 'light_mode' : 'dark_mode' }}</span>
    </button>
    <button class="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-all active:scale-95 relative cursor-pointer">
      <span class="material-symbols-outlined">notifications</span>
      <span class="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full"></span>
    </button>
    <button class="ml-4 px-6 py-2 bg-primary text-on-primary font-label-caps text-[12px] rounded-lg hover:brightness-110 active:scale-95 transition-all hidden sm:block cursor-pointer">
      Get Started
    </button>
  </div>
</header>
  `,
  styles: ``
})
export class Header {
  themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

