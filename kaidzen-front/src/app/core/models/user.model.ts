import { Role } from './enums';

export interface UpdateUserDto {
  fullName?: string;
  phone?: string;
  password?: string;
  address?: string;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  address?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
