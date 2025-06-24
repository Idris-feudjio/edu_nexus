import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'; 
import { BaseService } from 'src/common/abstracts';
import { FiliereRepository } from './repository/filiere.repository';
import { DepartmentService } from 'src/department/department.service';
import { CreateFiliereDto, FiliereDto, FiliereSummaryDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FiliereService extends BaseService<FiliereDto,FiliereSummaryDto> {
  repository: FiliereRepository;
  constructor(
    private departmentService: DepartmentService,
    private filiereRepository: FiliereRepository,
     private readonly prisma: PrismaService,
  ) {
    super(); 
    this.repository =filiereRepository
  }

  async createFiliere(
    filiere: CreateFiliereDto,
  ): Promise<FiliereSummaryDto> {
    let isDepartmentExit =
      await this.departmentService.exists(
        filiere.departementId!,
      );
    if (!isDepartmentExit) {
      throw new NotFoundException(
        'Departemant not found',
      );
    }
    return await this.repository.create(filiere);
  
  }
}
