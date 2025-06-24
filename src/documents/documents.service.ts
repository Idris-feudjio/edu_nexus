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
} from './dto';
import { S3Service } from '../common/storage/s3.service';
import {
  BaseRepository,
  BaseService,
} from 'src/common/abstracts';
import { AnnouncementRepository } from './repository/document.repository';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AnnouncementsService extends BaseService<AnnouncementsModel> {
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
  ) {
    const { fileUrl, fileKey } =
      await this.s3Service.uploadFile(
        file,
        true,
        createAnnouncementsDto.fileSource,
      );
    // Remove fileSource from createAnnouncementsDto before saving
    const { fileSource, ...restDto } =
      createAnnouncementsDto;

    const data = {
      ...restDto,
      fileUrl,
      fileKey,
    };
    return this.repository.create(data);
    // return this.prisma.document.create({
    //   data: {
    //     ...restDto,
    //     fileUrl,
    //     fileKey,
    //     level: createAnnouncementsDto.level ?? '', // Ensure level is a string
    //   },

    //   include: { author: true },
    // });
  }

  async findAll() {
    return this.prisma.document.findMany({
      include: { author: true },
    });
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
}
