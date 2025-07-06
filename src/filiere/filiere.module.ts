import { Module } from '@nestjs/common';
import { FiliereService } from './filiere.service';
import { FiliereController } from './filiere.controller';
import { FiliereRepository } from './repository/filiere.repository';
import { DepartmentService } from 'src/department/department.service';
import { DepartementRepository } from 'src/department/repository/department.repository';

@Module({
  providers: [FiliereService,FiliereRepository,DepartmentService,DepartementRepository],
  controllers: [FiliereController],
  exports: [FiliereService,FiliereRepository],
})
export class FiliereModule {}
