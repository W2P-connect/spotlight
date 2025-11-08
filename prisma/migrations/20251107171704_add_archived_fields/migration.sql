-- AlterTable
ALTER TABLE "workout_program" ADD COLUMN "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "workout_template" ADD COLUMN "archived" BOOLEAN NOT NULL DEFAULT false;

