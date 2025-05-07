/*
  Warnings:

  - The `restTime` column on the `workout_history_exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `restTime` column on the `workout_template_exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "workout_history_exercise" DROP COLUMN "restTime",
ADD COLUMN     "restTime" INTEGER[];

-- AlterTable
ALTER TABLE "workout_template_exercise" DROP COLUMN "restTime",
ADD COLUMN     "restTime" INTEGER[];
