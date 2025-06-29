import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateDepartementDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
  @IsOptional()
  @IsString()
  createdAt: Date;

  @IsOptional()
  @IsString()
  updatedAt: Date;
}

export class DepartementDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class DepartementSummaryDto extends PartialType(
  DepartementDto,
) {
  createdAt?: string;
}
