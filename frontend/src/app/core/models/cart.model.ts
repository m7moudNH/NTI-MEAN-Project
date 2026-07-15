import { Product } from './product.model';

export interface CartItem {
  productId: Product | string;
  quantity: number;
  priceSnapshot: number;
  _id?: string;
}

export interface Cart {
  _id?: string;
  userId?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: Product | string;
  quantity: number;
  priceSnapshot: number;
}

export interface Order {
  _id: string;
  userId: string | { _id: string; firstName: string; lastName: string; email: string };
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}
