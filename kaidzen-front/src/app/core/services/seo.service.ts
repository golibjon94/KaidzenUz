import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private document = inject(DOCUMENT);

  private readonly baseUrl = 'http://sarash.uz';
  private readonly defaultImage = 'http://sarash.uz/sarash-logo.png';
  private readonly defaultTitle = 'Sarash.uz - Biznes Diagnostika va Konsalting Xizmatlari';
  private readonly defaultDescription = 'Sarash.uz — biznes diagnostika, konsalting va rivojlantirish xizmatlari. Бизнес диагностика и консалтинг. Business diagnostics and consulting services in Uzbekistan.';
  private readonly defaultKeywords = 'biznes diagnostika, konsalting, biznes rivojlantirish, sarash, бизнес диагностика, консалтинг, развитие бизнеса, business diagnostics, consulting, business development, Uzbekistan';

  init(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const seo: SeoData = data['seo'] || {};
      this.updateTags({
        title: seo.title || data['title'] as string,
        description: seo.description,
        keywords: seo.keywords,
        ogImage: seo.ogImage
      });
    });
  }

  updateTags(seo: SeoData): void {
    const title = seo.title || this.defaultTitle;
    const description = seo.description || this.defaultDescription;
    const keywords = seo.keywords || this.defaultKeywords;
    const image = seo.ogImage || this.defaultImage;
    const url = this.baseUrl + this.router.url;

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:url', content: url });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical
    this.updateCanonical(url);
  }

  private updateCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }
}
