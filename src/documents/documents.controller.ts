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
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { DocumentsService } from './documents.service';
  import { CreateDocumentDto } from './dto/create-document.dto';
  import { UpdateDocumentDto } from './dto/update-document.dto';
  import { RecordDocumentViewDto } from './dto/record-view.dto'; 
  import { Role } from 'generated/prisma';
  import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';
import { Multer } from 'multer';
  
  @ApiTags('Documents')
  @ApiBearerAuth()
  @Controller('documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}
  
    @Post()
    @Roles(Role.TEACHER, Role.PEDAGOGIC, Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Create a new document',
      type: CreateDocumentDto,
    })
    @ApiOperation({ summary: 'Upload a new document' })
    @ApiResponse({ status: 201, description: 'Document successfully uploaded' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async create(
      @Body() createDocumentDto: CreateDocumentDto,
      @UploadedFile() file: Multer.File,
      @Req() req,
    ) {
      // Vérifier que l'auteur est bien l'utilisateur connecté
      if (createDocumentDto.authorId !== req.user.sub && req.user.role !== Role.ADMIN) {
        throw new ForbiddenException('You can only upload documents for yourself');
      }
      return this.documentsService.create(createDocumentDto, file);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all documents (filtered by user role)' })
    @ApiResponse({ status: 200, description: 'List of documents' })
    async findAll(@Req() req) {
      if (req.user.role === Role.ADMIN || req.user.role === Role.PEDAGOGIC) {
        return this.documentsService.findAll();
      } else {
        return this.documentsService.findForUser(
          req.user.sub,
          req.user.department,
          req.user.level,
          req.user.class,
        );
      }
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get document by ID' })
    @ApiResponse({ status: 200, description: 'Document details' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    async findOne(@Param('id') id: string) {
      return this.documentsService.findOne(+id);
    }
  
    @Put(':id')
    @Roles(Role.TEACHER, Role.PEDAGOGIC, Role.ADMIN)
    @ApiOperation({ summary: 'Update document metadata' })
    @ApiResponse({ status: 200, description: 'Document updated' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    async update(
      @Param('id') id: string,
      @Body() updateDocumentDto: UpdateDocumentDto,
      @Req() req,
    ) {
      const document = await this.documentsService.findOne(+id);
      
      // Vérifier que l'utilisateur est l'auteur ou un admin
      if (document.authorId !== req.user.sub && req.user.role !== Role.ADMIN) {
        throw new ForbiddenException('You can only update your own documents');
      }
  
      return this.documentsService.update(+id, updateDocumentDto);
    }
  
    @Delete(':id')
    @Roles(Role.TEACHER, Role.PEDAGOGIC, Role.ADMIN)
    @ApiOperation({ summary: 'Delete a document' })
    @ApiResponse({ status: 200, description: 'Document deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    async remove(@Param('id') id: string, @Req() req) {
      const document = await this.documentsService.findOne(+id);
      
      // Vérifier que l'utilisateur est l'auteur ou un admin
      if (document.authorId !== req.user.sub && req.user.role !== Role.ADMIN) {
        throw new ForbiddenException('You can only delete your own documents');
      }
  
      return this.documentsService.remove(+id);
    }
  
    @Post('view')
    @ApiOperation({ summary: 'Record document view progress' })
    @ApiResponse({ status: 201, description: 'View recorded' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async recordView(@Body() recordViewDto: RecordDocumentViewDto, @Req() req) {
      // S'assurer que l'utilisateur ne peut enregistrer que sa propre progression
      if (recordViewDto.userId !== req.user.sub) {
        throw new ForbiddenException('You can only record your own progress');
      }
      return this.documentsService.recordView(recordViewDto);
    }
  
    @Get('user/progress')
    @ApiOperation({ summary: 'Get user document progress' })
    @ApiResponse({ status: 200, description: 'List of document progresses' })
    async getUserProgress(@Req() req) {
      //return this.documentsService.getUserProgress(req.user.sub);
    }
  }
