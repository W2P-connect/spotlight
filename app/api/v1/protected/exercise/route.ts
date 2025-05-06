export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { exerciseSchema } from '@/lib/zod/exercise';
import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';

export const GET = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;

    const exercises = await prisma?.exercise.findMany({
        where: {
            OR: [
                { ownerId: userId },  // Exercices de l'utilisateur
                { isPublic: true }     // Exercices publics
            ]
        },
        include: {
            muscles: {
                include: {
                    muscleGroup: true
                }
            },
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return apiResponse({
        message: 'Successfully geted exercises',
        data: exercises,
        success: true,
    });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;
    const exercise = await req.json();

    const parsedExercise = exerciseSchema.safeParse({ ...exercise, ownerId: userId });

    if (!parsedExercise.success) {
        return apiResponse({
            message: 'Invalid request body',
            error: parsedExercise.error.message,
            success: false,
        });
    }
    const createdExercise = await prisma.exercise.create({
        data: parsedExercise.data
    });

    return NextResponse.json({
        message: 'Successfully created exercise',
        data: createdExercise,
        success: true,
    })

});