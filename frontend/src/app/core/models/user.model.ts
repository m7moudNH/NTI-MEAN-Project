export type UserRole = 'admin' | 'user';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  imageUrl?: string;
  address?: string;
}

export interface AuthResponse {
  status: string;
  message?: string;
  token: string;
  data: { user: User };
}
