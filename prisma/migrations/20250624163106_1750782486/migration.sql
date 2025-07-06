/*
  Warnings:

  - You are about to drop the column `department` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "department",
ADD COLUMN     "departementId" INTEGER,
ADD COLUMN     "filiereId" INTEGER;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_filiereId_fkey" FOREIGN KEY ("filiereId") REFERENCES "filiere"("id") ON DELETE SET NULL ON UPDATE CASCADE;
