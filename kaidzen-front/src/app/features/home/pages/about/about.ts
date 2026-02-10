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
    { value: '10+', label: 'Yillik tajriba', icon: 'trophy' },
    { value: '500+', label: 'Muvaffaqiyatli loyihalar', icon: 'project' },
    { value: '50+', label: 'Professional ekspertlar', icon: 'team' },
    { value: '98%', label: 'Mijozlar mamnunligi', icon: 'smile' }
  ];

  values = [
    {
      title: 'Professionallik',
      description: 'Har bir loyihaga yuqori malakali mutaxassislar bilan yondashuvni ta\'minlaymiz',
      icon: 'star',
      color: 'blue'
    },
    {
      title: 'Ishonchlilik',
      description: 'Mijozlarimiz bilan uzoq muddatli va ishonchli munosabatlar o\'rnatamiz',
      icon: 'safety',
      color: 'green'
    },
    {
      title: 'Innovatsiya',
      description: 'Zamonaviy texnologiyalar va yangicha yondashuvlardan foydalanamiz',
      icon: 'bulb',
      color: 'purple'
    },
    {
      title: 'Natija',
      description: 'Mijozlarimizning maqsadlariga erishishga yo\'naltirilgan strategiyalar ishlab chiqamiz',
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
      year: '2015',
      title: 'Kompaniya tashkil etildi',
      description: 'Kichik jamoamiz bilan biznes konsalting xizmatlarini taqdim eta boshladik'
    },
    {
      year: '2017',
      title: '100+ muvaffaqiyatli loyiha',
      description: 'Turli sohalarda 100 dan ortiq kompaniyalarga xizmat ko\'rsatdik'
    },
    {
      year: '2019',
      title: 'Xalqaro sertifikatlar',
      description: 'Xalqaro standartlar bo\'yicha sertifikatlashdan o\'tdik'
    },
    {
      year: '2021',
      title: 'Raqamli platformani ishga tushirish',
      description: 'Online diagnostika va konsalting xizmatlarini boshladik'
    },
    {
      year: '2024',
      title: 'Mintaqaviy kengayish',
      description: 'Markaziy Osiyo bo\'ylab xizmatlarimizni kengaytirdik'
    }
  ];
}
