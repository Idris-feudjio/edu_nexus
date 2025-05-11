import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateDocumentDto {
  @ApiProperty({
    description: 'Nouveau titre du document',
    example: 'Programmation avancée',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Nouvelle description du document',
    example: 'Support mis à jour pour le module Programmation 101',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Nouveau département cible',
    example: 'Informatique',
    required: false,
  })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({
    description: 'Nouveau niveau cible',
    example: 'L2',
    required: false,
  })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiProperty({
    description: 'Nouvelle classe cible',
    example: 'Groupe B',
    required: false,
  })
  @IsString()
  @IsOptional()
  class?: string;

  @ApiProperty({
    description: 'ID de l\'auteur (pour vérification)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  authorId?: number;
}