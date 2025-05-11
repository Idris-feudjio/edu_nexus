import { Module } from '@nestjs/common';  
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';  
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [PrismaModule,UserModule,AuthModule,
    ConfigModule.forRoot({
    isGlobal:true
  }),
    DocumentsModule],  
})
export class AppModule {}
