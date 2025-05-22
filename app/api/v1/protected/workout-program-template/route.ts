export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';

export const GET = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;
    const searchParams = req.nextUrl.searchParams;

    const since = searchParams.get('since');

    const whereClause: any = {};

    if (since) {
        whereClause.updatedAt = {
            gt: new Date(since)
        }
    }

    const workoutTemplatesPrograms = await prisma?.workoutProgramWorkoutTemplate.findMany({
        where: {
            ...whereClause,
            workoutProgram: {
                ownerId: userId,
            },
            workoutTemplate: {
                ownerId: userId,
            },
        },
    })

    if (!workoutTemplatesPrograms) {
        return apiResponse({
            message: 'No workoutTemplatesPrograms found',
            data: [],
            success: false,
            status: 404
        });
    }

    return apiResponse({
        message: 'Successfully retrieved workoutTemplatesPrograms',
        data: workoutTemplatesPrograms,
        success: true,
    });
});

export const POST = async (req: NextRequest) => {
    const workoutTemplate = await req.json();
    const userId = req.headers.get("x-user-id") as string //From middleware;

    const newWorkoutTemplate = await prisma.workoutTemplate.create({
        data: {
            ...workoutTemplate,
            ownerId: userId
        }
    })

    if (!newWorkoutTemplate) {
        return apiResponse({
            message: 'Failed to create workout template',
            success: false,
            req: req,
            log: {
                message: 'Failed to create workout template',
                metadata: {
                    body: workoutTemplate
                },
            }
        });
    }

    return apiResponse({
        message: 'Successfully created workout template',
        data: newWorkoutTemplate,
        success: true,
    });
}