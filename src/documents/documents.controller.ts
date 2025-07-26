import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  ForbiddenException,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnnouncementsService } from './documents.service';
import {
  CreateAnnouncementDto,  
  AnnouncementsModel,
  RecordAnnouncementViewDto,
  UpdateAnnouncementDto,
  DocumentSummaryDto,
} from './dto'; 
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  JwtAuthGuard,
  RolesGuard,
} from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/common/enums/role.enum';
import {
  AbstractController
} from 'src/common/abstracts';
import { log } from 'console';

@ApiTags('Announcements')
@ApiBearerAuth()
@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController extends AbstractController<AnnouncementsModel,DocumentSummaryDto> {
  service: AnnouncementsService;

  constructor(
    private readonly announceService: AnnouncementsService,
  ) {
    super();
    this.service = announceService;
  }

  @Post('publish-text')
  @Roles(Role.TEACHER, Role.PEDAGOGIC, Role.ADMIN)
  async createAnnounce(
    @Body() createDocumentDto: CreateAnnouncementDto,
  ) {
    console.log(createDocumentDto);
    return this.service.createAnnounce(
      createDocumentDto,
    );
  }


  @Post('publish')
  @Roles(Role.TEACHER, Role.PEDAGOGIC, Role.ADMIN)
 @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async createWithImage(
        @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg|pdf)',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() createDocumentDto: CreateAnnouncementDto, 
  ) {
    
    // Je veux convertir authorId disponible dans l'objet CreateAnnouncementDto en string et afficher l'objet
    createDocumentDto.authorId = Number(
      createDocumentDto.authorId,
    );
    createDocumentDto.filiereId = Number(createDocumentDto.filiereId)
     createDocumentDto.departementId = Number(createDocumentDto.departementId)

   return this.announceService.createWithImage(
     createDocumentDto,
     file,
   );
  }

  @Get('all')
  @ApiOperation({
    summary:
      'Get all documents (filtered by user role)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of documents',
  })
  async findAll(@Req() req):Promise<DocumentSummaryDto[]>{
    
    if (
      req.user.role === Role.ADMIN ||
      req.user.role === Role.PEDAGOGIC
    ) {
      return this.announceService.findAll();
    } else {
     // return this.announceService.findForUser(
     //   req.user.sub,
     //   req.user.department,
     //   req.user.level,
     //   req.user.class,
     // );
     return[]
    }

  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Document details',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  async findOne(@Param('id') id: string) {
    return this.announceService.findOne(+id);
  }

  @Put(':id')
  @Roles(Role.TEACHER, Role.PEDAGOGIC, Role.ADMIN)
  @ApiOperation({
    summary: 'Update document metadata',
  })
  @ApiResponse({
    status: 200,
    description: 'Document updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  async updateWithImage(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateAnnouncementDto,
    @Req() req,
  ) {
    const document =
      await this.announceService.findOne(+id);

    // Vérifier que l'utilisateur est l'auteur ou un admin
    if (
      document.authorId !== req.user.sub &&
      req.user.role !== Role.ADMIN
    ) {
      throw new ForbiddenException(
        'You can only update your own documents',
      );
    }

    return this.announceService.update(
      +id,
      updateDocumentDto,
    );
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.PEDAGOGIC, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({
    status: 200,
    description: 'Document deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  async remove(
    @Param('id') id: string,
    @Req() req,
  ) {
    const document =
      await this.announceService.findOne(+id);

    // Vérifier que l'utilisateur est l'auteur ou un admin
    if (
      document.authorId !== req.user.sub &&
      req.user.role !== Role.ADMIN
    ) {
      throw new ForbiddenException(
        'You can only delete your own documents',
      );
    }

    return this.announceService.remove(+id);
  }

  @Get('mydocs/:authorId')
  getAuthorAnnouncements(
    @Param('authorId') authorId: number,
  ): Promise<DocumentSummaryDto[]> {
    console.log(authorId);
    
    return this.announceService.getAuthorAnnouncements(
      authorId,
    );
  }

  @Get('by-departement/:departementId')
 async  getStudentAnnouncementsByDepartment(
    @Param('departementId') departementId: number,
  ): Promise<DocumentSummaryDto[]> {
    return this.announceService.getStudentAnnouncementsByDepartment(
      departementId,
    );
  }
  @Get('by-filiere/:filiereId')
  async getStudentAnnouncementsByFiliere(
    @Param('filiereId') filiereId: number,
  ): Promise<DocumentSummaryDto[]> {
    return this.announceService.getStudentAnnouncementsByFiliere(
      filiereId,
    );
  }


  // @Post('view')
  // @ApiOperation({
  //   summary: 'Record document view progress',
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: 'View recorded',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request',
  // })
  // async recordView(
  //   @Body() recordViewDto: RecordAnnouncementViewDto,
  //   @Req() req,
  // ) {
  //   // S'assurer que l'utilisateur ne peut enregistrer que sa propre progression
  //   if (recordViewDto.userId !== req.user.sub) {
  //     throw new ForbiddenException(
  //       'You can only record your own progress',
  //     );
  //   }
  //   return this.announceService.recordView(
  //     recordViewDto,
  //   );
  // }

  // @Get('user/progress')
  // @ApiOperation({
  //   summary: 'Get user document progress',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'List of document progresses',
  // })
  // async getUserProgress(@Req() req) {
  //   //return this.announceService.getUserProgress(req.user.sub);
  // }
 }