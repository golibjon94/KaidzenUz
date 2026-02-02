import { HttpErrorResponse, HttpRequest, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, catchError, filter, switchMap, take, tap, throwError } from 'rxjs';
import { LocalStorageEnum } from '../models/enums';
import { AuthStore } from '../stores/auth.store';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.updateTokenWithRefreshToken().pipe(
            tap((res) => {
              if (!res.data.accessToken) {
                throw new Error('Missing access token in refresh response');
              }
              authStore.setTokens(res.data.accessToken, res.data.refreshToken);
            }),
            switchMap((res) => {
              isRefreshing = false;
              refreshTokenSubject.next(res.data.accessToken);
              return next(addTokenHeader(req, res.data.accessToken));
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.removeTokensAndNavigate();
              return throwError(() => err);
            })
          );
        }

        return refreshTokenSubject.pipe(
          filter((token) => token != null),
          take(1),
          switchMap((token) => {
            return next(addTokenHeader(req, token));
          })
        );
      }
      return throwError(() => error);
    })
  );
};

export const addTokenHeader = (request: HttpRequest<any>, accessToken: string) => {
  return request.clone({
    headers: request.headers.set('Authorization', 'Bearer ' + accessToken),
  });
};
