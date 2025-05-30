export const dynamic = 'force-dynamic';

import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) => {
    const { userId } = await params;

    const searchParams = req.nextUrl.searchParams
    const offset = parseInt(searchParams.get('offset') || '0');

    const followers = await prisma?.follow.findMany({
        where: {
            followingId: userId,
        },
        include: {
            follower: {
                select: {
                    id: true,
                    profilePicture: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    displayName: true,
                }
            }
        },
        skip: offset,
        take: 10
    })

    return apiResponse({
        message: 'Followers retrieved successfully',
        data: followers?.map(f => f.follower) ?? [],
        success: true,
    });
});
