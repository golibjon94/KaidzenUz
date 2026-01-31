import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeService } from './services/home.service';
import { BlogPost } from '../../core/models/blog.model';
import { BusinessCase } from '../../core/models/case.model';
import { Test } from '../../core/models/test.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule, NzCardModule, NzTagModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'ngSkipHydration': 'true'
  }
})
export class HomeComponent implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private homeService = inject(HomeService);

  services = [
    { title: 'Biznes Diagnostika', icon: 'pie-chart', desc: 'Sotuv, marketing va operatsion jarayonlarning chuqur tahlili.' },
    { title: 'Konsalting', icon: 'solution', desc: 'Ekspertlarimiz tomonidan biznesni rivojlantirish bo\'yicha strategik maslahatlar.' },
    { title: 'Xodimlar auditi', icon: 'team', desc: 'Jamoangiz samaradorligini oshirish va kadrlar tahlili.' }
  ];

  latestPosts: BlogPost[] = [];
  cases: BusinessCase[] = [];
  tests: Test[] = [];

  ngOnInit() {
    this.titleService.setTitle('Kaidzen.uz - Professional Biznes Diagnostika va Konsalting');
    this.metaService.updateTag({ name: 'description', content: 'Biznesingizni yangi bosqichga olib chiqish uchun professional diagnostika va konsalting xizmatlari.' });

    this.loadData();
  }

  loadData() {
    this.homeService.getLatestPosts().subscribe(posts => this.latestPosts = posts);
    this.homeService.getCases().subscribe(cases => this.cases = cases);
    this.homeService.getTests().subscribe(tests => this.tests = tests);
  }
}
