import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="stars" aria-hidden="true">
      <span *ngFor="let s of stars" [class.filled]="s">★</span>
    </span>
    <span class="value">{{ rating.toFixed(1) }}/5</span>
  `,
  styles: [
    `
      :host { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
      .stars { color: var(--color-gray-300); letter-spacing: 1px; }
      .stars span.filled { color: var(--color-yellow); }
      .value { color: var(--color-gray-700); }
    `,
  ],
})
export class StarRatingComponent {
  @Input() rating = 0;

  get stars(): boolean[] {
    const rounded = Math.round(this.rating);
    return Array.from({ length: 5 }, (_, i) => i < rounded);
  }
}
