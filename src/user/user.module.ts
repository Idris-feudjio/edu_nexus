import { Module } from '@nestjs/common'; 
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExcelImportService } from 'src/common/storage/import.student.service';
import { UserRepository } from './repository/user.repository';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FiliereService } from 'src/filiere/filiere.service';
import { FiliereRepository } from 'src/filiere/repository/filiere.repository';
import { DepartmentService } from 'src/department/department.service';
import { DepartementRepository } from 'src/department/repository/department.repository';

@Module({   
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  providers: [UserService, ExcelImportService, UserRepository,FiliereService,FiliereRepository,DepartmentService,DepartementRepository], 
  controllers: [UserController],
  exports: [UserService,ExcelImportService], // Export UserService to make it available globally
})
export class UserModule {}
