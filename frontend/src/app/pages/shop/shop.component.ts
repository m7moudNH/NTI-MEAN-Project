import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductCategory, ProductGender } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';

const LIMIT = 9;

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent, PaginationComponent, NewsletterComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  page = 1;
  hasNextPage = false;
  filtersOpen = false;

  categories: ProductCategory[] = ['t-shirt', 'hoodie', 'pants', 'shorts', 'jacket', 'shoes', 'accessories'];
  genders: ProductGender[] = ['men', 'women'];
  colorOptions = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink'];

  filters = {
    title: '',
    category: '',
    gender: '',
    colors: '',
    priceGte: null as number | null,
    priceLte: null as number | null,
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.filters.title = params.get('title') || '';
      this.filters.category = params.get('category') || '';
      this.filters.gender = params.get('gender') || '';
      this.filters.colors = params.get('colors') || '';
      this.filters.priceGte = params.get('priceGte') ? Number(params.get('priceGte')) : null;
      this.filters.priceLte = params.get('priceLte') ? Number(params.get('priceLte')) : null;
      this.page = params.get('page') ? Number(params.get('page')) : 1;
      this.fetch();
    });
  }

  fetch() {
    this.loading = true;
    this.productService
      .getAll({
        page: this.page,
        limit: LIMIT,
        title: this.filters.title || undefined,
        category: this.filters.category || undefined,
        gender: this.filters.gender || undefined,
        colors: this.filters.colors || undefined,
        priceGte: this.filters.priceGte ?? undefined,
        priceLte: this.filters.priceLte ?? undefined,
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
    this.filtersOpen = false;
    this.navigate(1);
  }

  clearFilters() {
    this.filters = { title: '', category: '', gender: '', colors: '', priceGte: null, priceLte: null };
    this.navigate(1);
  }

  selectCategory(category: string) {
    this.filters.category = this.filters.category === category ? '' : category;
    this.navigate(1);
  }

  selectGender(gender: string) {
  this.filters.gender = this.filters.gender === gender ? '' : gender;
  this.navigate(1);
}

  selectColor(color: string) {
    this.filters.colors = this.filters.colors === color ? '' : color;
    this.navigate(1);
  }

  onPageChange(page: number) {
    this.navigate(page);
  }

  private navigate(page: number) {
    const queryParams: Record<string, string> = { page: String(page) };
    if (this.filters.title) queryParams['title'] = this.filters.title;
    if (this.filters.category) queryParams['category'] = this.filters.category;
    if (this.filters.gender) queryParams['gender'] = this.filters.gender;
    if (this.filters.colors) queryParams['colors'] = this.filters.colors;
    if (this.filters.priceGte != null) queryParams['priceGte'] = String(this.filters.priceGte);
    if (this.filters.priceLte != null) queryParams['priceLte'] = String(this.filters.priceLte);
    this.router.navigate([], { relativeTo: this.route, queryParams });
  }
}
