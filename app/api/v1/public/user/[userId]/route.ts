export const dynamic = 'force-dynamic';

import getProfileData from '@/lib/profile';
import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) => {
    const { userId } = await params;

    const profileData = await getProfileData(userId, true);
    if (!profileData) {
        return apiResponse({
            message: 'Profile not found',
            data: [],
            success: false,
            status: 404,
        });
    }

    return apiResponse({
        message: 'Profile retrieved successfully',
        data: profileData,
        success: true,
    });
});
