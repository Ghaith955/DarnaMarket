import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models';

/** Utilisation : data: { roles: ['ADMIN'] } sur la route. */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data['roles'] ?? []) as Role[];
  const role = auth.role();
  return (role && roles.includes(role)) || router.createUrlTree(['/']);
};
