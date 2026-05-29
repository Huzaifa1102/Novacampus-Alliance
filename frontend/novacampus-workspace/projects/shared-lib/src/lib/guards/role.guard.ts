import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (requiredRole: UserRole): CanActivateFn => {
  return () => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    const token = auth.getAccessToken();

    // No token at all — redirect to login
    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    // Token expired — redirect to login
    if (auth.isTokenExpired()) {
      auth.logout();
      router.navigate(['/login']);
      return false;
    }

    // Wrong role — redirect to unauthorized page
    const user = auth.decodeToken(token);
    if (user.role !== requiredRole) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};