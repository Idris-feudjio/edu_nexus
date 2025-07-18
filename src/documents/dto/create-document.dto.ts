import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Document, User  } from '@prisma/client';
import { FiliereSummaryDto } from 'src/filiere/dto';
import {  DepartementSummaryDto } from 'src/department/dto';
import {  SimpleUserProfileSummary } from 'src/user/dto';
 
// If you need a Document model, use composition or type aliasing instead of class inheritance
export interface AnnouncementsModel extends Document{}; 

export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'Titre du document',
    example: 'Introduction à la programmation',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description du document',
    example: 'Support de cours pour le module Programmation 101',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID de l\'auteur du document',
    example: 1,
  })
 // @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty({
    description: 'Niveau cible',
    example: 'L1',
    required: false,
  })
  @IsString()
  @IsOptional()
  level: string;

  @ApiProperty({
    description: 'Classe cible',
    example: 'Groupe A',
    required: false,
  })
  @IsString()
  @IsOptional()
  class?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  fileKey?: string;

  @IsString()
  @IsOptional()
  fileSource?:string;// 'COURSES'|'PROFILES'|'SCHEDULES';


  @IsOptional()
  filiereId?:number

  @IsOptional()
  departementId?:number
}

export class DocumentSummaryDto {
    id: number;
    title: string;
    description: string | null;
    fileUrl: string | null;
    filiereId?:number
    fileSource?:string;
    author: SimpleUserProfileSummary;
    departement?: DepartementSummaryDto;
    filiere?:FiliereSummaryDto;
    level?: string;
    class?: string | null;
    createdAt: Date; 
}