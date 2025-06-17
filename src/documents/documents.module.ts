import { Module } from '@nestjs/common';
import {  AnnouncementsService } from './documents.service';
import { AnnouncementsController } from './documents.controller'; 
import { PrismaModule } from 'src/prisma/prisma.module'; 
import { ExcelImportService, S3Service, StorageService } from 'src/common/storage';
import { AnnouncementRepository } from './repository/document.repository';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/repository/user.repository';

@Module({
  providers: [AnnouncementsService, StorageService, AnnouncementRepository,S3Service,UserService,ExcelImportService,UserRepository],
  controllers: [AnnouncementsController]
})
export class AnnouncementModule {}
