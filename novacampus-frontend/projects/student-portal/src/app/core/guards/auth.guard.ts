import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = (allowedRole: string) => {
  return () => {
    const router = inject(Router);
    const userRole = localStorage.getItem('user_role'); // Placeholder for JWT decode

    if (userRole === allowedRole) {
      return true;
    }
    
    // Redirect to login if not authorized
    return router.parseUrl('/login');
  };
};