import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = true;

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    // Default to dark theme for CodeBlog Academy
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      htmlElement.classList.add('dark');
      // Set background color globally to match design
      document.body.style.backgroundColor = '#10131a';
      document.body.style.color = '#e1e2ec';
    }
  }

  toggleTheme() {
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      this.isDarkTheme = !this.isDarkTheme;
      if (this.isDarkTheme) {
        htmlElement.classList.add('dark');
        document.body.style.backgroundColor = '#10131a';
        document.body.style.color = '#e1e2ec';
      } else {
        htmlElement.classList.remove('dark');
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#10131a';
      }
    }
  }

  get isDark() {
    return this.isDarkTheme;
  }
}
