import { Module } from '@nestjs/common'; 
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Prisma } from 'generated/prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExcelImportService } from 'src/common/storage/import.student.service';

@Module({   
    providers: [UserService,ExcelImportService], 
    controllers: [ UserController],
})
export class UserModule {}
