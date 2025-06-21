import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service'; 
import { DepartementRepository } from './repository/department.repository';
import { DepartementsController } from './department.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [DepartmentService,DepartementRepository],
  controllers: [DepartementsController],
  exports:[DepartementRepository,DepartmentService]
})
export class DepartmentModule {}
