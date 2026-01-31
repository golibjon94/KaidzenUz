import { ApplicationStatus } from './enums';

export interface CreateApplicationDto {
  fullName: string;
  phone: string;
  companyName?: string;
  message: string;
}

export interface Application {
  id: string;
  fullName: string;
  phone: string;
  companyName?: string;
  message?: string;
  status: ApplicationStatus;
  createdAt: Date;
}
