import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<{ status: string; data: User[] }>(`${this.baseUrl}/me`);
  }

  updateProfile(payload: { firstName?: string; lastName?: string; phone?: string; address?: string }) {
    return this.http.patch<{ status: string; data: User }>(`${this.baseUrl}/me`, payload);
  }

  // Note: the backend's change-password endpoint currently has a bug
  // (it calls a `comparePassword` method that isn't defined on the User model),
  // so this call will likely fail with a 500 until that's fixed backend-side.
  changePassword(currentPassword: string, newPassword: string) {
    return this.http.patch<{ status: string; message: string }>(`${this.baseUrl}/me/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  // Note: the backend's delete-account endpoint references `bcrypt` without
  // importing it, so this call will likely fail with a 500 until that's fixed backend-side.
  deleteAccount(password: string) {
    return this.http.delete<{ status: string; message: string }>(`${this.baseUrl}/me`, { body: { password } });
  }
}
