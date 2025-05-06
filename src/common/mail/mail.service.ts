import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendOtpEmail(to: string, otp: string) {
    const mailOptions = {
      from: this.configService.get('SMTP_FROM'),
      to,
      subject: 'Your EduNexus IUT OTP',
      text: `Your OTP is: ${otp}\n\nThis OTP will expire in 5 minutes.`,
      html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
    };

    console.log({mailOptions});
    

    await this.transporter.sendMail(mailOptions);
  }
}