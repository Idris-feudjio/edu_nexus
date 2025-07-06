import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StorageService } from 'src/common/storage/google.cloud.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAnnouncementDto,
  AnnouncementsModel,
  RecordAnnouncementViewDto,
  UpdateAnnouncementDto,
  DocumentSummaryDto,
} from './dto';
import { S3Service } from '../common/storage/s3.service';
import {
  BaseRepository,
  BaseService,
} from 'src/common/abstracts';
import { AnnouncementRepository } from './repository/document.repository';
import { UserService } from 'src/user/user.service';
import { $Enums } from '@prisma/client';

@Injectable()
export class AnnouncementsService extends BaseService<AnnouncementsModel,DocumentSummaryDto> {
  repository: AnnouncementRepository;
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private s3Service: S3Service,
    private docRepository: AnnouncementRepository,
    private userService: UserService,
  ) {
    super();
    this.repository = docRepository;
  }

  async createAnnounce(
    announce: CreateAnnouncementDto,
  ) {
    const isUserActive =
      await this.userService.isUserActive(
        announce.authorId,
      );
    if (!isUserActive) {
      throw new NotFoundException(
        'User Not Found',
      );
    }
    console.log('Is user active', isUserActive);

    // Use AnnouncementsRepository to create the document
    return this.repository.create(announce);
  }

  async createWithImage(
    createAnnouncementsDto: CreateAnnouncementDto,
    file: Express.Multer.File,
  ): Promise<DocumentSummaryDto>{
 
      const isUserActive =
      await this.userService.isUserActive(
        createAnnouncementsDto.authorId,
      );
    if (!isUserActive) {
      throw new NotFoundException(
        'User Not Found',
      );
    }

    const { fileUrl, fileKey } =
      await this.s3Service.uploadFile(
        file,
        true,
        createAnnouncementsDto.fileSource,
      );
    // Remove fileSource from createAnnouncementsDto before saving
    const { fileSource, ...restDto } =
      createAnnouncementsDto;

    const announceResponse =await this.prisma.document.create({
      data: {
        ...restDto,
        fileUrl,
        fileKey,
      }, 
      include: { author: true,departement:true,filiere:true },
    });

    return this. buildDocumentresponse(announceResponse) 
  }

  async findAll() : Promise<DocumentSummaryDto[]>{
   const documents =await this.prisma.document.findMany({
      include: {  author: true,departement:true,filiere:true  },
    }); 
    return documents.map(doc => (this. buildDocumentresponse(doc)));
  }

  async getAuthorAnnouncements(authorId: number): Promise<DocumentSummaryDto[]> {
    const documents = await this.prisma.document.findMany({
      where: { authorId },
      include: {  author: true,departement:true,filiere:true  },
    });
    return  documents.map(doc => (this. buildDocumentresponse(doc)));
  }

  async getStudentAnnouncementsByFiliere(
    filiereId: number,
  ): Promise<DocumentSummaryDto[]> {
    const documents = await this.prisma.document.findMany({
      where: { filiereId },
      include: {  author: true,departement:true,filiere:true  },
    });
    return  documents.map(doc => (this. buildDocumentresponse(doc)));
  }

  async getStudentAnnouncementsByDepartment(
    departementId: number,
  ): Promise<DocumentSummaryDto[]> {
    const documents = await this.prisma.document.findMany({
      where: { departementId },
      include: {  author: true,departement:true,filiere:true  },
    });
    return  documents.map(doc => (this. buildDocumentresponse(doc)));
  }

  async findForUser(
    userId: number,
    department: string,
    level: string,
    userClass?: string,
  ) {
    return this.prisma.document.findMany({
      where: {
        OR: [
          { level, class: userClass },
          { level, class: null },
          {
            level: undefined,
            class: null,
          },
        ],
      },
      include: { author: true },
    });
  }

  async findOne(id: number) {
    const document =
      await this.prisma.document.findUnique({
        where: { id },
        include: { author: true, views: true },
      });
    if (!document) {
      throw new NotFoundException(
        `Announcements with ID ${id} not found`,
      );
    }
    return document;
  }

  async updateWithImage(
    id: number,
    updateAnnouncementsDto: UpdateAnnouncementDto,
  ) {
    await this.findOne(id); // Check if document exists
    return this.prisma.document.update({
      where: { id },
      data: updateAnnouncementsDto,
    });
  }

  async remove(id: number) {
    const document = await this.findOne(id);
    await this.storageService.deleteFile(
      document.fileKey!,
    );
    return this.prisma.document.delete({
      where: { id },
    });
  }

  async recordView(
    recordViewDto: RecordAnnouncementViewDto,
  ) {
    const { documentId, userId, progress } =
      recordViewDto;

    const existingView =
      await this.prisma.view.findFirst({
        where: { documentId, userId },
      });

    if (existingView) {
      return this.prisma.view.update({
        where: { id: existingView.id },
        data: {
          progress,
          lastViewed: new Date(),
        },
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




  buildDocumentresponse(doc: { author: { id: number; filiereId: number | null; level: string | null; class: string | null; createdAt: Date; updatedAt: Date; email: string; firstName: string; lastName: string; role: $Enums.Role; otp: string | null; otpExpiry: Date | null; isActive: boolean; department: string | null; }; departement: { id: number; name: string; code: string; } | null; filiere: { id: number; departementId: number; name: string; code: string; } | null; } & { id: number; title: string; description: string | null; fileUrl: string | null; fileKey: string | null; authorId: number; departementId: number | null; filiereId: number | null; level: string; class: string | null; createdAt: Date; updatedAt: Date; }):DocumentSummaryDto{
   const docResp:DocumentSummaryDto={
       id: doc.id,
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl, 
      author: {
        email:doc.author.email,
        firstName:doc.author.firstName,
        id:doc.author.id,
        lastName: doc.author.lastName,
        role:doc.author.role
      }, 
      class:doc.class,
      filiere: {
        code: doc.filiere?.code,
        id: doc.filiere?.id,
        name: doc.filiere?.name ,
        department:{
          code: doc.departement?.code , 
          name: doc.departement?.name
        }
      },
      departement: {
        code: doc.departement?.code , 
        name: doc.departement?.name
      },
      createdAt: doc.createdAt
    } 
    return docResp

  }
}
