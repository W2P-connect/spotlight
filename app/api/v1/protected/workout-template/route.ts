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

    try {
        const newWorkoutTemplate = await prisma.workoutTemplate.create({
            data: {
                ...parsedBody.data,
                ownerId: userId
            }
        })

        console.log("Successfully created workout template", newWorkoutTemplate.id);

        return apiResponse({
            message: 'Successfully created workout template',
            data: newWorkoutTemplate,
            success: true,
        });
    } catch (error: any) {
        console.error("Error creating workout template:", error);
        
        // Check if it's a unique constraint error (Prisma code P2002 or duplicate key)
        const errorMsg = typeof error.message === 'string' ? error.message : String(error.message || '')
        const errorCode = error.code || ''
        
        const isUniqueError = 
            errorCode === 'P2002' ||
            errorMsg.toLowerCase().includes('duplicate key') ||
            errorMsg.toLowerCase().includes('unique constraint') ||
            errorMsg.toLowerCase().includes('unique violation')
        
        const errorMessage = errorMsg || 'Unknown error'
        
        console.log("Error creating workout template", error);

        return apiResponse({
            message: isUniqueError 
                ? `Workout template already exists (${errorMessage})`
                : `Failed to create workout template (${errorMessage})`,
            error: errorMessage,
            success: false,
            status: isUniqueError ? 409 : 500,
            req: req,
            log: {
                message: `Failed to create workout template: ${errorMessage}`,
                metadata: {
                    body: parsedBody.data,
                    error: safeStringify(error),
                    errorCode: error.code,
                    errorMeta: error.meta,
                },
            }
        });
    }
}