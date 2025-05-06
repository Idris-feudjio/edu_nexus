import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';  
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailService } from 'src/common/mail/mail.service';
import { OtpService } from 'src/common/otp.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpService, MailService],
  exports: [AuthService],
})
export class AuthModule {}