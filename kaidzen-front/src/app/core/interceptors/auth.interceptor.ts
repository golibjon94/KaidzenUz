import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from '../services/cookie.service';
import { AuthUtils } from '../utils/auth';
import { LocalStorageEnum } from '../models/enums';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);

  const accessToken = cookieService.get(LocalStorageEnum.AccessToken);

  if (accessToken && !AuthUtils.isTokenExpired(accessToken)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return next(req);
};
