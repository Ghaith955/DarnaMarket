import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const SHOP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./home.component').then(m => m.HomeComponent) },
  { path: 'catalogue', loadComponent: () => import('./catalogue.component').then(m => m.CatalogueComponent) },
  { path: 'product/:id', loadComponent: () => import('./product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'cart', loadComponent: () => import('./cart.component').then(m => m.CartComponent) },
  {
    path: 'checkout', canActivate: [authGuard, roleGuard], data: { roles: ['CLIENT'] },
    loadComponent: () => import('./checkout.component').then(m => m.CheckoutComponent),
  },
  {
    path: 'orders', canActivate: [authGuard, roleGuard], data: { roles: ['CLIENT'] },
    loadComponent: () => import('./orders.component').then(m => m.OrdersComponent),
  },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./profile.component').then(m => m.ProfileComponent) },
];
