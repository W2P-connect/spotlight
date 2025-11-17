export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateWorkoutHistorySchema } from '@/lib/zod/history';
import { withErrorHandler, logWarning } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';
import { removeUndefined, safeStringify } from '@/utils/utils';
import { processWorkoutHistorySetScores } from '@/lib/utils/oneRepMax';


export const PUT = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ historyId: string }> }
) => {
  const userId = req.headers.get("x-user-id") as string;

  const { historyId } = await params;
  if (!historyId) {
    return apiResponse({
      message: 'Missing required parameter: id',
      success: false,
    });
  }

  const body = await req.json();
  const parsedBody = updateWorkoutHistorySchema.safeParse(body);

  if (!parsedBody.success) {
    return apiResponse({
      message: 'Invalid request body',
      success: false,
      req: req,
      log: {
        message: 'Invalid request body',
        metadata: {
          body,
          error: parsedBody.error.message,
          parsedBodyData: removeUndefined(parsedBody.data),
          parsedBodyError: safeStringify(parsedBody.error),
        },
      }
    });
  }
  console.log("parsedBody.data", parsedBody.data);

  try {
    const workoutHistory = await prisma.workoutHistory.update({
      where: {
        id: historyId,
        ownerId: userId,
      },
      data: parsedBody.data,
      include: {
        exercises: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // Process set scores calculation and storage for all exercises
    // Always recalculate scores after update to ensure they're up to date
    if (workoutHistory.exercises && workoutHistory.exercises.length > 0) {
      try {
        await processWorkoutHistorySetScores(
          workoutHistory.id,
          userId,
          workoutHistory.exercises.map((exercise) => ({
            id: exercise.id,
            exerciseId: exercise.exerciseId,
            nbReps: exercise.nbReps,
            weight: exercise.weight,
          })),
          req.nextUrl.pathname
        )
      } catch (setScoreError: any) {
        // Log error but don't fail the request - set score processing is not critical
        await logWarning({
          message: 'Error processing set scores for workout history update',
          endpoint: req.nextUrl.pathname,
          userId,
          level: 'error',
          metadata: {
            workoutHistoryId: workoutHistory.id,
            exercisesCount: workoutHistory.exercises.length,
            error: setScoreError?.message || String(setScoreError),
            stackTrace: setScoreError?.stack,
          },
        })
      }
    }

    return apiResponse({
      message: 'Successfully updated workout history',
      data: workoutHistory,
      success: true,
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return apiResponse({
        message: 'Workout history not found or does not belong to the user',
        success: false,
        status: 404,
        req: req,
        log: {
          message: 'Workout history not found or does not belong to the user',
          metadata: {
            userId,
            historyId,
          },
        }
      });
    }
    throw error;
  }
});

export const DELETE = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ historyId: string }> }
) => {
  const userId = req.headers.get("x-user-id") as string;

  const { historyId } = await params;

  try {
    await prisma.workoutHistory.update({
      where: {
        id: historyId,
        ownerId: userId,
      },
      data: {
        deletedAt: new Date()
      },
    });

    return apiResponse({
      message: 'Successfully deleted workout history',
      success: true,
    });

  } catch (error: any) {
    if (error.code === 'P2025') {
      return apiResponse({
        message: 'Workout history not found or does not belong to the user',
        success: true,
      });
    }
    throw error;
  }
});
