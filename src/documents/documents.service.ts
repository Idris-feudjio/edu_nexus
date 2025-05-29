import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from 'src/common/storage/storage.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Multer } from 'multer'; 
import { CreateDocumentDto, RecordDocumentViewDto, UpdateDocumentDto } from './dto';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, file: Express.Multer.File) {
    const { fileUrl, fileKey } = await this.storageService.uploadFile(file);

    return this.prisma.document.create({
        data: {
            ...createDocumentDto,
            fileUrl,
            fileKey,
            level: createDocumentDto.level ?? '', // Ensure level is a string
        },

      include: { author: true },
    });
  }

  async findAll() {
    return this.prisma.document.findMany({
      include: { author: true },
    });
  }

  async findForUser(userId: number, department: string, level: string, userClass?: string) {
    return this.prisma.document.findMany({
      where: {
        OR: [
          { department, level, class: userClass },
          { department, level, class: null },
          { department, level: undefined, class: null },
        ],
      },
      include: { author: true },
    });
  }

  async findOne(id: number) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { author: true, views: true },
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    await this.findOne(id); // Check if document exists
    return this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
    });
  }

  async remove(id: number) {
    const document = await this.findOne(id);
    await this.storageService.deleteFile(document.fileKey);
    return this.prisma.document.delete({ where: { id } });
  }

  async recordView(recordViewDto: RecordDocumentViewDto) {
    const { documentId, userId, progress } = recordViewDto;

    const existingView = await this.prisma.view.findFirst({
      where: { documentId, userId },
    });

    if (existingView) {
      return this.prisma.view.update({
        where: { id: existingView.id },
        data: { progress, lastViewed: new Date() },
      });
    }

    return this.prisma.view.create({
      data: {
        documentId,
        userId,
        progress,
      },
    });
  }
}
