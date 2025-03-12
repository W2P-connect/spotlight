export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
    order: z.number().nonnegative().optional(),
    nbReps: z.array(z.number().int().positive()).optional(),
    weight: z.array(z.number().positive()).optional(),
    restTime: z.array(z.number().int().nonnegative()).optional(),
    supersetId: z.string().uuid().nullable().optional(),
})
// .refine(data =>
//     (!data.nbReps || !data.weight || data.nbReps.length === data.weight.length),
//     { message: "nbReps et weight doivent avoir la même longueur", path: ["nbReps", "weight"] }
// );

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const userId = req.headers.get("x-user-id") as string //From middleware;

        const { id } = await params;
        if (!id) {
            return NextResponse.json({
                message: 'Missing required parameter: id',
                success: false,
            }, { status: 400 });
        }

        const body = await req.json();
        const parsedBody = updateSchema.safeParse(body);

        if (!parsedBody.success) {
            console.log(parsedBody.error.issues);

            return NextResponse.json({
                message: 'Invalid request body',
                errors: parsedBody.error.format(),
                success: false,
            }, { status: 400 });
        }
        try {
            const workoutHistoryExercise = await prisma.workoutHistoryExercise.update({
                where: {
                    id: id,
                    workoutHistory: {
                        ownerId: userId
                    }
                },
                data: parsedBody.data
            });

            return NextResponse.json({
                message: 'Successfully updated workout history exercise',
                data: workoutHistoryExercise,
                success: true,
            }, { status: 200 });

        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({
                    message: 'Workout exercise not found or does not belong to the user',
                    success: false,
                }, { status: 404 });
            }
            throw error;
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({
            message: 'An unexpected error occurred',
            success: false,
        }, { status: 500 });
    }
};
