import { Controller, Post, Body, UseGuards } from '@nestjs/common'; 
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';
import { CreateDepartementDto, DepartementDto } from './dto';
import { DepartmentService } from './department.service';
import { AbstractController } from 'src/common/abstracts'; 

@Controller('departements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartementsController extends AbstractController<DepartementDto>  {
  service: DepartmentService

  constructor(private readonly departementsService: DepartmentService) { 
    super()
     this.service = departementsService
  }

 @Post('create')
  @Roles(Role.ADMIN)
  create(@Body() createDepartementDto: CreateDepartementDto) {
    console.log(createDepartementDto);
    
    return this.service.create(createDepartementDto);
  }
}
