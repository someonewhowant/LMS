import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
<footer class="bg-surface-container-lowest pt-xl pb-lg px-margin-mobile md:px-margin-desktop border-t border-outline-variant">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-xl">
    <div class="lg:col-span-2 space-y-md">
      <div class="flex items-center gap-xs">
        <div class="h-8 w-8 rounded-sm bg-primary-container text-primary flex items-center justify-center font-bold">CB</div>
        <span class="font-display-lg-mobile text-[20px] text-primary tracking-tighter">CODEBLOG</span>
      </div>
      <p class="text-on-surface-variant text-body-md max-w-xs">Elevating backend engineers through deep technical mastery and industry-proven practices.</p>
      <div class="flex items-center gap-sm">
        <a class="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#"><span class="material-symbols-outlined">terminal</span></a>
        <a class="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#"><span class="material-symbols-outlined">code</span></a>
        <a class="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#"><span class="material-symbols-outlined">groups</span></a>
      </div>
    </div>
    <div class="space-y-sm">
      <h5 class="font-label-caps text-label-caps text-on-surface uppercase tracking-widest border-b border-outline-variant pb-2">Platform</h5>
      <ul class="space-y-xs text-on-surface-variant text-body-md">
        <li><a class="hover:text-primary transition-colors cursor-pointer" href="#">Courses</a></li>
        <li><a class="hover:text-primary transition-colors cursor-pointer" href="#">Articles</a></li>
        <li><a class="hover:text-primary transition-colors cursor-pointer" href="#">Roadmaps</a></li>
        <li><a class="hover:text-primary transition-colors cursor-pointer" href="#">Challenges</a></li>
      </ul>
    </div>
    <div class="space-y-sm">
      <h5 class="font-label-caps text-label-caps text-on-surface uppercase tracking-widest border-b border-outline-variant pb-2">Company</h5>
      <ul class="space-y-xs text-on-surface-variant text-body-md">
        <li><a class="hover:text-primary transition-colors cursor-pointer" href="#">About Us</a></li>
        <li><a class="hover:text-primary transition-colors cursor-pointer" href="#">Privacy Policy</a></li>
        <li><a class="hover:text-primary transition-colors cursor-pointer" href="#">Terms of Service</a></li>
        <li><a class="hover:text-primary transition-colors cursor-pointer" href="#">Contact</a></li>
      </ul>
    </div>
    <div class="space-y-sm">
      <h5 class="font-label-caps text-label-caps text-on-surface uppercase tracking-widest border-b border-outline-variant pb-2">Newsletter</h5>
      <p class="text-on-surface-variant text-body-md">Weekly backend insights delivered to your inbox.</p>
      <div class="flex mt-sm group">
        <input class="w-full bg-surface-container-high border border-outline-variant text-on-surface px-4 py-2 rounded-l focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="email@dev.com" type="email"/>
        <button class="bg-primary text-on-primary px-4 py-2 rounded-r font-label-caps text-label-caps hover:brightness-110 cursor-pointer">Join</button>
      </div>
    </div>
  </div>
  <div class="max-w-7xl mx-auto mt-xl pt-lg border-t border-outline-variant flex flex-col md:flex-row items-center justify-between text-on-surface-variant text-label-caps gap-md">
    <span>© 2024 CodeBlog Academy. Handcrafted for the backend community.</span>
    <div class="flex items-center gap-md">
      <a class="hover:text-on-surface transition-colors cursor-pointer" href="#">Status</a>
      <a class="hover:text-on-surface transition-colors cursor-pointer" href="#">Sitemap</a>
      <a class="hover:text-on-surface transition-colors cursor-pointer" href="#">English (US)</a>
    </div>
  </div>
</footer>
  `,
  styles: ``
})
export class Footer {}
