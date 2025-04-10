export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateWorkoutHistorySchema = z.object({
    name: z.string().min(1).optional(),
    comment: z.string().nullable().optional(),
    workoutTemplateId: z.string().uuid().nullable().optional(),
    workoutProgramId: z.string().uuid().nullable().optional(),
});

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ hsitoryId: string }> }
) => {
    try {
        const userId = req.headers.get("x-user-id") as string;

        const { hsitoryId } = await params;
        if (!hsitoryId) {
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
                    id: hsitoryId,
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
    { params }: { params: Promise<{ hsitoryId: string }> }
  ) => {
    try {
      const userId = req.headers.get("x-user-id") as string;
  
      const { hsitoryId } = await params;
  
      try {
        const deleted = await prisma.workoutHistory.deleteMany({
          where: {
            id: hsitoryId,
            ownerId: userId,
          },
        });
  
        if (deleted.count === 0) {
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
  