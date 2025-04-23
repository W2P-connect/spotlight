export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateWorkoutHistorySchema } from '@/lib/zod/history';


export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ historyId: string }> }
) => {
  try {
    const userId = req.headers.get("x-user-id") as string;

    const { historyId } = await params;
    if (!historyId) {
      return NextResponse.json({
        message: 'Missing required parameter: id',
        success: false,
      }, { status: 400 });
    }

    const body = await req.json();
    const parsedBody = updateWorkoutHistorySchema.safeParse(body);

    if (!parsedBody.success) {
      console.log(parsedBody.error.issues);
      return NextResponse.json({
        message: 'Invalid request body',
        errors: parsedBody.error.format(),
        success: false,
      }, { status: 400 });
    }

    try {
      const workoutHistory = await prisma.workoutHistory.update({
        where: {
          id: historyId,
          ownerId: userId,
        },
        data: parsedBody.data,
      });

      return NextResponse.json({
        message: 'Successfully updated workout history',
        data: workoutHistory,
        success: true,
      }, { status: 200 });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return NextResponse.json({
          message: 'Workout history not found or does not belong to the user',
          success: false,
        }, { status: 404 });
      }
      throw error;
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      message: 'An unexpected error occurred',
      success: false,
    }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ historyId: string }> }
) => {
  try {
    const userId = req.headers.get("x-user-id") as string;

    const { historyId } = await params;

    try {
      const deleted = await prisma.workoutHistory.delete({
        where: {
          id: historyId,
          ownerId: userId,
        },
      });

      if (!deleted) {
        return NextResponse.json({
          message: 'Workout history not found or does not belong to the user',
          success: false,
        }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Successfully deleted workout history',
        success: true,
      }, { status: 200 });

    } catch (error: any) {
      console.error('Prisma error:', error);
      return NextResponse.json({
        message: 'Failed to delete workout history',
        success: false,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      message: 'An unexpected error occurred',
      success: false,
    }, { status: 500 });
  }
};
