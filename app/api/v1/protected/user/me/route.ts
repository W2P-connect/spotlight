export const dynamic = 'force-dynamic';

import getProfileData from '@/lib/profile';
import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';
import { NextResponse, NextRequest } from 'next/server';

export const GET = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;

    const profileData = await getProfileData(userId);

    if (!profileData) {
        return apiResponse({
            message: 'Profile not found',
            data: [],
            success: false,
            status: 404
        });
    }
    return apiResponse({
        message: 'Profile retrieved successfully',
        data: profileData,
        success: true,
    });
});
