export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';

export const POST = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;

    const { templateId } = await params

    const body = await req.json();

    const template = await prisma.workoutTemplate.findFirst({
        where: {
            id: templateId,
            ownerId: userId
        }
    })

    if (!template) {
        return apiResponse({
            message: 'WorkoutTemplate not found',
            success: false,
            status: 404,
            req: req,
            log: {
                message: 'WorkoutTemplate not found',
                metadata: {
                    templateId,
                    userId
                }
            }
        });
    }

    //ZOD ? TODO
    const exercice = await prisma.workoutTemplateExercise.create({
        data: body
    });

    await prisma.workoutTemplate.update({
        where: {
            ownerId: userId,
            id: templateId
        },
        data: { updatedAt: new Date() }
    });

    return apiResponse({
        message: 'Successfully created workoutTemplateExercise',
        data: exercice,
        success: true,
    });
});
