import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';  
import { MailService } from '../common/mail/mail.service';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'src/common/otp.service';
import { AuthResponse } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async requestOtp(email: string): Promise<AuthResponse> { // { message: string }
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const otp = this.otpService.generateOtp();

    const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
    

    await this.prisma.user.update({
      where: { email },
      data: { otp: await argon2.hash(otp), otpExpiry },
    });

    await this.mailService.sendOtpEmail(user.email, otp);

    return {success:true, message: 'OTP sent to your email' };
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

  async login(user: User):Promise<AuthResponse> {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role,
      department: user.department,
      level: user.level,
      class: user.class,
    };

    return {
      success:true,message:"Authentication successful",
      token: this.jwtService.sign(payload,{expiresIn: '24h',secret: this.configService.get<string>('JWT_SECRET')}), 
      user:user
    };
  }

  // logic to logout
async logout(user: User): Promise<AuthResponse> {
  // For JWT-based stateless auth, logout is handled client-side by deleting the token.
  // Optionally, you can implement token blacklisting here if needed.
  return { success: true, message: 'Logged out successfully' };
}
}
