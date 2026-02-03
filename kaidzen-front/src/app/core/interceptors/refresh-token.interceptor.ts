import { HttpErrorResponse, HttpRequest, type HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError, of, EMPTY } from 'rxjs';
import { LocalStorageEnum } from '../models/enums';
import { AuthStore } from '../stores/auth.store';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const platformId = inject(PLATFORM_ID);
  const isServer = isPlatformServer(platformId);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        // SSR da 401 xatolarni jimgina handle qilamiz
        if (isServer) {
          authService.removeTokensAndNavigate();
          return EMPTY;
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.updateTokenWithRefreshToken().pipe(
            switchMap((res) => {
              if (!res || !res.data?.accessToken) {
                isRefreshing = false;
                authService.removeTokensAndNavigate();
                return EMPTY;
              }
              authStore.setTokens(res.data.accessToken, res.data.refreshToken);
              isRefreshing = false;
              refreshTokenSubject.next(res.data.accessToken);
              return next(addTokenHeader(req, res.data.accessToken));
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.removeTokensAndNavigate();
              return EMPTY;
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
