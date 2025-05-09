export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import { workoutHistoryExerciseSchema, workoutHistorySchema } from '@/lib/zod/history';
import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';
import { safeStringify } from '@/utils/utils';
import { createAdminClient } from '@/utils/supabase/admin';


export const GET = (async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;
    const searchParams = req.nextUrl.searchParams;

    const since = searchParams.get('since');
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
    if (since) {
        whereClause.updatedAt = {
            gt: new Date(since)
        }
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

    const supabase = await createAdminClient();

    // 1. Validation
    const validatedWorkout = workoutHistorySchema.parse({ ...body, ownerId: userId });
    const validatedExercises = z.array(workoutHistoryExerciseSchema).parse(body.exercises || []);

    // console.log(" => validatedWorkout", validatedWorkout);
    // console.log(" => validatedExercises", validatedExercises);

    // 2. Transaction avec Supabase
    const { data: workout, error: workoutError } = await supabase
        .from('workout_history')
        .insert([validatedWorkout])
        .select()
        .single();

    if (workoutError) {
        console.error("Error creating workout:", workoutError);
        return apiResponse({
            message: "Failed to create workout",
            success: false,
            status: 500,
            log: {
                message: "Failed to create workout",
                metadata: {
                    body,
                    error: safeStringify(workoutError),
                },
            },
            req: req,
        });
    }

    const { error: exercisesError } = await supabase
        .from('workout_history_exercise')
        .insert(
            validatedExercises.map(({ workoutHistoryId, ...exercise }) => ({
                ...exercise,
                workoutHistoryId: workout.id,
            }))
        );

    if (exercisesError) {
        console.error("Error creating exercises:", exercisesError);
        return apiResponse({
            message: "Failed to create exercises",
            success: false,
            status: 500,
            log: {
                message: "Failed to create exercises",
                metadata: {
                    body,
                    error: safeStringify(exercisesError),
                },
            },
            req: req,
        });
    }

    return apiResponse({
        message: "Successfully created workout history with exercises",
        success: true,
        status: 201,
    });
});
