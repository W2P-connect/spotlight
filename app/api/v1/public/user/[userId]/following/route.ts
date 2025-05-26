export const dynamic = 'force-dynamic';

import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) => {
    const { userId } = await params;

    const searchParams = req.nextUrl.searchParams
    const offset = parseInt(searchParams.get('offset') || '0');


    const following = await prisma?.follow.findMany({
        where: {
            followerId: userId,
        },
        include: {
            following: {
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
        message: 'Following retrieved successfully',
        data: following?.map(f => f.following) ?? [],
        success: true,
    });
});
