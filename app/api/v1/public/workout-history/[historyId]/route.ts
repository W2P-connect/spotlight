export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import getProfileData from '@/lib/profile';
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
        include: {
            owner: {
                select: {
                    id: true,
                    username: true,
                    profilePicture: true,
                    firstName: true,
                    lastName: true,
                    displayName: true,
                }
            },
            exercises: {
                include: {
                    exercise: true,
                },
            },
        }
    });


    if (!history) {
        return apiResponse({
            message: 'Workout history not found or is not public',
            success: false,
            status: 404,
        });
    }

    // const user = await getProfileData(history.ownerId);
    // if (!user) {
    //     return apiResponse({
    //         message: "History's user not found or is deleted",
    //         success: false,
    //         status: 404
    //     });
    // } 
    if (!history.owner.id) {
        return apiResponse({
            message: "History's user not found or is deleted",
            success: false,
            status: 404
        });
    }

    return apiResponse({
        message: 'Successfully found history',
        data: {
            history: history,
            user: history.owner,
        },
        success: true,
    });
});