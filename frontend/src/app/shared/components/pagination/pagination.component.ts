import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * The backend's GET /products endpoint returns `count` as the length of the
 * current page only (not a true total across all matching documents), so we
 * can't compute total page numbers reliably. Instead we do simple
 * Previous/Next pagination: "Next" is enabled whenever the current page came
 * back full (i.e. likely more results exist).
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination" *ngIf="page > 1 || hasNextPage">
      <button class="btn btn-outline btn-sm" [disabled]="page <= 1" (click)="go(page - 1)">
        ← Previous
      </button>
      <span class="page-label">Page {{ page }}</span>
      <button class="btn btn-outline btn-sm" [disabled]="!hasNextPage" (click)="go(page + 1)">
        Next →
      </button>
    </div>
  `,
  styles: [
    `
      .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 32px 0; }
      .page-label { font-size: 14px; color: var(--color-gray-700); }
    `,
  ],
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() hasNextPage = false;
  @Output() pageChange = new EventEmitter<number>();

  go(p: number) {
    if (p < 1 || p === this.page) return;
    this.pageChange.emit(p);
  }
}
