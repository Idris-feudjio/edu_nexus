/*
  Warnings:

  - You are about to drop the column `fileType` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "fileType",
ADD COLUMN     "fileSource" TEXT;
