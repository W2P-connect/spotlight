export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';

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
            workoutHistory: { include: { exercises: { include: { exercise: true } } } },
            workoutProgramLinks: { include: { workoutProgram: true } },
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

    const formattedWorkoutTemplates = workoutTemplates.map(({ workoutProgramLinks, ...rest }) => ({
        ...rest,
        workoutPrograms: workoutProgramLinks.map(link => link.workoutProgram)
    }));

    return apiResponse({
        message: 'Successfully retrieved workout templates',
        data: formattedWorkoutTemplates,
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