import { Component } from '@angular/core';
import { AvatarComponent } from '../../ui/avatar/avatar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AvatarComponent],
  template: `
<aside class="h-full w-64 bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant flex flex-col py-md px-sm">
  <div class="flex items-center gap-sm px-xs mb-lg">
    <app-avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFTqfDayGYrd2f-VGMscwOjM7e0emx1Zv5efmuv1M4346WNlcojoG4sKAGW2FHKDjzAtlmF0K74RfYLfxVjP5Fg0zF822oy1QVMV3iwTrQ4SAtx5LaIuLgiHnUpOWvpdpOiL9ZMb-baUjm0cs_FiFc8iJWuHnkCpf0HKY9LAPuwp7Rnd-8qdvgibA3c3rD94e7mCkoLeu1JpvygqhQl4V6sWEtcDfHGErpVj0pVJRXaDFj-vEKz3VbSSCKfyf5fU2vBiiUEJpSxKjo" size="md" alt="Developer Student"></app-avatar>
    <div>
      <div class="font-label-caps text-label-caps text-on-surface">Developer Student</div>
      <div class="text-[10px] text-primary font-bold tracking-widest">PRO PLAN</div>
    </div>
  </div>
  <nav class="flex-1 space-y-xs overflow-y-auto custom-scrollbar">
    <!-- Dashboard (Active) -->
    <a class="flex items-center gap-sm px-sm py-xs rounded text-primary bg-primary-container/10 border-l-4 border-primary transition-all duration-150 ease-in-out font-label-caps text-label-caps active-nav-glow cursor-pointer" href="#">
      <span class="material-symbols-outlined">dashboard</span>
      <span>Dashboard</span>
    </a>
    <a class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer" href="#">
      <span class="material-symbols-outlined">school</span>
      <span>My Courses</span>
    </a>
    <a class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer" href="#">
      <span class="material-symbols-outlined">military_tech</span>
      <span>Achievements</span>
    </a>
    <a class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer" href="#">
      <span class="material-symbols-outlined">leaderboard</span>
      <span>Leaderboard</span>
    </a>
    <a class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer" href="#">
      <span class="material-symbols-outlined">settings</span>
      <span>Settings</span>
    </a>
  </nav>
  <div class="mt-auto pt-md border-t border-outline-variant space-y-xs">
    <a class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer" href="#">
      <span class="material-symbols-outlined">help</span>
      <span>Support</span>
    </a>
    <a class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer" href="#">
      <span class="material-symbols-outlined">logout</span>
      <span>Sign Out</span>
    </a>
  </div>
</aside>
  `,
  styles: ``
})
export class Sidebar {}

