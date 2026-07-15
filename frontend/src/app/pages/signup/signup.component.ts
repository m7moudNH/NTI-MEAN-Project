import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './auth-pages.css',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  loading = false;
  errorMessage = '';
  selectedFile: File | null = null;

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    phone: [''],
    address: [''],
  });

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const raw = this.form.getRawValue();
    this.auth
      .signUp({
        firstName: raw.firstName!,
        lastName: raw.lastName!,
        email: raw.email!,
        password: raw.password!,
        phone: raw.phone || undefined,
        address: raw.address || undefined,
        imageUrl: this.selectedFile || undefined,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Could not create your account.';
        },
      });
  }
}
