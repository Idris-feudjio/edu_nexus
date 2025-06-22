import {
  IsString,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

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
