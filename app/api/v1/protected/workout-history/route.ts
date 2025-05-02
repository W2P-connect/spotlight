export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import { Prisma } from '@prisma/client';
import { workoutHistoryExerciseSchema, workoutHistorySchema } from '@/lib/zod/history';


export const GET = async (req: NextRequest) => {
    try {
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
            return NextResponse.json({
                message: 'No Workout History found',
                data: [],
                success: false,
            }, { status: 404 });
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

        return NextResponse.json({
            message: 'Successfully retrieved workout history',
            data: workoutHistory.map(workout => ({
                ...workout,
                owner
            })),
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

        console.log("--------> validatedWorkout", validatedWorkout);
        console.log("--------> validatedExercises", validatedExercises);


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

        return NextResponse.json({
            message: "Successfully created workout history",
            data: newWorkoutHistory,
            success: true,
        }, { status: 201 });

    } catch (error) {
        console.log("error", error);

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
