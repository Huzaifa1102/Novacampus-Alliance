import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (allowedRoles: string | string[]) => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.getRole();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (role && roles.includes(role)) {
    return true;
  }
  return router.createUrlTree(['/login']);
};