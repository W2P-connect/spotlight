export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';

export const GET = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;
    const searchParams = req.nextUrl.searchParams;
    const since = searchParams.get('since');

    const whereClause: any = {
        userId,
    };

    if (since) {
        whereClause.updatedAt = {
            gt: new Date(since),
        };
    }

    const workoutSetScores = await prisma.workoutSetScore.findMany({
        where: whereClause,
        include: {
            workoutHistory: {
                select: {
                    id: true,
                    date: true,
                },
            },
            workoutHistoryExercise: {
                select: {
                    id: true,
                    exerciseId: true,
                },
            },
            exercise: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: [
            { workoutHistory: { date: 'desc' } },
            { setIndex: 'asc' },
        ],
    });

    console.log("workoutSetScores.length", workoutSetScores.length, since)

    return apiResponse({
        message: 'Successfully retrieved workout set scores',
        data: workoutSetScores,
        success: true,
    });
});


