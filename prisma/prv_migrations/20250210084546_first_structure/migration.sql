-- CreateTable
CREATE TABLE "workout_program" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "totalSessions" INTEGER,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "workout_program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_template" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "workout_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_history" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" UUID NOT NULL,
    "workoutTemplateId" UUID,

    CONSTRAINT "workout_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" UUID,

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_program_workout_template" (
    "id" UUID NOT NULL,
    "workoutProgramId" UUID NOT NULL,
    "workoutTemplateId" UUID NOT NULL,

    CONSTRAINT "workout_program_workout_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_history_exercise" (
    "id" UUID NOT NULL,
    "workoutHistoryId" UUID NOT NULL,
    "exerciseId" UUID NOT NULL,
    "nbReps" INTEGER[],
    "restTime" INTEGER,

    CONSTRAINT "workout_history_exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_template_exercise" (
    "id" UUID NOT NULL,
    "workoutTemplateId" UUID NOT NULL,
    "exerciseId" UUID NOT NULL,
    "minReps" INTEGER[],
    "maxReps" INTEGER[],
    "restTime" INTEGER,

    CONSTRAINT "workout_template_exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workout_program_workout_template_workoutProgramId_workoutTe_key" ON "workout_program_workout_template"("workoutProgramId", "workoutTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "workout_history_exercise_workoutHistoryId_exerciseId_key" ON "workout_history_exercise"("workoutHistoryId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "workout_template_exercise_workoutTemplateId_exerciseId_key" ON "workout_template_exercise"("workoutTemplateId", "exerciseId");

-- AddForeignKey
ALTER TABLE "workout_program" ADD CONSTRAINT "workout_program_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_template" ADD CONSTRAINT "workout_template_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_history" ADD CONSTRAINT "workout_history_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_history" ADD CONSTRAINT "workout_history_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "workout_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_program_workout_template" ADD CONSTRAINT "workout_program_workout_template_workoutProgramId_fkey" FOREIGN KEY ("workoutProgramId") REFERENCES "workout_program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_program_workout_template" ADD CONSTRAINT "workout_program_workout_template_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "workout_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_history_exercise" ADD CONSTRAINT "workout_history_exercise_workoutHistoryId_fkey" FOREIGN KEY ("workoutHistoryId") REFERENCES "workout_history"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_history_exercise" ADD CONSTRAINT "workout_history_exercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_template_exercise" ADD CONSTRAINT "workout_template_exercise_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "workout_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_template_exercise" ADD CONSTRAINT "workout_template_exercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
