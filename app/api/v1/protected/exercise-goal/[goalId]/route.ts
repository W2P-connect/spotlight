export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';
import { updateExerciseGoalSchema } from '@/lib/zod/user';

export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ goalId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string;
    const { goalId } = await params;

    if (!goalId) {
        return apiResponse({
            message: 'Missing required parameter: goalId',
            success: false,
            status: 400,
        });
    }

    const body = await req.json();
    const parsedData = updateExerciseGoalSchema.safeParse(body);

    if (!parsedData.success) {
        return apiResponse({
            message: 'Invalid request body',
            success: false,
            status: 400,
            req: req,
            log: {
                message: 'Invalid request body',
                metadata: {
                    body,
                    error: parsedData.error.message,
                },
            }
        });
    }

    try {
        const updateData: { targetKg?: number } = {};

        if (parsedData.data.targetKg !== undefined) {
            updateData.targetKg = parsedData.data.targetKg;
        }

        const exerciseGoal = await prisma.exerciseGoal.update({
            where: {
                id: goalId,
                userId: userId,
            },
            data: updateData,
            include: {
                exercise: true,
            }
        });

        return apiResponse({
            message: 'Successfully updated exercise goal',
            data: exerciseGoal,
            success: true,
        });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return apiResponse({
                message: 'Exercise goal not found',
                success: false,
                status: 404,
                req: req,
                log: {
                    message: 'Exercise goal not found',
                    metadata: {
                        userId,
                        goalId,
                    },
                }
            });
        }
        throw error;
    }
});

export const DELETE = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ goalId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string;
    const { goalId } = await params;

    try {
        await prisma.exerciseGoal.delete({
            where: {
                id: goalId,
                userId: userId,
            }
        });

        return apiResponse({
            message: 'Successfully deleted exercise goal',
            success: true,
        });

    } catch (error: any) {
        if (error.code === 'P2025') {
            // Entity doesn't exist anymore in database
            return apiResponse({
                message: 'Successfully deleted exercise goal',
                success: true,
            });
        }
        throw error;
    }
});

