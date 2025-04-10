export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { comment } from 'postcss';

const updateSchema = z.object({
    minReps: z.array(z.number().int().positive()),
    maxReps: z.array(z.number().int().nonnegative()),
    restTime: z.array(z.number().int().nonnegative()).optional(),
    order: z.number().int().nonnegative().default(1),
    supersetId: z.string().uuid().nullable().optional(),
    exerciseId: z.string().uuid().optional(),
    comment: z.string().optional(),
});

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string, exerciceId: string }> }
) => {
    try {

        const userId = req.headers.get("x-user-id") as string //From middleware;
        const { templateId, exerciceId } = await params;

        if (!exerciceId || !templateId) return

        const body = await req.json();
        const parsedBody = updateSchema.safeParse(body);

        console.log(parsedBody.data);

        if (!parsedBody.success) {
            console.log(parsedBody.error.format());
            return NextResponse.json({
                message: 'Invalid request body',
                errors: parsedBody.error.format(),
                success: false,
            }, { status: 400 });
        }
        try {
            const exercice = await prisma.workoutTemplateExercise.update({
                where: {
                    id: exerciceId,
                    workoutTemplate: {
                        ownerId: userId,
                        id: templateId
                    }
                },
                data: parsedBody.data
            });

            return NextResponse.json({
                message: 'Successfully updated workoutTemplateExercice',
                data: exercice,
                success: true,
            }, { status: 200 });

        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({
                    message: 'workoutTemplateExercise not found',
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

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string, exerciceId: string }> }
) => {
    try {
        const userId = req.headers.get("x-user-id") as string //From middleware;
        const { templateId, exerciceId } = await params;

        if (!exerciceId || !templateId) return

        const body = await req.json();

        try {
            const exercice = await prisma.workoutTemplateExercise.delete({
                where: {
                    id: exerciceId,
                    workoutTemplate: {
                        ownerId: userId,
                        id: templateId
                    }
                },
            });

            return NextResponse.json({
                message: 'Successfully updated workoutTemplateExercice',
                data: exercice,
                success: true,
            }, { status: 200 });

        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({
                    message: 'workoutTemplateExercise not found',
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