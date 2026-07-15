import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../core/models/product.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { environment } from '../../../../environments/environment';

const LIMIT = 10;

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  page = 1;
  hasNextPage = false;
  deletingId: string | null = null;
  errorMessage = '';

  categories: ProductCategory[] = ['t-shirt', 'hoodie', 'pants', 'shorts', 'jacket', 'shoes', 'accessories'];
  categoryFilter = '';
  titleFilter = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.productService
      .getAll({
        page: this.page,
        limit: LIMIT,
        category: this.categoryFilter || undefined,
        title: this.titleFilter || undefined,
      })
      .subscribe({
        next: (res) => {
          this.products = res.data.products;
          this.hasNextPage = res.data.products.length === LIMIT;
          this.loading = false;
        },
        error: () => {
          this.products = [];
          this.loading = false;
        },
      });
  }

  applyFilters() {
    this.page = 1;
    this.fetch();
  }

  onPageChange(page: number) {
    this.page = page;
    this.fetch();
  }

  imageSrc(product: Product): string {
    if (!product.imageUrl) return '';
    return `${environment.apiOrigin}/uploads/products/${product.imageUrl}`;
  }

  remove(product: Product) {
    if (!confirm(`Delete "${product.title}"? This can't be undone.`)) return;
    this.deletingId = product._id;
    this.errorMessage = '';
    this.productService.delete(product._id).subscribe({
      next: () => {
        this.deletingId = null;
        this.fetch();
      },
      error: (err) => {
        this.deletingId = null;
        this.errorMessage = err.error?.message || 'Could not delete product.';
      },
    });
  }
}
