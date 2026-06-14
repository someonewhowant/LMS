import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  template: `
<aside class="h-full w-64 bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant flex flex-col py-md px-sm">
  <div class="flex items-center gap-sm px-xs mb-lg">
    <div class="w-10 h-10 bg-primary-container/20 rounded flex items-center justify-center border border-primary/30">
      <span class="material-symbols-outlined text-primary">school</span>
    </div>
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
