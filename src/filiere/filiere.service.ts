import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'; 
import { BaseService } from 'src/common/abstracts';
import { FiliereRepository } from './repository/filiere.repository';
import { DepartmentService } from 'src/department/department.service';
import { CreateFiliereDto, FiliereDto } from './dto';

@Injectable()
export class FiliereService extends BaseService<FiliereDto> {
  repository: FiliereRepository;
  constructor(
    private departmentService: DepartmentService,
  ) {
    super();
  }

  async createFiliere(
    filiere: CreateFiliereDto,
  ): Promise<{
    name: string;
   // id: number;
    code: string;
    departementId: number;
  }> {
    let isDepartmentExit =
      await this.departmentService.exists(
        filiere.departementId!,
      );
    if (isDepartmentExit) {
      throw new NotFoundException(
        'Departemant not found',
      );
    }
    const createdFiliere = await this.repository.create(filiere);
    return {
      name: createdFiliere.name,
     // id: createdFiliere.id,
      code: createdFiliere.code,
      departementId: createdFiliere.departementId,
    };
  }
}
