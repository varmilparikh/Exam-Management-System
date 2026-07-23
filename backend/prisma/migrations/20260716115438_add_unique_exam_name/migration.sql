/*
  Warnings:

  - A unique constraint covering the columns `[examName]` on the table `exams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "exams_examName_key" ON "exams"("examName");
