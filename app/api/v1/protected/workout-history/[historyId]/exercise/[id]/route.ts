export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateWorkoutHistoryExerciseSchema } from '@/lib/zod/history';
import { apiResponse } from '@/utils/apiResponse';
import { removeUndefined, safeStringify } from '@/utils/utils';
import { withErrorHandler, logWarning } from '@/utils/errorHandler';
import { calculateAndStoreSetScores } from '@/lib/utils/oneRepMax';

export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string, historyId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;

    const { id, historyId } = await params;
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

    console.log(" => parsedBody.data", parsedBody.data);

    // Get current exercise data to check if nbReps or weight changed
    const currentExercise = await prisma.workoutHistoryExercise.findUnique({
        where: {
            id: id,
            workoutHistory: {
                id: historyId,
                ownerId: userId
            }
        },
    });

    if (!currentExercise) {
        return apiResponse({
            message: 'Workout history exercise not found',
            success: false,
            status: 404,
        });
    }

    const workoutHistoryExercise = await prisma.workoutHistoryExercise.update({
        where: {
            id: id,
            workoutHistory: {
                id: historyId,
                ownerId: userId
            }
        },
        data: parsedBody.data
    });

    await prisma.workoutHistory.update({
        where: {
            id: historyId,
            ownerId: userId
        },
        data: { updatedAt: new Date() },
    });

    // Process set scores if nbReps or weight were updated
    const nbRepsChanged = parsedBody.data.nbReps !== undefined;
    const weightChanged = parsedBody.data.weight !== undefined;
    
    if (nbRepsChanged || weightChanged) {
        try {
            const finalNbReps = parsedBody.data.nbReps ?? currentExercise.nbReps;
            const finalWeight = parsedBody.data.weight ?? currentExercise.weight;
            
            // Calculate and store all set scores (with PR flags)
            await calculateAndStoreSetScores(
                workoutHistoryExercise.id,
                historyId,
                workoutHistoryExercise.exerciseId,
                userId,
                finalNbReps,
                finalWeight,
                req.nextUrl.pathname
            );
        } catch (setScoreError: any) {
            // Log error but don't fail the request - set score processing is not critical
            await logWarning({
                message: 'Error processing set scores for exercise',
                endpoint: req.nextUrl.pathname,
                userId,
                level: 'error',
                metadata: {
                    workoutHistoryExerciseId: workoutHistoryExercise.id,
                    workoutHistoryId: historyId,
                    exerciseId: workoutHistoryExercise.exerciseId,
                    error: setScoreError?.message || String(setScoreError),
                    stackTrace: setScoreError?.stack,
                },
            });
        }
    }

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

    try {
        await prisma.workoutHistoryExercise.delete({
            where: {
                id: id,
                workoutHistory: {
                    ownerId: userId
                }
            },
        });

        await prisma.workoutHistory.update({
            where: {
                id: id,
                ownerId: userId
            },
            data: { updatedAt: new Date() },
        })

        return apiResponse({
            message: 'Successfully deleted workout history exercise',
            success: true,
        });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return apiResponse({
                message: 'Workout history exercise not found or does not belong to the user',
                success: true,
            });
        }
        throw error;
    }
});
