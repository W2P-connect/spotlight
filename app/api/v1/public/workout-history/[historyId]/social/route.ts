export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';

export const GET = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ historyId: string }> }
) => {
    const { historyId } = await params;

    const history = await prisma.workoutHistory.findUnique({
        where: {
            id: historyId,
            isPublic: true,
        },
        select: {
            id: true,
            commentsCount: true,
            likesCount: true,
        }
    });


    if (!history) {
        return apiResponse({
            message: 'Workout history not found or is not public',
            success: false,
            status: 404,
        });
    }

    return apiResponse({
        message: 'Successfully finded socialData',
        data: history,
        success: true,
    });
});