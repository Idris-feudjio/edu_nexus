import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateDocumentDto {
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
  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty({
    description: 'Département cible',
    example: 'Informatique',
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: 'Niveau cible',
    example: 'L1',
    required: false,
  })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiProperty({
    description: 'Classe cible',
    example: 'Groupe A',
    required: false,
  })
  @IsString()
  @IsOptional()
  class?: string;
}