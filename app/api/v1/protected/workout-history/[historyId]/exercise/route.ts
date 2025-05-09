export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { workoutHistoryExerciseSchema } from '@/lib/zod/history';
import { log } from 'console';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';

export const POST = withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const parsedBody = workoutHistoryExerciseSchema.parse(body);
    const userId = req.headers.get("x-user-id") as string;

    const workoutHistory = await prisma.workoutHistory.findUnique({
        where: {
            id: parsedBody.workoutHistoryId,
            ownerId: userId
        },
        select: { ownerId: true },
    });

    if (!workoutHistory) {
        return apiResponse({
            message: "Workout history not found",
            success: false,
            status: 404,
            req: req,
            log: {
                message: "Workout history not found",
                metadata: {
                    userId,
                    historyId: parsedBody.workoutHistoryId,
                },
            }
        });
    }

    const newWorkoutHistoryExercise = await prisma.workoutHistoryExercise.create({
        data: {
            ...parsedBody,
        }
    });

    return apiResponse({
        message: "Successfully created history exercise",
        data: newWorkoutHistoryExercise,
        success: true,
        status: 201
    });
});
