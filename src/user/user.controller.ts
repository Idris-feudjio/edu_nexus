import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'generated/prisma';
import { GetUser } from 'src/auth/decorator';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ExcelImportService } from 'src/common/storage/import.student.service';
import { UserService } from './user.service'; 
import { UserData } from './dto';
import { AbstractController } from 'src/common/abstracts';

@UseGuards(new JwtAuthGuard())
@Controller('users')
export class UserController extends AbstractController<UserData> {
   protected service: UserService ;
 
  constructor(
    private readonly userService: UserService,
  ) {
    super();
    this.service = userService;
  }

  @Get('me')
  getMe(@GetUser() user: UserData) {
    return this.service.getMe(user.email);
  }

  @Post('import-students') 
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Générer un nom de fichier unique
          const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(
            null,
            `students-${uniqueSuffix}${ext}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        // Vérifier que le fichier est un Excel
        if (
          !file.originalname.match(
            /\.(xlsx|xls)$/,
          )
        ) {
          return cb(
            new Error(
              'Seuls les fichiers Excel sont autorisés!',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async importStudents(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return {
        success: false,
        message: "Aucun fichier n'a été fourni",
      };
    }

    try {
      const result = await this.userService.insertStudentFromExcel(
        file.path
      );
      return {
        success: true,
        message: `Importation réussie de ${result.success} étudiants`,
        errors:
          result.errors.length > 0
            ? result.errors
            : null,
        fileName: file.filename,
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de l'importation: ${error.message}`,
      };
    }
  }
}
