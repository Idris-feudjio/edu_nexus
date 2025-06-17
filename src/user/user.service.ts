import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import e from 'express';
import { BaseRepository, BaseService } from 'src/common/abstracts';
import { ExcelImportService } from 'src/common/storage/import.student.service';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { UserData } from './dto';
import { UserRepository } from './repository/user.repository';

import * as xlsx from 'xlsx';

 
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

    async activateOrDeactivateUser(
        id: number,
        isActive: boolean
    ): Promise<{ success: boolean; message: string }> {
        const user = await this.repository.update(id, { isActive });
        if (!user) {
            throw new BadRequestException('Utilisateur non trouvé');
        }
        return {
            success: true,
            message: `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`,
        };
    }

    async activateUser(id: number): Promise<{ success: boolean; message: string }> {
        return this.activateOrDeactivateUser(id, true);
    }
    async deactivateUser(id: number): Promise<{ success: boolean; message: string }> {
        return this.activateOrDeactivateUser(id, false);  

    }

    async isUserActive(id: number): Promise<boolean> {
      const user = await this.repository.findById(id);
      if (!user) {
        throw new BadRequestException('Utilisateur non trouvé');
      }
      return !!user.isActive;
    }


async importStudentsFromExcel(file: Express.Multer.File): Promise<{ success: boolean; count: number; students: any[] }> {
    if (!file?.buffer) {
        throw new BadRequestException('Fichier invalide');
     } 
     try { 
    const workbook = xlsx.read(file.buffer, {
      type: 'buffer',});
      const sheetName = workbook.SheetNames[0];
      const worksheet =
        workbook.Sheets[sheetName];
 
      const studentsData =
        xlsx.utils.sheet_to_json(worksheet);

    if (!studentsData || studentsData.length === 0) {
      throw new Error('Le fichier Excel est vide ou mal formaté.');
    } 
    const formattedStudents = studentsData.map((row: any) => {
      return {
      email: this.excelImportService.getString(row['email']),
      firstName:  this.excelImportService.getString(row['firstName'] || row['first_name'] || row['prénom']),
      lastName:  this.excelImportService.getString(row['lastName'] || row['last_name'] || row['nom']),
      gender:  this.excelImportService.getString(row['gender'] || row['sexe']),
      role:  this.excelImportService.parseRole(row['role']),
      department: row['department'] || row['département'] || null,
      level: this.excelImportService.getString(row['level'] || row['niveau'] || null),
      class: row['class'] || row['classe'] || null,
      matricule:  this.excelImportService.getString(row['matricule']),
      };
    });
 
      const createdStudents = await this.prisma.$transaction(
        formattedStudents.map(studentData => 
          this.prisma.user.create({
            data: {
                  email: studentData.email,
                  firstName: studentData.firstName,
                  lastName: studentData.lastName,
                  role: studentData.role || 'STUDENT',
                  class: studentData.class  ,
                  department: studentData.department || null,
                  level: studentData.level || null,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
            },
          })
        )
      );
      
      return {
        success: true,
        count: createdStudents.length,
        students: createdStudents,
      };
    } catch (error) { 
      throw new Error(`Erreur lors de l'importation: ${error.message}`);
    }
  }


}
