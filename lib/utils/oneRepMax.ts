import { prisma } from '@/lib/prisma';
import { logWarning } from '@/utils/errorHandler';

/**
 * Calculates estimated 1RM using Epley formula: weight * (1 + 0.0333 * reps)
 * 
 * @param weight - The weight lifted
 * @param reps - The number of reps
 * @returns The estimated 1RM rounded to 1 decimal place, or 0 if reps <= 0
 */
export function computeEpley1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  const score = weight * (1 + 0.0333 * reps);
  return Math.round(score * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculates and stores scores for all sets in a workout history exercise
 * Stores set scores (PRs are calculated dynamically)
 * 
 * @param workoutHistoryExerciseId - The ID of the workout history exercise
 * @param workoutHistoryId - The ID of the workout history
 * @param exerciseId - The ID of the exercise
 * @param userId - The ID of the user
 * @param nbReps - Array of number of reps for each set
 * @param weight - Array of weights for each set (must match nbReps length)
 * @param endpoint - Optional endpoint for logging (defaults to 'internal/utils/oneRepMax')
 */
export async function calculateAndStoreSetScores(
  workoutHistoryExerciseId: string,
  workoutHistoryId: string,
  exerciseId: string,
  userId: string,
  nbReps: number[],
  weight: number[],
  endpoint: string = 'internal/utils/oneRepMax'
): Promise<void> {
  // Validate arrays have same length
  if (nbReps.length !== weight.length) {
    await logWarning({
      message: 'Arrays length mismatch for set scores calculation',
      endpoint,
      userId,
      level: 'warning',
      metadata: {
        workoutHistoryExerciseId,
        workoutHistoryId,
        exerciseId,
        nbRepsLength: nbReps.length,
        weightLength: weight.length,
      },
    });
    return;
  }

  // Calculate scores for all sets
  const setScores: Array<{
    setIndex: number;
    score: number;
    weight: number;
    reps: number;
  }> = [];

  for (let i = 0; i < nbReps.length; i++) {
    if (nbReps[i] > 0 && weight[i] > 0) {
      const score = computeEpley1RM(weight[i], nbReps[i]);
      if (score > 0) {
        setScores.push({
          setIndex: i,
          score,
          weight: weight[i],
          reps: nbReps[i],
        });
      }
    }
  }

  // If no valid sets found, delete existing scores and return
  if (setScores.length === 0) {
    await prisma.workoutSetScore.deleteMany({
      where: {
        workoutHistoryExerciseId,
      },
    });
    return;
  }

  // Find the heaviest weight lifted in this workout exercise
  const heaviestWeightInWorkout = setScores.reduce((best, current) => 
    current.weight > best.weight ? current : best
  );

  // Get the current global PR (heaviest weight) for this exercise and user
  // Calculate PR dynamically from all scores (excluding current workout history)
  const allScoresForExercise = await prisma.workoutSetScore.findMany({
    where: {
      userId,
      exerciseId,
      // Exclude scores from this workout history (we're about to update them)
      workoutHistoryId: {
        not: workoutHistoryId,
      },
    },
  })

  // Find PR by weight (heaviest weight), if same weight then more reps wins
  const currentGlobalPR = allScoresForExercise.reduce(
    (best, current) => {
      if (current.weight > best.weight) {
        return current
      }
      if (current.weight === best.weight && current.reps > best.reps) {
        return current
      }
      return best
    },
    { weight: 0, reps: 0 } as { weight: number; reps: number; id?: string }
  )

  // Delete existing scores for this exercise in this workout history
  await prisma.workoutSetScore.deleteMany({
    where: {
      workoutHistoryExerciseId,
    },
  })

  // Store all set scores (PRs are calculated dynamically)
  await prisma.workoutSetScore.createMany({
    data: setScores.map((set) => ({
      workoutHistoryExerciseId,
      workoutHistoryId,
      exerciseId,
      userId,
      setIndex: set.setIndex,
      score: set.score,
      weight: set.weight,
      reps: set.reps,
    })),
  })
}

/**
 * Processes all exercises in a workout history to calculate and store set scores
 * Also marks personal records (best estimated 1RM per exercise)
 * 
 * @param workoutHistoryId - The ID of the workout history
 * @param userId - The ID of the user
 * @param exercises - Array of exercises from the workout history
 * @param endpoint - Optional endpoint for logging (defaults to 'internal/utils/oneRepMax')
 */
export async function processWorkoutHistorySetScores(
  workoutHistoryId: string,
  userId: string,
  exercises: Array<{
    id: string;
    exerciseId: string;
    nbReps: number[];
    weight: number[];
  }>,
  endpoint: string = 'internal/utils/oneRepMax'
): Promise<void> {
  // Process each exercise
  for (const exercise of exercises) {
    await calculateAndStoreSetScores(
      exercise.id,
      workoutHistoryId,
      exercise.exerciseId,
      userId,
      exercise.nbReps,
      exercise.weight,
      endpoint
    );
  }
}

