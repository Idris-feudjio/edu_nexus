/*
  Warnings:

  - You are about to drop the `StudentProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `filiereId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_filiereId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "filiereId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "StudentProfile";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_filiereId_fkey" FOREIGN KEY ("filiereId") REFERENCES "filiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
