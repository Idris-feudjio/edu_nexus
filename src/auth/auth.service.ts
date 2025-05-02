import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { OtpService } from './otp.service';
import { MailService } from '../common/mail/mail.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private mailService: MailService,
  ) {}

  async requestOtp(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const otp = this.otpService.generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    await this.prisma.user.update({
      where: { email },
      data: { otp: await argon2.hash(otp), otpExpiry },
    });

    await this.mailService.sendOtpEmail(user.email, otp);

    return { message: 'OTP sent to your email' };
  }

  async validateOtp(email: string, otp: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.otp || !user.otpExpiry) {
      throw new UnauthorizedException('Invalid OTP request');
    }

    if (new Date() > user.otpExpiry) {
      throw new UnauthorizedException('OTP expired');
    }

    const isValid = await argon2.verify(user.otp, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP after successful validation
    await this.prisma.user.update({
      where: { email },
      data: { otp: null, otpExpiry: null },
    });

    return user;
  }

  async login(user: User) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role,
      department: user.department,
      level: user.level,
      class: user.class,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        level: user.level,
        class: user.class,
      },
    };
  }
}
