import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth  = inject(AuthService);
  const token = auth.getAccessToken();

  // Attach the token to every outgoing request
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {

      // Token expired — try to refresh silently
      if (err.status === 401) {
        return auth.refreshToken().pipe(
          switchMap(res => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access_token}` }
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            // Refresh also failed — force logout
            auth.logout();
            window.location.href = '/login';
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};