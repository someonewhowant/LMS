import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img *ngIf="src; else fallback" [src]="src" [alt]="alt" class="w-full h-full object-cover" />
    <ng-template #fallback>
      <span class="material-symbols-outlined text-outline">person</span>
    </ng-template>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px; /* full */
      overflow: hidden;
      background-color: #272a31; /* surface-container-high */
      border: 1px solid #424754; /* outline-variant */
      flex-shrink: 0;
    }

    :host.avatar-sm {
      width: 2rem; /* 8 */
      height: 2rem;
    }
    
    :host.avatar-md {
      width: 2.5rem; /* 10 */
      height: 2.5rem;
    }

    :host.avatar-lg {
      width: 3rem; /* 12 */
      height: 3rem;
    }
  `
})
export class AvatarComponent {
  @Input() src: string | null = null;
  @Input() alt = 'Avatar';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @HostBinding('class')
  get classes() {
    return `avatar-${this.size}`;
  }
}
