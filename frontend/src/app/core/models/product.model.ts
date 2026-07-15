export type ProductCategory =
  | 't-shirt'
  | 'hoodie'
  | 'pants'
  | 'shorts'
  | 'jacket'
  | 'shoes'
  | 'accessories';

export type ProductGender = 'men' | 'women';
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  brand: string;
  gender?: ProductGender;
  size?: ProductSize[];
  colors?: string[];
  imageUrl?: string;
  stock: number;
  discount: number;
  rating: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  gender?: string;
  colors?: string;
  'price[gte]'?: number;
  'price[lte]'?: number;
}
