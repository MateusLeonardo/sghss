/*
  Warnings:

  - A unique constraint covering the columns `[accessCode]` on the table `attendants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "attendants" ADD COLUMN "accessCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "attendants_accessCode_key" ON "attendants"("accessCode");
