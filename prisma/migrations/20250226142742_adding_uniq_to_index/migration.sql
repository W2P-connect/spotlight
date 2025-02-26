/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `workout_program` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "workout_program" ALTER COLUMN "index" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workout_program_index_key" ON "workout_program"("index");
