import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {HeaderComponent} from '../../components/header/header.component';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-about',
  imports: [CommonModule, MatIconModule, MatButtonModule, HeaderComponent, FooterComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  getMatIcon(icon: string): string {
    switch (icon) {
      case 'trophy':
        return 'emoji_events';
      case 'project':
        return 'work';
      case 'team':
        return 'groups';
      case 'smile':
        return 'sentiment_satisfied';

      case 'star':
        return 'star';
      case 'safety':
        return 'security';
      case 'bulb':
        return 'lightbulb';
      case 'check-circle':
        return 'check_circle';

      case 'arrow-right':
        return 'arrow_forward';
      default:
        return 'info';
    }
  }

  stats = [
    { value: '5+', label: 'Yillik tajriba', icon: 'trophy' },
    { value: '100+', label: 'Muvaffaqiyatli loyihalar', icon: 'project' },
    { value: '20+', label: 'Professional ekspertlar', icon: 'team' },
    { value: '98%', label: 'Mijozlar mamnunligi', icon: 'smile' }
  ];

  values = [
    {
      title: 'Chuqur diagnostika',
      description: 'Har bir loyihani kompaniyaning real holatini, boshqaruv tizimini, operatsion jarayonlarini va moliyaviy ko\'rsatkichlarini kompleks baholashdan boshlaymiz',
      icon: 'star',
      color: 'blue'
    },
    {
      title: 'Tizimli yechimlar',
      description: 'Muammolarning ildiz sabablarini aniqlab, tizimli va o\'lchanadigan yechimlarni ishlab chiqamiz',
      icon: 'safety',
      color: 'green'
    },
    {
      title: 'Amaliy transformatsiya',
      description: 'Bizning yondashuvimiz — nazariy maslahat emas, balki amaliy transformatsiya',
      icon: 'bulb',
      color: 'purple'
    },
    {
      title: 'Barqaror natija',
      description: 'Kompaniyani tartibsiz boshqaruvdan tizimli boshqaruvga olib chiqish, yashirin imkoniyatlarni ochish va barqaror natijaga erishish',
      icon: 'check-circle',
      color: 'orange'
    }
  ];

  team = [
    {
      name: 'Akmal Karimov',
      position: 'Asoschisi va CEO',
      image: 'https://i.pravatar.cc/300?u=1',
      description: 'Biznes konsalting sohasida 15 yillik tajriba',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Dilnoza Rahimova',
      position: 'Strategik maslahatchi',
      image: 'https://i.pravatar.cc/300?u=2',
      description: 'Marketing va sotuv bo\'yicha yetakchi mutaxassis',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Sardor Nazarov',
      position: 'Texnologiya direktori',
      image: 'https://i.pravatar.cc/300?u=3',
      description: 'Raqamli transformatsiya bo\'yicha ekspert',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Kamola Toshmatova',
      position: 'Bosh tahlilchi',
      image: 'https://i.pravatar.cc/300?u=4',
      description: 'Biznes tahlil va diagnostika bo\'yicha mutaxassis',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  timeline = [
    {
      year: '2020',
      title: 'Kompaniya tashkil etildi',
      description: 'SARASH LEAN ADVISORY LLC biznes jarayonlarini tizimlashtirish va samaradorlikni oshirish maqsadida tashkil etildi'
    },
    {
      year: '2021',
      title: 'Birinchi yirik loyihalar',
      description: 'Ishlab chiqarish va savdo sohalarida operatsion diagnostika loyihalarini muvaffaqiyatli amalga oshirdik'
    },
    {
      year: '2022',
      title: 'Xizmatlar kengayishi',
      description: 'Xizmat ko\'rsatish va ofis boshqaruvi sohalariga ham konsalting xizmatlarini kengaytirdik'
    },
    {
      year: '2023',
      title: 'Lean metodologiyasi',
      description: 'Lean yondashuvini chuqur joriy etib, mijozlarga amaliy transformatsiya xizmatlarini taqdim eta boshladik'
    },
    {
      year: '2024',
      title: 'Strategik hamkorlik',
      description: '100 dan ortiq kompaniyalarga strategik hamkor sifatida xizmat ko\'rsatib, barqaror natijalarni qayd etdik'
    }
  ];
}
