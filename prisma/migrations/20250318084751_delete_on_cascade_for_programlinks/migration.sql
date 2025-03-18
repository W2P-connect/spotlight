-- DropForeignKey
ALTER TABLE "workout_program_workout_template" DROP CONSTRAINT "workout_program_workout_template_workoutProgramId_fkey";

-- AddForeignKey
ALTER TABLE "workout_program_workout_template" ADD CONSTRAINT "workout_program_workout_template_workoutProgramId_fkey" FOREIGN KEY ("workoutProgramId") REFERENCES "workout_program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
