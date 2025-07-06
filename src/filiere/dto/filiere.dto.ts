import {
  IsString,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { DepartementSummaryDto } from 'src/department/dto';
import { PartialType } from '@nestjs/swagger';

export class FiliereDto {
  id?: number;
  name: string;
  code: string; 
  departementId: number;
}

export class CreateFiliereDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @IsNotEmpty()
  departementId: number;
}

export class FiliereSummaryDto  extends PartialType(FiliereDto){
  department:DepartementSummaryDto
}
