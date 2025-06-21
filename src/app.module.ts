import { Module } from '@nestjs/common';  
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';  
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AnnouncementModule } from './documents/documents.module';
import { DepartmentModule } from './department/department.module'; 
import { FiliereModule } from './filiere/filiere.module';

@Module({
  imports: [PrismaModule,UserModule,AuthModule,
    ConfigModule.forRoot({
    isGlobal:true
  }),
    AnnouncementModule,
    DepartmentModule,
    FiliereModule],  
})
export class AppModule {}
