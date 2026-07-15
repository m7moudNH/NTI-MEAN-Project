import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
  },
  {
    path: 'admin/products',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-products/admin-products.component').then((m) => m.AdminProductsComponent),
  },
  {
    path: 'admin/products/new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-product-form/admin-product-form.component').then(
        (m) => m.AdminProductFormComponent,
      ),
  },
  {
    path: 'admin/products/:id/edit',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-product-form/admin-product-form.component').then(
        (m) => m.AdminProductFormComponent,
      ),
  },
  {
    path: 'admin/orders',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
  },
  { path: '**', redirectTo: '' },
];
