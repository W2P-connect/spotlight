-- DropIndex
DROP INDEX IF EXISTS "workout_set_score_user_id_exercise_id_is_personal_record_idx";

-- AlterTable
ALTER TABLE "workout_set_score" DROP COLUMN IF EXISTS "is_personal_record";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "workout_set_score_user_id_exercise_id_idx" ON "workout_set_score"("user_id", "exercise_id");


