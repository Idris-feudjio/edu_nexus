import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class RecordAnnouncementViewDto {
  @ApiProperty({
    description: 'ID du document consulté',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  documentId: number;

  @ApiProperty({
    description: 'ID de l\'utilisateur qui consulte',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Progression de lecture (entre 0 et 100)',
    example: 50,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;
}