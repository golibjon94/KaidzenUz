import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Public()
  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.smsService.sendOtp(dto.phone);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() body: { phone: string; code: string }) {
    return this.smsService.verifyOtp(body.phone, body.code);
  }
}
