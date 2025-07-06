import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { Role } from 'src/common/enums/role.enum';
import { PrismaService } from 'src/prisma/prisma.service';

export class ExcelImportService {
  constructor(private prisma: PrismaService) {}

  /**
   * Importe les étudiants depuis un fichier Excel
   * @param filePath Chemin vers le fichier Excel
   */
  async importStudentsFromExcel(
    filePath: string,
  ): Promise<{ success: number; errors: any[] }> {
    try {
      // Lire le fichier Excel
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet =
        workbook.Sheets[sheetName];

      // Convertir en JSON
      const data =
        xlsx.utils.sheet_to_json(worksheet);

      // Statistiques d'importation
      const result: {
        success: number;
        errors: { row: any; error: any }[];
      } = {
        success: 0,
        errors: [],
      };

      // Traiter chaque ligne
      for (const row of data) {
        try {
          // Mapper les données vers le format attendu par Prisma
          const studentData =
            this.mapRowToStudentData(row); 
          // transaction et éviter les doublons
           const createdStudents = await this.prisma.$transaction(
            async (prisma) => {
              const existingStudent = await prisma.user.findUnique({
                where: {
                  email: studentData.email,
                },
              });
              if (existingStudent) {
                throw new Error(
                  `L'étudiant avec l'email ${studentData.email} existe déjà.`,
                );
              }
              // Créer l'étudiant dans la base de données
              return await prisma.user.create({
                data: {
                  email: studentData.email,
                  firstName: studentData.firstName,
                  lastName: studentData.lastName,
                  role: studentData.role || 'STUDENT',
                  class: studentData.class || null,
                  department: studentData.department || null,
                  level: studentData.level || null,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              });
            }   
        )  
          console.log(
            'Étudiant créé avec succès:',
            createdStudents,
          );
          
          result.success++;
        } catch (error) {
          result.errors.push({
            row,
            error: error.message,
          });
        }
      }

      return result;
    } catch (error) {
      throw new Error(
        `Erreur lors de l'importation: ${error.message}`,
      );
    }
  }

  /**
   * Mappe une ligne Excel aux champs de l'étudiant
   * @param row Ligne Excel au format JSON
   */
   mapRowToStudentData(row: any) {
    // Conversion des noms de colonnes Excel vers les noms de champs dans la base de données
    // Ajustez les noms de colonnes selon votre fichier Excel
    return {
      email: this.getString(row['email']),
      firstName: this.getString(row['firstName'] || row['first_name'] || row['prénom']),
      lastName: this.getString(row['lastName'] || row['last_name'] || row['nom']),
      gender: this.getString(row['gender'] || row['sexe']),
      role: this.parseRole(row['role']),
      department: row['department'] || row['département'] || null,
      level: this.getString(row['level'] || row['niveau'] || null),
      class: this.getString(row['class'] || row['classe'] || null),
      matricule: this.getString(row['matricule']), 
    };
  }

  /**
   * Convertit une date sous la forme 2025-05-06T01:13:25.635Z
   */
  
  private convertDateToString(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Date invalide');
    }
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  /**
   * Convertit une valeur en chaîne de caractères
   */
  getString(value: any): string {
    if (value === undefined || value === null) {
      throw new Error('Valeur obligatoire manquante');
    }
    return String(value).trim();
  }

  /**
   * Parse le rôle depuis une chaîne de caractères
   */
  parseRole(roleStr: string): Role {
    if (!roleStr) {
      return 'STUDENT' as Role; // Valeur par défaut
    }
    
    const normalizedRole = roleStr.toUpperCase().trim();
    
    // Valider que le rôle existe dans l'enum Role
    // Ajustez selon vos valeurs d'enum Role définies dans Prisma
    if (['ADMIN', 'TEACHER', 'STUDENT'].includes(normalizedRole)) {
      return normalizedRole as Role;
    }
    
    return 'STUDENT' as Role; // Valeur par défaut si non reconnu
  }

  }