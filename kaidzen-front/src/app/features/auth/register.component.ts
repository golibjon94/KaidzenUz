import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styles: [`:host { display: block; }`],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotifyService);

  isLoading = signal(false);
  hidePassword = true;

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: [''],
  });

  handleRegister() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const registerData = {
        ...this.registerForm.value,
        phone: `+998${this.registerForm.value.phone}`,
      };
      this.authService.signup(registerData).subscribe({
        next: () => {
          this.notify.success("Ro'yxatdan o'tish muvaffaqiyatli!");
          this.isLoading.set(false);
          this.router.navigate(['/profile']);
        },
        error: () => {
          this.notify.error("Ro'yxatdan o'tishda xatolik!");
          this.isLoading.set(false);
        },
      });
    } else {
      Object.values(this.registerForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
