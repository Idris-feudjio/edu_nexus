import { Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';
import * as argon2 from 'argon2';

@Injectable()
export class OtpService {
  private readonly OTP_LENGTH = 6;
  private readonly OTP_CONFIG = {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  };

  /**
   * Génère un OTP aléatoire
   * @returns OTP string
   */
  generateOtp(): string {
    return otpGenerator.generate(this.OTP_LENGTH, this.OTP_CONFIG);
  }

  /**
   * Vérifie si l'OTP fourni correspond à l'OTP stocké (hashé)
   * @param storedOtp OTP stocké (hashé)
   * @param suppliedOtp OTP fourni par l'utilisateur
   * @returns Promise<boolean>
   */
  async verifyOtp(storedOtp: string, suppliedOtp: string): Promise<boolean> {
    return argon2.verify(storedOtp, suppliedOtp);
  }

  /**
   * Vérifie si l'OTP a expiré
   * @param otpExpiry Date d'expiration de l'OTP
   * @returns boolean
   */
  isOtpExpired(otpExpiry: Date): boolean {
    return new Date() > otpExpiry;
  }

  /**
   * Génère une date d'expiration pour l'OTP
   * @param minutes Durée de validité en minutes
   * @returns Date
   */
  generateOtpExpiry(minutes: number): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry;
  }
}