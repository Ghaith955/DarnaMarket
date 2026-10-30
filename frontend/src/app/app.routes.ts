import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/shop/shop.routes').then(m => m.SHOP_ROUTES) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  {
    path: 'vendor', canActivate: [authGuard, roleGuard], data: { roles: ['FOURNISSEUR'] },
    loadChildren: () => import('./features/vendor/vendor.routes').then(m => m.VENDOR_ROUTES),
  },
  {
    path: 'admin', canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
