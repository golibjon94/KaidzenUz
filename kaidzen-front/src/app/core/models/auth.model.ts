export interface SignupDto {
  fullName: string;
  phone: string;
  password?: string;
  address?: string;
}

export interface LoginDto {
  phone: string;
  password?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}
