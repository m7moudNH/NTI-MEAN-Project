import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductCategory } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, NewsletterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  newArrivals: Product[] = [];
  topSelling: Product[] = [];
  loading = true;

  categories: { label: string; value: ProductCategory }[] = [
    { label: 'T-Shirts', value: 't-shirt' },
    { label: 'Hoodies', value: 'hoodie' },
    { label: 'Pants', value: 'pants' },
    { label: 'Shorts', value: 'shorts' },
    { label: 'Jackets', value: 'jacket' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Accessories', value: 'accessories' },
  ];

  brands = ['VERSACE', 'ZARA', 'GUCCI', 'PRADA', 'Calvin Klein'];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAll({ limit: 4, page: 1 }).subscribe({
      next: (res) => (this.newArrivals = res.data.products),
      error: () => (this.newArrivals = []),
    });
    this.productService.getAll({ limit: 4, page: 2 }).subscribe({
      next: (res) => {
        this.topSelling = res.data.products;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
