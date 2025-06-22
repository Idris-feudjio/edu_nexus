-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_filiereId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "filiereId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_filiereId_fkey" FOREIGN KEY ("filiereId") REFERENCES "filiere"("id") ON DELETE SET NULL ON UPDATE CASCADE;
