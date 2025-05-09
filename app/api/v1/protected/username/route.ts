export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';

export const GET = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;

    const params = req.nextUrl.searchParams;
    const username = params.get('username');

    const user = await prisma.profile.findFirst({
        where: {
            username: {
                equals: username!,
                mode: 'insensitive'
            },
            NOT: {
                id: userId
            }
        }
    });

    if (!user) {
        return apiResponse({
            message: 'Username available',
            data: username,
            success: true,
        });
    } else {
        return apiResponse({
            message: 'Username not available',
            data: null,
            success: false,
        });
    }
});
