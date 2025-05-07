export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import { Prisma } from '@prisma/client';
import { workoutHistoryExerciseSchema, workoutHistorySchema } from '@/lib/zod/history';
import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';


export const GET = (async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;
    const searchParams = req.nextUrl.searchParams;

    // Récupération des filtres
    const workoutTemplateId = searchParams.get('workoutTemplateId');
    const workoutProgramId = searchParams.get('workoutProgramId');
    const onlyPublic = searchParams.get('onlyPublic');
    const sortOrder = searchParams.get('date') || 'newest'; // Par défaut "newest"

    const whereClause: any = {
        ownerId: userId
    };


    if (onlyPublic === 'true') {
        whereClause.isPublic = true;
    }
    if (workoutTemplateId) {
        whereClause.workoutTemplateId = workoutTemplateId;
    }
    if (workoutProgramId) {
        whereClause.workoutTemplate = {
            workoutProgramLinks: {
                some: {
                    workoutProgramId: workoutProgramId
                }
            }
        };
    }

    const workoutHistory = await prisma?.workoutHistory.findMany({
        where: whereClause,
        include: {
            exercises: {
                include: { exercise: true },
                orderBy: { order: 'asc' }
            },
        },
        orderBy: {
            date: sortOrder === 'newest' ? 'desc' : 'asc'
        }
    });

    if (!workoutHistory) {
        return apiResponse({
            message: 'No Workout History found',
            data: [],
            success: false,
        });
    }

    const owner = await prisma.profile.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            profilePicture: true,
            firstName: true,
            lastName: true,
            displayName: true,
        }
    });

    return apiResponse({
        message: 'Successfully retrieved workout history',
        data: workoutHistory.map(workout => ({
            ...workout,
            owner
        })),
        success: true,
    });

});



export const POST = withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const userId = req.headers.get("x-user-id") as string;

    // Validation et nettoyage des données
    const validatedWorkout = workoutHistorySchema.parse({ ...body, ownerId: userId });

    const validatedExercises = z.array(workoutHistoryExerciseSchema).parse(body.exercises || []);

    console.log("validatedWorkout, validatedExercises", { validatedWorkout, validatedExercises });

    // Création du lien entre le programme et la séance
    const newWorkoutHistory = await prisma.workoutHistory.create({
        data: {
            ...validatedWorkout,
            exercises: {
                create: validatedExercises.map(({ workoutHistoryId, ...exercise }) => {
                    return exercise;
                })
            }
        },
        include: {
            exercises: true
        }
    });

    return apiResponse({
        message: "Successfully created workout history",
        data: newWorkoutHistory,
        success: true,
        status: 201,
    });
});
