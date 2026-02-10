import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml',
  standalone: true,
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    // 1) HTML taglarni olib tashlash
    const withoutTags = value.replace(/<[^>]+>/g, ' ');

    // 2) Eng ko'p uchraydigan entity'larni oddiy ko'rinishga keltirish
    return withoutTags
      .replace(/&nbsp;/g, ' ')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
