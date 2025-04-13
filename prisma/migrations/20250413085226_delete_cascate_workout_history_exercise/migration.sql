-- DropForeignKey
ALTER TABLE "workout_history_exercise" DROP CONSTRAINT "workout_history_exercise_workoutHistoryId_fkey";

-- AddForeignKey
ALTER TABLE "workout_history_exercise" ADD CONSTRAINT "workout_history_exercise_workoutHistoryId_fkey" FOREIGN KEY ("workoutHistoryId") REFERENCES "workout_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
