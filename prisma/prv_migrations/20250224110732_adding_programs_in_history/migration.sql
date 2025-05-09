-- AlterTable
ALTER TABLE "workout_history" ADD COLUMN     "workoutProgramId" UUID;

-- AddForeignKey
ALTER TABLE "workout_history" ADD CONSTRAINT "workout_history_workoutProgramId_fkey" FOREIGN KEY ("workoutProgramId") REFERENCES "workout_program"("id") ON DELETE SET NULL ON UPDATE CASCADE;
