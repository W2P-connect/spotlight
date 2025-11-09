export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';
import { safeStringify } from '@/utils/utils';

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

    try {
        const newWorkoutTemplate = await prisma.workoutTemplate.create({
            data: {
                ...workoutTemplate,
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
                    body: workoutTemplate,
                    error: safeStringify(error),
                    errorCode: error.code,
                    errorMeta: error.meta,
                },
            }
        });
    }
}