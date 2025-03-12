export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";

export const POST = async (
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string }> }
) => {
    try {
        const userId = req.headers.get("x-user-id") as string //From middleware;

        const { templateId } = await params
        if (!templateId) return

        const body = await req.json();


        const template = await prisma.workoutTemplate.findFirst({
            where: {
                id: templateId,
                ownerId: userId
            }
        })

        if (!template) {
            return NextResponse.json({
                message: 'WorkoutTemplate not found',
                success: false,
            }, { status: 404 });
        }

        try {
            const exercice = await prisma.workoutTemplateExercise.create({
                data: body
            });

            return NextResponse.json({
                message: 'Successfully created workoutTemplateExercise',
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
}
