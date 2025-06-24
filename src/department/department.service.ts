import { Injectable } from '@nestjs/common'; 
import { BaseService } from 'src/common/abstracts';
import { DepartementRepository } from './repository/department.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepartementDto, DepartementSummaryDto } from './dto';

@Injectable()
export class DepartmentService extends BaseService<DepartementDto,DepartementSummaryDto> {
    repository: DepartementRepository; 
      constructor(private departmentRepo: DepartementRepository,
          private readonly prisma: PrismaService,
      ){
        super()
        this.repository = departmentRepo;
    }


}
