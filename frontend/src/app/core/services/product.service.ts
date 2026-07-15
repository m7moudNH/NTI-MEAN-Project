import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

export interface ProductListResponse {
  status: string;
  count: number;
  data: { products: Product[] };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  gender?: string;
  colors?: string;
  title?: string;
  priceGte?: number;
  priceLte?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(filters: ProductFilters = {}) {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page);
    if (filters.limit) params = params.set('limit', filters.limit);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.brand) params = params.set('brand', filters.brand);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.colors) params = params.set('colors', filters.colors);
    if (filters.title) params = params.set('title', filters.title);
    if (filters.priceGte !== undefined) params = params.set('price[gte]', filters.priceGte);
    if (filters.priceLte !== undefined) params = params.set('price[lte]', filters.priceLte);
    return this.http.get<ProductListResponse>(this.baseUrl, { params });
  }

  getById(id: string) {
    return this.http.get<{ status: string; data: { product: Product } }>(`${this.baseUrl}/${id}`);
  }

  create(payload: Partial<Product>, image?: File) {
    const form = this.toFormData(payload, image);
    return this.http.post<{ status: string; data: { product: Product } }>(this.baseUrl, form);
  }

  update(id: string, payload: Partial<Product>, image?: File) {
    const form = this.toFormData(payload, image);
    return this.http.patch<{ status: string; data: { product: Product } }>(`${this.baseUrl}/${id}`, form);
  }

  delete(id: string) {
    return this.http.delete<{ status: string }>(`${this.baseUrl}/${id}`);
  }

  private toFormData(payload: Partial<Product>, image?: File): FormData {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach((v) => form.append(key, v));
      } else {
        form.append(key, value as string);
      }
    });
    if (image) form.append('imageUrl', image);
    return form;
  }
}
