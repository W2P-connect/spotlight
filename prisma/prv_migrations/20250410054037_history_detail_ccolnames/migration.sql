/*
  Warnings:

  - You are about to drop the column `visibility` on the `workout_history` table. All the data in the column will be lost.
  - You are about to drop the column `workout_place` on the `workout_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workout_history" DROP COLUMN "visibility",
DROP COLUMN "workout_place",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workoutPlace" TEXT;
