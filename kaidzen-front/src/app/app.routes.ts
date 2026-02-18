import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  // Home Page (Landing)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Sarash.uz - Biznes Diagnostika va Konsalting Xizmatlari',
        data: {
          seo: {
            description: 'Sarash.uz — biznes diagnostika, konsalting va rivojlantirish xizmatlari. Бизнес диагностика и консалтинг. Business diagnostics and consulting services in Uzbekistan.',
            keywords: 'biznes diagnostika, konsalting, biznes rivojlantirish, sarash, бизнес диагностика, консалтинг, развитие бизнеса, business diagnostics, consulting, business development, Uzbekistan, O\'zbekiston, Узбекистан, biznes maslahat, бизнес консультация, business consulting, kaidzen, кайдзен, kaizen'
          }
        }
      },
      {
        path: 'diagnostics',
        loadComponent: () => import('./features/home/pages/diagnostics/diagnostics').then(m => m.Diagnostics),
        title: 'Biznes Diagnostika - Sarash.uz',
        data: {
          seo: {
            description: 'Biznesingizni diagnostika qiling va rivojlantirish yo\'llarini aniqlang. Диагностика бизнеса — выявите слабые стороны. Business diagnostics — identify growth opportunities.',
            keywords: 'biznes diagnostika, diagnostika xizmati, biznes tahlil, диагностика бизнеса, анализ бизнеса, business diagnostics, business analysis, SWOT tahlil, SWOT анализ, SWOT analysis, sarash diagnostika'
          }
        }
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/home/pages/blog/blog-list/blog-list.component').then(m => m.BlogListComponent),
        title: 'Blog - Biznes Maqolalar | Sarash.uz',
        data: {
          seo: {
            description: 'Biznes rivojlantirish, marketing va boshqaruv bo\'yicha foydali maqolalar. Полезные статьи о развитии бизнеса. Useful articles on business development.',
            keywords: 'biznes blog, biznes maqolalar, marketing maqolalar, бизнес блог, статьи о бизнесе, business blog, business articles, sarash blog, konsalting maqolalar, консалтинг статьи'
          }
        }
      },
      {
        path: 'blog/:id',
        loadComponent: () => import('./features/home/pages/blog/blog-details/blog-details.component').then(m => m.BlogDetailsComponent),
        title: 'Blog - Sarash.uz'
      },
      {
        path: 'cases',
        loadComponent: () => import('./features/home/pages/cases/case-list/case-list.component').then(m => m.CaseListComponent),
        title: 'Muvaffaqiyatli Keyslar - Sarash.uz',
        data: {
          seo: {
            description: 'Sarash.uz mijozlarining muvaffaqiyat tarixi va keyslar. Истории успеха клиентов. Success stories and case studies.',
            keywords: 'muvaffaqiyatli keyslar, biznes keyslar, case study, кейсы, истории успеха, success stories, case studies, sarash keyslar, biznes natijalar, результаты бизнеса'
          }
        }
      },
      {
        path: 'cases/:id',
        loadComponent: () => import('./features/home/pages/cases/case-details/case-details.component').then(m => m.CaseDetailsComponent),
        title: 'Keys - Sarash.uz'
      },
      {
        path: 'about',
        loadComponent: () => import('./features/home/pages/about/about').then(m => m.About),
        title: 'Biz haqimizda - Sarash.uz',
        data: {
          seo: {
            description: 'Sarash.uz jamoasi haqida ma\'lumot. Biznes konsalting va diagnostika bo\'yicha mutaxassislar. О нашей команде. About our team of business consultants.',
            keywords: 'sarash haqida, biznes konsultantlar, jamoamiz, о нас, наша команда, about us, our team, biznes mutaxassislar, бизнес консультанты, business consultants'
          }
        }
      }
    ]
  },

  // Admin Routes (lazy-loaded)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.router').then(m => m.ADMIN_ROUTES)
  },

  // User Profile (lazy-loaded)
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/user.router').then(m => m.USER_ROUTES)
  },

  // Auth Routes
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        loadComponent: () => import('./features/home/pages/auth/register.component').then(m => m.RegisterComponent),
        title: 'Ro\'yxatdan o\'tish - Sarash.uz',
        data: {
          seo: {
            description: 'Sarash.uz platformasida ro\'yxatdan o\'ting va biznes diagnostika xizmatlaridan foydalaning. Зарегистрируйтесь на платформе. Register on the platform.',
            keywords: 'ro\'yxatdan o\'tish, registratsiya, регистрация, register, sign up, sarash registratsiya'
          }
        }
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/home/pages/auth/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: 'Parolni tiklash - Sarash.uz'
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];
