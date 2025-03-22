export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import { Prisma, WorkoutHistoryExercise } from '@prisma/client';
import { workoutHistoryExerciseSchema } from '../history-exercise/route';

const workoutHistorySchema = z.object({
    date: z.string().datetime().optional(),
    ownerId: z.string().uuid(),
    workoutTemplateId: z.string().uuid().nullable().optional(),
    workoutProgramId: z.string().uuid().nullable().optional().or(z.literal("")),
    name: z.string().default("Séance libre"),
    comment: z.string().nullable().optional(),
}).strip();

export const GET = async (req: NextRequest) => {
    try {
        const userId = req.headers.get("x-user-id") as string;
        const searchParams = req.nextUrl.searchParams;

        // Récupération des filtres
        const workoutTemplateId = searchParams.get('workoutTemplateId');
        const workoutProgramId = searchParams.get('workoutProgramId');
        const sortOrder = searchParams.get('date') || 'newest'; // Par défaut "newest"

        console.log(searchParams);

        const whereClause: any = {
            ownerId: userId
        };
        if (workoutTemplateId) {
            whereClause.workoutTemplateId = workoutTemplateId;
        }
        if (workoutProgramId) {
            whereClause.workoutTemplate = {
                workoutPrograms: {
                    some: {
                        id: workoutProgramId
                    }
                }
            };
        }

        // Requête Prisma
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
            return NextResponse.json({
                message: 'No Workout History found',
                data: [],
                success: false,
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Successfully retrieved workout history',
            data: workoutHistory,
            success: true,
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Failed to retrieve workout history',
            data: [],
            success: false,
        }, { status: 500 });
    }
};


export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const userId = req.headers.get("x-user-id") as string;

        // Validation et nettoyage des données
        const validatedWorkout = workoutHistorySchema.parse({ ...body, ownerId: userId });

        const validatedExercises = z.array(workoutHistoryExerciseSchema).parse(body.exercises || []);

        console.log("--------> validatedExercises", validatedExercises);


        // Création du lien entre le programme et la séance
        const newWorkoutHistory = await prisma.workoutHistory.create({
            data: {
                ...validatedWorkout,
                exercises: {
                    create: validatedExercises.map(({workoutHistoryId, ...exercise}) => ({
                        ...exercise
                    }))
                }
            },
            include: {
                exercises: true
            }
        });

        return NextResponse.json({
            message: "Successfully created workout history",
            data: newWorkoutHistory,
            success: true,
        }, { status: 201 });

    } catch (error) {
        // console.error(error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                message: "Validation error",
                errors: error.format(),
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
            message: "Failed to create workout history",
            success: false,
        }, { status: 500 });
    }
};
