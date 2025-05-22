export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import { Prisma } from '@prisma/client';
import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';
import { createWorkoutProgramShema } from '@/lib/zod/program';
import { removeUndefined, safeStringify } from '@/utils/utils';

export const GET = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;

    const searchParams = req.nextUrl.searchParams;
    const since = searchParams.get('since');

    const whereClause: any = {
        ownerId: userId
    };

    if (since) {
        whereClause.updatedAt = {
            gt: new Date(since)
        }
    }

    const workoutPrograms = await prisma.workoutProgram.findMany({
        where: whereClause,
    })

    if (!workoutPrograms) {
        return apiResponse({
            message: 'No Workout Programs found',
            data: [],
            success: false,
            status: 404
        });
    }

    console.log("workoutPrograms", workoutPrograms.length);


    return apiResponse({
        message: 'Successfully retrieved workout programs',
        data: workoutPrograms,
        success: true,
    });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string
    const body = await req.json();
    const parsedData = createWorkoutProgramShema.safeParse(body);

    if (!parsedData.success) {
        return apiResponse({
            message: 'Invalid request body',
            success: false,
            req: req,
            log: {
                message: 'Invalid request body',
                metadata: {
                    body,
                    error: parsedData.error.message,
                    parsedBodyData: removeUndefined(parsedData.data),
                    parsedBodyError: safeStringify(parsedData.error),
                },
            }
        });
    }

    const newWorkoutProgram = await prisma.workoutProgram.create({
        data: {
            ...parsedData.data,
            ownerId: userId
        }
    });

    return apiResponse({
        message: "Successfully created workout program",
        data: newWorkoutProgram,
        success: true,
        status: 201
    });
});
