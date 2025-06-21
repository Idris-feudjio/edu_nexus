import { Controller, Post, Body, UseGuards } from '@nestjs/common'; 
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';  
import { AbstractController, BaseService } from 'src/common/abstracts';  
import { FiliereService } from './filiere.service';
import { CreateFiliereDto, FiliereDto } from './dto';

 
@Controller('filiere')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FiliereController extends AbstractController<FiliereDto>  {
      protected service: FiliereService
    
      constructor(private readonly filiereService: FiliereService) { 
        super()
         this.service = filiereService
      }
    
     @Post('create')
      @Roles(Role.ADMIN)
      create(@Body() createDepartementDto: CreateFiliereDto) {
        return this.service.create(createDepartementDto);
      }

}
