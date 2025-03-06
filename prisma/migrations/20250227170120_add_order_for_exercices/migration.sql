-- AlterTable
ALTER TABLE "workout_history_exercise" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "workout_template_exercise" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;
