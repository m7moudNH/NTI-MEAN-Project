import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Cart, CartItem } from '../../core/models/cart.model';
import { Product } from '../../core/models/product.model';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NewsletterComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = true;
  errorMessage = '';
  busyItemId: string | null = null;
  checkingOut = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    public auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.loading = false;
      return;
    }
    this.fetchCart();
  }

  fetchCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res.data?.cart ?? res.cart ?? { items: [] };
        this.loading = false;
      },
      error: () => {
        this.cart = { items: [] };
        this.loading = false;
      },
    });
  }

  asProduct(item: CartItem): Product | null {
    return typeof item.productId === 'object' ? (item.productId as Product) : null;
  }

  imageSrc(item: CartItem): string {
    const product = this.asProduct(item);
    if (!product?.imageUrl) return '';
    return `${environment.apiOrigin}/uploads/products/${product.imageUrl}`;
  }

  itemId(item: CartItem): string {
    const product = this.asProduct(item);
    return product?._id || (item.productId as string);
  }

  lineTotal(item: CartItem): number {
    return item.priceSnapshot * item.quantity;
  }

  get subtotal(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((sum, item) => sum + this.lineTotal(item), 0);
  }

  increment(item: CartItem) {
    const id = this.itemId(item);
    this.busyItemId = id;
    this.cartService.addToCart(id, 1).subscribe({
      next: () => this.fetchCart(),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Could not update quantity.';
        this.busyItemId = null;
      },
    });
  }

  remove(item: CartItem) {
    const id = this.itemId(item);
    this.busyItemId = id;
    this.cartService.removeFromCart(id).subscribe({
      next: () => this.fetchCart(),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Could not remove item.';
        this.busyItemId = null;
      },
    });
  }

  checkout() {
    if (!this.cart || this.cart.items.length === 0) return;
    this.checkingOut = true;
    this.errorMessage = '';
    this.orderService.createOrder().subscribe({
      next: (res) => {
        this.checkingOut = false;
        this.router.navigate(['/orders', res.data.order._id]);
      },
      error: (err) => {
        this.checkingOut = false;
        this.errorMessage = err.error?.message || 'Could not place order.';
      },
    });
  }
}
