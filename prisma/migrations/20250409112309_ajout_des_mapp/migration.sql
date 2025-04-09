/*
  Warnings:

  - You are about to drop the `Muscle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MuscleGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Muscle" DROP CONSTRAINT "Muscle_muscleGroupId_fkey";

-- DropForeignKey
ALTER TABLE "_ExerciseToMuscle" DROP CONSTRAINT "_ExerciseToMuscle_B_fkey";

-- DropTable
DROP TABLE "Muscle";

-- DropTable
DROP TABLE "MuscleGroup";

-- CreateTable
CREATE TABLE "muscle" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroupId" UUID NOT NULL,

    CONSTRAINT "muscle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscle_group" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "muscle_group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "muscle" ADD CONSTRAINT "muscle_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "muscle_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToMuscle" ADD CONSTRAINT "_ExerciseToMuscle_B_fkey" FOREIGN KEY ("B") REFERENCES "muscle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
