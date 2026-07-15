import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Order, OrderStatus } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder() {
    return this.http.post<{ status: string; data: { order: Order } }>(this.baseUrl, {});
  }

  getMyOrders() {
    return this.http.get<{ status: string; data: { orders: Order[] } }>(this.baseUrl);
  }

  getAllOrders() {
    return this.http.get<{ status: string; count: number; data: { orders: Order[] } }>(`${this.baseUrl}/all`);
  }

  getOrderById(id: string) {
    return this.http.get<{ status: string; data: { order: Order } }>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: string, status: OrderStatus) {
    return this.http.patch<{ status: string; data: { order: Order } }>(`${this.baseUrl}/${id}`, { status });
  }

  cancelOrder(id: string) {
    return this.http.patch<{ status: string; data: { order: Order } }>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
