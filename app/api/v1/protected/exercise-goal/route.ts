export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';
import { createExerciseGoalSchema } from '@/lib/zod/user';

export const POST = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;
    const body = await req.json();

    const parsedData = createExerciseGoalSchema.safeParse(body);

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
        // Check if exercise exists
        const exercise = await prisma.exercise.findUnique({
            where: { id: parsedData.data.exerciseId }
        });

        if (!exercise) {
            return apiResponse({
                message: 'Exercise not found',
                success: false,
                status: 404,
                req: req,
                log: {
                    message: 'Exercise not found',
                    metadata: {
                        exerciseId: parsedData.data.exerciseId,
                    },
                }
            });
        }

        // Create or update exercise goal (upsert because of unique constraint)
        const exerciseGoal = await prisma.exerciseGoal.upsert({
            where: {
                userId_exerciseId: {
                    userId,
                    exerciseId: parsedData.data.exerciseId,
                }
            },
            create: {
                userId,
                exerciseId: parsedData.data.exerciseId,
                targetKg: parsedData.data.targetKg,
            },
            update: {
                targetKg: parsedData.data.targetKg,
                updatedAt: new Date(),
            },
            include: {
                exercise: true,
            }
        });

        return apiResponse({
            message: 'Successfully created exercise goal',
            data: exerciseGoal,
            success: true,
        });

    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint violation - should not happen with upsert, but handle it anyway
            return apiResponse({
                message: 'Exercise goal already exists',
                success: false,
                status: 409,
                req: req,
                log: {
                    message: 'Exercise goal already exists',
                    metadata: {
                        userId,
                        exerciseId: parsedData.data.exerciseId,
                    },
                }
            });
        }
        throw error;
    }
});

