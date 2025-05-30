import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import e from 'express';
import { BaseRepository, BaseService } from 'src/common/abstracts';
import { ExcelImportService } from 'src/common/storage/import.student.service';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { UserData } from './dto';
import { UserRepository } from './repository/user.repository';

 
@Injectable()
export class UserService extends BaseService<UserData> {
    repository: UserRepository; 
    constructor(
        private readonly prisma: PrismaService,
        private readonly excelImportService: ExcelImportService, 
        private readonly userRepository: UserRepository
    ) { 
        super(); 
        this.repository = userRepository; 
    }

    getMe(email: string) {
        return this.repository.getMe(email);
    }

    async getAllUserByRole( role: "ADMIN" | "PEDAGOGIC" | "TEACHER" | "STUDENT") {
        return await this.repository.getAllUserByRole(role); 
    }

    async insertStudentFromExcel(filePath: string): Promise<{ success: number; errors: any[] }> {
        this.excelImportService.importStudentsFromExcel(filePath)
        .then((result) => {
            console.log(`Importation réussie: ${result.success} étudiants importés.`);
            if (result.errors.length > 0) {
                console.error('Erreurs d\'importation:', result.errors);
            }
        })
        .catch((error) => {
            console.error('Erreur lors de l\'importation:', error);
        });
        return this.excelImportService.importStudentsFromExcel(filePath);
    }


}
