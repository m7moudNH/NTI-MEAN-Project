import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/models/cart.model';
import { Product } from '../../core/models/product.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  cancelling = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.fetch(id);
  }

  fetch(id: string) {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (res) => {
        this.order = res.data.order;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Order not found.';
        this.loading = false;
      },
    });
  }

  asProduct(productId: Product | string): Product | null {
    return typeof productId === 'object' ? productId : null;
  }

  imageSrc(productId: Product | string): string {
    const product = this.asProduct(productId);
    if (!product?.imageUrl) return '';
    return `${environment.apiOrigin}/uploads/products/${product.imageUrl}`;
  }

  cancel() {
    if (!this.order) return;
    if (!confirm('Cancel this order?')) return;
    this.cancelling = true;
    this.orderService.cancelOrder(this.order._id).subscribe({
      next: (res) => {
        this.order = res.data.order;
        this.cancelling = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Could not cancel order.';
        this.cancelling = false;
      },
    });
  }
}
