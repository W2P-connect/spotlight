/*
  Warnings:

  - Made the column `index` on table `workout_program` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "workout_program" ALTER COLUMN "index" SET NOT NULL;
