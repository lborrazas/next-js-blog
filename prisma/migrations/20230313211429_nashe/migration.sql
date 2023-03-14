/*
  Warnings:

  - Added the required column `blockId` to the `Parcela` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parcela" ADD COLUMN     "blockId" INTEGER NOT NULL;
