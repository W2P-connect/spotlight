export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { updateWorkoutHistoryExerciseSchema } from '@/lib/zod/history';
import { apiResponse } from '@/utils/apiResponse';
import { removeUndefined, safeStringify } from '@/utils/utils';
import { withErrorHandler } from '@/utils/errorHandler';



export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;

    const { id } = await params;
    if (!id) {
        return apiResponse({
            message: 'Missing required parameter: id',
            success: false,
        });
    }

    const body = await req.json();
    const parsedBody = updateWorkoutHistoryExerciseSchema.safeParse(body);

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
    const workoutHistoryExercise = await prisma.workoutHistoryExercise.update({
        where: {
            id: id,
            workoutHistory: {
                ownerId: userId
            }
        },
        data: parsedBody.data
    });

    return apiResponse({
        message: 'Successfully updated workout history exercise',
        data: workoutHistoryExercise,
        success: true,
    });
});

export const DELETE = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string; // From middleware

    const { id } = await params;
    if (!id) {
        return apiResponse({
            message: 'Missing required parameter: id',
            success: false,
        });
    }
    const deleted = await prisma.workoutHistoryExercise.delete({
        where: {
            id: id,
            workoutHistory: {
                ownerId: userId
            }
        },
    });

    return apiResponse({
        message: 'Successfully deleted workout history exercise',
        data: deleted,
        success: true,
    });
});
