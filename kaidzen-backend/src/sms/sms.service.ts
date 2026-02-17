import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import FormData = require('form-data');

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly baseUrl = 'https://notify.eskiz.uz/api';
  private token: string | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async authenticate(): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/auth/login`, {
          email: this.configService.get<string>('eskiz.email'),
          password: this.configService.get<string>('eskiz.password'),
        }),
      );

      this.token = data?.data?.token;
      this.logger.log('Eskiz token acquired successfully');
    } catch (error) {
      this.logger.error('Failed to authenticate with Eskiz', error?.message);
      throw error;
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch(
          `${this.baseUrl}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${this.token}` } },
        ),
      );

      this.token = data?.data?.token;
      this.logger.log('Eskiz token refreshed successfully');
    } catch (error) {
      this.logger.warn('Token refresh failed, re-authenticating...');
      await this.authenticate();
    }
  }

  private async ensureToken(): Promise<void> {
    if (!this.token) {
      await this.authenticate();
    }
  }

  private buildSmsFormData(mobile_phone: string, message: string, from: string): FormData {
    const formData = new FormData();
    formData.append('mobile_phone', mobile_phone);
    formData.append('message', message);
    formData.append('from', from);
    return formData;
  }

  async sendSms(
    mobile_phone: string,
    message: string,
    from: string = '4546',
  ): Promise<any> {
    await this.ensureToken();

    try {
      const formData = this.buildSmsFormData(mobile_phone, message, from);
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/message/sms/send`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              ...formData.getHeaders(),
            },
          },
        ),
      );

      return data;
    } catch (error) {
      const status = error?.response?.status;
      const errData = error?.response?.data;
      this.logger.error(`Failed to send SMS [${status}]: ${JSON.stringify(errData)}`);

      if (status === 401) {
        this.logger.warn('Token expired, refreshing...');
        await this.refreshToken();

        const formData = this.buildSmsFormData(mobile_phone, message, from);
        const { data } = await firstValueFrom(
          this.httpService.post(
            `${this.baseUrl}/message/sms/send`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
                ...formData.getHeaders(),
              },
            },
          ),
        );

        return data;
      }

      throw error;
    }
  }

  async sendOtp(phone: string): Promise<{ message: string; code?: string }> {
    // Telefon raqam tizimda mavjudligini tekshirish
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (existingUser) {
      throw new ConflictException(
        'Bu telefon raqam allaqachon tizimda ro\'yxatdan o\'tgan. Iltimos, login va parol bilan kiring.',
      );
    }

    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const code = isProduction
      ? Math.floor(1000 + Math.random() * 9000).toString()
      : '1234';
    const cleanPhone = phone.replace(/^\+/, '');

    await this.prisma.otp.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    if (isProduction) {
      const message = `Sarash Biznes consulting xizmati. Tasdiqlash kodi: ${code}`;
      await this.sendSms(cleanPhone, message);
      return { message: 'OTP sent successfully' };
    } else {
      const message = 'Bu Eskiz dan test';
      await this.sendSms(cleanPhone, message);
      return { message: 'OTP sent successfully (test mode)', code };
    }
  }

  async verifyOtp(
    phone: string,
    code: string,
  ): Promise<{ valid: boolean }> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return { valid: false };
    }

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return { valid: true };
  }
}
