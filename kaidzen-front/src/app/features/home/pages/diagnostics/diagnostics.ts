import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material modullari (HTML-dagi mat- tugmalar uchun shart)
 import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

// Komponentlar va Servislar
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { HomeService } from '../../services/home.service'; // Testlarni oladigan servis
import { AuthStore } from '../../../../core/stores/auth.store';
import { Test } from '../../../../core/models/test.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-diagnostics',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './diagnostics.html',
  styleUrl: './diagnostics.css',
})
export class Diagnostics implements OnInit {
  private homeService = inject(HomeService);
  private router = inject(Router);
  public authStore = inject(AuthStore);

  // Header ichidagi login modalni ochish uchun reference
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  tests = signal<Test[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.loading.set(true);
    this.homeService.getTests().pipe(
      catchError(() => {
        this.loading.set(false);
        return of([]);
      })
    ).subscribe(res => {
      // Kelayotgan ma'lumot array yoki {data: []} bo'lishini tekshirish
      const testsData = Array.isArray(res) ? res : (res as any).data || [];
      this.tests.set(testsData);
      this.loading.set(false);
    });
  }

  goToTests() {
    if (this.authStore.isAuthenticated()) {
      this.router.navigate(['/profile/tests']);
    } else {
      // Agar login qilmagan bo'lsa, headerdagi modalni chaqiramiz
      this.headerComponent.showLoginModal();
    }
  }
}