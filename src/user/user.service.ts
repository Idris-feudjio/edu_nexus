import { Injectable } from '@nestjs/common';
import { Role, User } from 'generated/prisma';
import { ExcelImportService } from 'src/common/storage/import.student.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
   
    constructor(private readonly prismaService: PrismaService,private excelImportService: ExcelImportService) {
        // Constructor logic if needed
    }

    getMe(email: string) {
        return this.prismaService.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true, 
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getAllUserByRole( role: "ADMIN" | "PEDAGOGIC" | "TEACHER" | "STUDENT") {
        return await this.prismaService.user.findMany({
            where: {
                role: role,
            },
            select: {
                id: true,
                email: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        }); 
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
