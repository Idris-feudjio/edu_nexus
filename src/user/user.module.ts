import { Module } from '@nestjs/common'; 
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Prisma } from 'generated/prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExcelImportService } from 'src/common/storage/import.student.service';
import { UserRepository } from './repository/user.repository';

@Module({   
    providers: [UserService,ExcelImportService,UserRepository], 
    controllers: [ UserController],
})
export class UserModule {}
