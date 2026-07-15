import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  get imageSrc(): string {
    if (!this.product.imageUrl) return '';
    return `${environment.apiOrigin}/uploads/products/${this.product.imageUrl}`;
  }

  get finalPrice(): number {
    const discount = this.product.discount || 0;
    return Math.round(this.product.price * (1 - discount / 100));
  }
}
