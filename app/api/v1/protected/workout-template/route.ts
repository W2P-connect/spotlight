export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';
import { workoutTemplateSchema } from '@/lib/zod/template';
import { removeUndefined, safeStringify } from '@/utils/utils';

export const GET = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;
    const searchParams = req.nextUrl.searchParams;

    const since = searchParams.get('since');
    const workoutTemplateId = searchParams.get('workoutTemplateId');
    const workoutProgramId = searchParams.get('workoutProgramId');
    const sortOrder = searchParams.get('date') || 'newest';

    const whereClause: any = {
        ownerId: userId
    };
    if (workoutTemplateId) {
        whereClause.id = workoutTemplateId;
    }
    if (workoutProgramId) {
        whereClause.workoutPrograms = {
            some: {
                id: workoutProgramId
            }
        }
    }

    if (since) {
        whereClause.updatedAt = {
            gt: new Date(since)
        }
    }

    const workoutTemplates = await prisma?.workoutTemplate.findMany({
        where: whereClause,
        include: {
            exercises: {
                include: { exercise: true },
                orderBy: {
                    order: 'asc'
                }
            }
        },
        orderBy: {
            createdAt: sortOrder === 'newest' ? 'desc' : 'asc'
        }
    })

    if (!workoutTemplates) {
        return apiResponse({
            message: 'No Workout History found',
            data: [],
            success: false,
            status: 404
        });
    }

    console.log("workoutTemplates.length", workoutTemplates.length);

    return apiResponse({
        message: 'Successfully retrieved workout templates',
        data: workoutTemplates,
        success: true,
    });
});

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const userId = req.headers.get("x-user-id") as string //From middleware;

    const parsedBody = workoutTemplateSchema.safeParse(body);

    if (!parsedBody.success) {

        console.log("parsedBody.error", parsedBody.error);

        return apiResponse({
            message: 'Invalid request body',
            success: false,
            req: req,
            log: {
                message: 'Invalid request body',
                metadata: {
                    body,
                    error: parsedBody.error.message,
                    parsedBodyData: removeUndefined(parsedBody.data),
                    parsedBodyError: safeStringify(parsedBody.error),
                },
            }
        });
    }

    const newWorkoutTemplate = await prisma.workoutTemplate.create({
        data: {
            ...parsedBody.data,
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
                    body: parsedBody.data
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