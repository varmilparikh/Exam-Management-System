/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[microsoftId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "microsoftId" TEXT,
ALTER COLUMN "role" SET DEFAULT 'FACULTY';

-- CreateIndex
CREATE UNIQUE INDEX "employees_googleId_key" ON "employees"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_microsoftId_key" ON "employees"("microsoftId");

-- CreateIndex
CREATE INDEX "employees_role_idx" ON "employees"("role");
