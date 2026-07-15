import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  loading = true;
  saving = false;
  profileMessage = '';
  profileError = '';

  passwordSaving = false;
  passwordMessage = '';
  passwordError = '';

  deleteError = '';
  deleting = false;

  profileForm = this.fb.group({
    firstName: ['', [Validators.minLength(3), Validators.maxLength(50)]],
    lastName: ['', [Validators.minLength(3), Validators.maxLength(50)]],
    phone: [''],
    address: [''],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
  });

  deleteForm = this.fb.group({
    password: ['', Validators.required],
  });

  constructor(
    public auth: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (res) => {
        const user = res.data[0];
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  saveProfile() {
    this.saving = true;
    this.profileMessage = '';
    this.profileError = '';
    this.userService.updateProfile(this.profileForm.getRawValue() as Record<string, string>).subscribe({
      next: (res) => {
        this.saving = false;
        this.profileMessage = 'Profile updated.';
        this.auth.updateStoredUser(res.data);
      },
      error: (err) => {
        this.saving = false;
        this.profileError = err.error?.message || 'Could not update profile.';
      },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordSaving = true;
    this.passwordMessage = '';
    this.passwordError = '';
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.userService.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => {
        this.passwordSaving = false;
        this.passwordMessage = 'Password updated.';
        this.passwordForm.reset();
      },
      error: (err) => {
        this.passwordSaving = false;
        this.passwordError = err.error?.message || 'Could not update password.';
      },
    });
  }

  deleteAccount() {
    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      return;
    }
    if (!confirm('This will permanently delete your account. Continue?')) return;
    this.deleting = true;
    this.deleteError = '';
    this.userService.deleteAccount(this.deleteForm.getRawValue().password!).subscribe({
      next: () => {
        this.deleting = false;
        this.auth.logout();
      },
      error: (err) => {
        this.deleting = false;
        this.deleteError = err.error?.message || 'Could not delete account.';
      },
    });
  }
}
