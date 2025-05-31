import { Module } from '@nestjs/common'; 
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Prisma } from 'generated/prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExcelImportService } from 'src/common/storage/import.student.service';
import { UserRepository } from './repository/user.repository';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({   
     imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
    providers: [UserService,ExcelImportService,UserRepository], 
    controllers: [ UserController],
})
export class UserModule {}
