-- CreateTable: workout_set_score
-- Unified table for storing all set scores and personal records
CREATE TABLE "workout_set_score" (
    "id" UUID NOT NULL,
    "workout_history_id" UUID NOT NULL,
    "workout_history_exercise_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "set_index" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "reps" DOUBLE PRECISION NOT NULL,
    "is_personal_record" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_set_score_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueConstraint
CREATE UNIQUE INDEX "workout_set_score_workout_history_exercise_id_set_index_key" ON "workout_set_score"("workout_history_exercise_id", "set_index");

-- CreateIndex: Optimized for finding personal records per user/exercise
CREATE INDEX "workout_set_score_user_id_exercise_id_is_personal_record_idx" ON "workout_set_score"("user_id", "exercise_id", "is_personal_record");

-- CreateIndex: For querying by workout history
CREATE INDEX "workout_set_score_workout_history_id_idx" ON "workout_set_score"("workout_history_id");

-- CreateIndex: For querying by exercise in history
CREATE INDEX "workout_set_score_workout_history_exercise_id_idx" ON "workout_set_score"("workout_history_exercise_id");

-- AddForeignKey
ALTER TABLE "workout_set_score" ADD CONSTRAINT "workout_set_score_workout_history_id_fkey" FOREIGN KEY ("workout_history_id") REFERENCES "workout_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_set_score" ADD CONSTRAINT "workout_set_score_workout_history_exercise_id_fkey" FOREIGN KEY ("workout_history_exercise_id") REFERENCES "workout_history_exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_set_score" ADD CONSTRAINT "workout_set_score_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_set_score" ADD CONSTRAINT "workout_set_score_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;



