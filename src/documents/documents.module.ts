import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller'; 
import { PrismaModule } from 'src/prisma/prisma.module'; 
import { S3Service, StorageService } from 'src/common/storage';
import { DocumentRepository } from './repository/document.repository';

@Module({
  providers: [DocumentsService, StorageService, DocumentRepository,S3Service],
  controllers: [DocumentsController]
})
export class DocumentsModule {}
