import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST, RESPONSE } from '../tokens/express.tokens';
import { Request, Response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: Request,
    @Optional() @Inject(RESPONSE) private response: Response
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get(name: string): string | null {
    if (this.isBrowser) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    } else {
      if (this.request && this.request.headers.cookie) {
        const nameEQ = name + "=";
        const ca = this.request.headers.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
      }
      return null;
    }
  }

  set(name: string, value: string, days: number = 7, path: string = '/'): void {
    if (this.isBrowser) {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=" + path;
    } else {
      // In SSR, we can't set cookies directly on the document, but we can set them on the response object if available.
      // However, usually authentication tokens are set by the client after login, or by the server response.
      // If we need to set a cookie from SSR (e.g. refreshing token), we would use the response object.
      if (this.response) {
         const options: any = { path: path };
         if (days) {
             const date = new Date();
             date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
             options.expires = date;
         }
         this.response.cookie(name, value, options);
      }
    }
  }

  delete(name: string, path: string = '/'): void {
    if (this.isBrowser) {
      document.cookie = name + '=; Max-Age=-99999999; path=' + path;
    } else {
        if (this.response) {
            this.response.clearCookie(name, { path: path });
        }
    }
  }
}
