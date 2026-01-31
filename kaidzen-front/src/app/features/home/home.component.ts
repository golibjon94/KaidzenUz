import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, NzCardModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  services = [
    { title: 'Biznes Diagnostika', icon: 'pie-chart', desc: 'Sotuv, marketing va operatsion jarayonlarning chuqur tahlili.' },
    { title: 'Konsalting', icon: 'solution', desc: 'Ekspertlarimiz tomonidan biznesni rivojlantirish bo\'yicha strategik maslahatlar.' },
    { title: 'Xodimlar auditi', icon: 'team', desc: 'Jamoangiz samaradorligini oshirish va kadrlar tahlili.' }
  ];

  ngOnInit() {
    this.titleService.setTitle('Kaidzen.uz - Professional Biznes Diagnostika va Konsalting');
    this.metaService.updateTag({ name: 'description', content: 'Biznesingizni yangi bosqichga olib chiqish uchun professional diagnostika va konsalting xizmatlari.' });
    this.metaService.updateTag({ name: 'keywords', content: 'biznes diagnostika, konsalting, kaidzen, biznes rivojlantirish, o\'zbekiston biznes' });
    this.metaService.updateTag({ property: 'og:title', content: 'Kaidzen.uz - Professional Biznes Diagnostika' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800' });
  }
}
