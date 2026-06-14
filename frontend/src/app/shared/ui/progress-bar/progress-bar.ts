import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-2 w-full bg-surface-variant rounded-full overflow-hidden" [ngClass]="{'h-1.5': size === 'sm'}">
      <div 
        class="h-full bg-primary transition-all duration-1000" 
        [class.shadow-glow]="glow"
        [style.width.%]="progress">
      </div>
    </div>
  `,
  styles: `
    .bg-surface-variant {
      background-color: #32353c;
    }
    .bg-primary {
      background-color: #adc6ff;
    }
    .shadow-glow {
      box-shadow: 0 0 10px rgba(173, 198, 255, 0.5); /* blue glow */
    }
  `
})
export class ProgressBarComponent {
  @Input() progress = 0;
  @Input() glow = false;
  @Input() size: 'sm' | 'md' = 'md';
}
