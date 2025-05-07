/*
  Warnings:

  - You are about to drop the column `commment` on the `workout_template_exercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workout_template_exercise" DROP COLUMN "commment",
ADD COLUMN     "comment" TEXT NOT NULL DEFAULT '';
