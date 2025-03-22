export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { workoutHistoryExerciseSchema } from '@/lib/zod/history';

export const POST = async (req: NextRequest) => {
    try {
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
            return NextResponse.json({
                message: "Workout history not found",
                success: false,
            }, { status: 404 });
        }

        const newWorkoutHistoryExercise = await prisma.workoutHistoryExercise.create({
            data: {
                ...parsedBody,
            }
        });

        return NextResponse.json({
            message: "Successfully created history exercise",
            data: newWorkoutHistoryExercise,
            success: true,
        }, { status: 201 });

    } catch (error) {
        console.error(error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                message: "Validation error",
                errors: error.errors,
                success: false,
            }, { status: 400 });
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({
                message: `Database error: ${error.message}`,
                success: false,
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Failed to create history exercise",
            success: false,
        }, { status: 500 });
    }
};
