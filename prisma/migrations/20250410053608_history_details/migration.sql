-- AlterTable
ALTER TABLE "workout_history" ADD COLUMN     "visibility" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workout_place" TEXT;
