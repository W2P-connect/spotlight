-- DropForeignKey
ALTER TABLE "workout_program_workout_template" DROP CONSTRAINT "workout_program_workout_template_workoutTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "workout_template_exercise" DROP CONSTRAINT "workout_template_exercise_workoutTemplateId_fkey";

-- AddForeignKey
ALTER TABLE "workout_program_workout_template" ADD CONSTRAINT "workout_program_workout_template_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "workout_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_template_exercise" ADD CONSTRAINT "workout_template_exercise_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "workout_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
