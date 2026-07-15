import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart() {
    return this.http.get<{ status: string; message?: string; data?: { cart: Cart }; cart?: Cart }>(this.baseUrl);
  }

  addToCart(productId: string, quantity: number) {
    return this.http.post<{ status: string; data: { cart: Cart } }>(this.baseUrl, { productId, quantity });
  }

  removeFromCart(productId: string) {
    // Backend route is DELETE /cart/:productId but the controller reads productId from
    // req.body, so we send it in the request body as well for compatibility.
    return this.http.delete<{ status: string; data: { cart: Cart } }>(`${this.baseUrl}/${productId}`, {
      body: { productId },
    });
  }

  clearCart() {
    return this.http.delete<{ status: string; data: { cart: Cart } }>(this.baseUrl);
  }
}
