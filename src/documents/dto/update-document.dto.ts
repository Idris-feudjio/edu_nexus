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

export class UploadFileDto {
  @ApiProperty({
    description: 'Nom du fichier',
    example: 'document.pdf',
    required: true,
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Type MIME du fichier',
    example: 'application/pdf',
    required: true,
  })
  @IsString()
  mimetype: string;

  @ApiProperty({
    description: 'Taille du fichier en octets',
    example: 102400,
    required: true,
  })
  @IsNumber()
  size: number;
}


export class DownloadFileDto {
  @ApiProperty({
    description: 'Nom du fichier à télécharger',
    example: 'document.pdf',
    required: true,
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Type MIME du fichier',
    example: 'application/pdf',
    required: true,
  })
  @IsString()
  mimetype: string;

  @ApiProperty({
    description: 'Contenu du fichier encodé en base64',
    example: 'JVBERi0xLjQKJcfs...',
    required: true,
  })
  @IsString()
  content: string;
}


export class UploadFileResponseDto {
  @ApiProperty({
    description: 'Message de confirmation de l\'upload',
    example: 'Fichier téléchargé avec succès',
    required: true,
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Nom du fichier téléchargé',
    example: 'document.pdf',
    required: true,
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Type MIME du fichier téléchargé',
    example: 'application/pdf',
    required: true,
  })
  @IsString()
  mimetype: string;

  @ApiProperty({
    description: 'Taille du fichier téléchargé en octets',
    example: 102400,
    required: true,
  })
  @IsNumber()
  size: number;
}