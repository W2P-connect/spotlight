export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateWorkoutHistorySchema } from '@/lib/zod/history';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';
import { removeUndefined, safeStringify } from '@/utils/utils';


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

  try {
    const workoutHistory = await prisma.workoutHistory.update({
      where: {
        id: historyId,
        ownerId: userId,
      },
      data: parsedBody.data,
    });

    return apiResponse({
      message: 'Successfully updated workout history',
      data: workoutHistory,
      success: true,
    });
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
    await prisma.workoutHistory.delete({
      where: {
        id: historyId,
        ownerId: userId,
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
