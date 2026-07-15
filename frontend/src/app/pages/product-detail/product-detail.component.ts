import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent, ProductCardComponent, NewsletterComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  related: Product[] = [];
  loading = true;
  quantity = 1;
  addingToCart = false;
  addedMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.fetchProduct(id);
    });
  }

  fetchProduct(id: string) {
    this.loading = true;
    this.quantity = 1;
    this.addedMessage = '';
    this.errorMessage = '';
    this.productService.getById(id).subscribe({
      next: (res) => {
        this.product = res.data.product;
        this.loading = false;
        this.fetchRelated();
      },
      error: () => {
        this.product = null;
        this.loading = false;
      },
    });
  }

  fetchRelated() {
    if (!this.product) return;
    this.productService.getAll({ category: this.product.category, limit: 4 }).subscribe({
      next: (res) => (this.related = res.data.products.filter((p) => p._id !== this.product?._id)),
      error: () => (this.related = []),
    });
  }

  get imageSrc(): string {
    if (!this.product?.imageUrl) return '';
    return `${environment.apiOrigin}/uploads/products/${this.product.imageUrl}`;
  }

  get finalPrice(): number {
    if (!this.product) return 0;
    const discount = this.product.discount || 0;
    return Math.round(this.product.price * (1 - discount / 100));
  }

  incrementQty() {
    if (this.product && this.quantity < this.product.stock) this.quantity++;
  }

  decrementQty() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    if (!this.product) return;
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { redirect: this.router.url } });
      return;
    }
    this.addingToCart = true;
    this.addedMessage = '';
    this.errorMessage = '';
    this.cartService.addToCart(this.product._id, this.quantity).subscribe({
      next: () => {
        this.addingToCart = false;
        this.addedMessage = 'Added to your cart.';
      },
      error: (err) => {
        this.addingToCart = false;
        this.errorMessage = err.error?.message || 'Could not add to cart.';
      },
    });
  }
}
