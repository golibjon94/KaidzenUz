import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzCardModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private message = inject(NzMessageService);

  isLoading = signal(false);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+998\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: ['']
  });

  handleRegister() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authService.signup(this.registerForm.value).subscribe({
        next: () => {
          this.message.success('Ro\'yxatdan o\'tish muvaffaqiyatli amalga oshirildi!');
          this.isLoading.set(false);
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.message.error('Ro\'yxatdan o\'tishda xatolik yuz berdi!');
          this.isLoading.set(false);
        }
      });
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
