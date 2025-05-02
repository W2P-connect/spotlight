export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { exerciseSchema } from '@/lib/zod/exercise';
import { apiResponse } from '@/utils/apiResponse';

export const GET = async (req: NextRequest) => {
    try {
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

        return NextResponse.json({
            message: 'Successfully geted exercises',
            data: exercises,
            success: true,
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Failed to get exercises',
            data: [],
            success: false,
        }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
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
    } catch (error: any) {
        console.error(error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({
                message: `Database error: ${error.message}`,
                success: false,
                data: error
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Failed to create exercise",
            success: false,
            data: error
        }, { status: 500 });
    }
};