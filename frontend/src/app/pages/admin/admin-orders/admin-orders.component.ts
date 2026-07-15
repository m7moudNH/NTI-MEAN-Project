import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/cart.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  errorMessage = '';
  updatingId: string | null = null;

  statuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.data.orders;
        this.loading = false;
      },
      error: (err) => {
        this.orders = [];
        this.loading = false;
        if (err.status !== 404) this.errorMessage = err.error?.message || 'Could not load orders.';
      },
    });
  }

  customerLabel(order: Order): string {
    if (typeof order.userId === 'object') {
      return `${order.userId.firstName} ${order.userId.lastName} (${order.userId.email})`;
    }
    return order.userId;
  }

  updateStatus(order: Order, status: OrderStatus) {
    this.updatingId = order._id;
    this.errorMessage = '';
    this.orderService.updateStatus(order._id, status).subscribe({
      next: (res) => {
        order.status = res.data.order.status;
        this.updatingId = null;
      },
      error: (err) => {
        this.updatingId = null;
        this.errorMessage = err.error?.message || 'Could not update order status.';
      },
    });
  }
}
