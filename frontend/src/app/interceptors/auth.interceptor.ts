import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  console.log('Interceptor: Intercepting request to', req.url);

  let authReq = req;
  // Skip attaching token for auth endpoints to prevent sending expired tokens to public endpoints
  if (token && !req.url.includes('/api/auth')) {
    console.log('Interceptor: Attaching token to', req.url);
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  } else {
    console.log('Interceptor: NOT attaching token (No token or Auth endpoint)');
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Interceptor: Request failed', error.status, req.url);
      if (error.status === 403) {
        console.log('Interceptor: 403 detected. Attempting refresh...');
        if (token) {
          return authService.refreshToken().pipe(
            switchMap(res => {
              console.log('Interceptor: Refresh success, retrying original request');
              const newReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${res.accessToken}`)
              });
              return next(newReq);
            }),
            catchError(err => {
              console.error('Interceptor: Refresh failed, logging out');
              authService.logout();
              return throwError(() => err);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
