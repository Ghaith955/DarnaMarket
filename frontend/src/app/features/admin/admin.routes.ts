import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'vendors', loadComponent: () => import('./admin-vendors.component').then(m => m.AdminVendorsComponent) },
  { path: 'products', loadComponent: () => import('./admin-products.component').then(m => m.AdminProductsComponent) },
  { path: 'users', loadComponent: () => import('./admin-users.component').then(m => m.AdminUsersComponent) },
  { path: 'categories', loadComponent: () => import('./admin-categories.component').then(m => m.AdminCategoriesComponent) },
];
