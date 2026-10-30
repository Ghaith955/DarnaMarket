import { Routes } from '@angular/router';

export const VENDOR_ROUTES: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./vendor-dashboard.component').then(m => m.VendorDashboardComponent) },
  { path: 'products', loadComponent: () => import('./my-products.component').then(m => m.MyProductsComponent) },
  { path: 'products/new', loadComponent: () => import('./product-form.component').then(m => m.ProductFormComponent) },
  { path: 'products/:id/edit', loadComponent: () => import('./product-form.component').then(m => m.ProductFormComponent) },
];
