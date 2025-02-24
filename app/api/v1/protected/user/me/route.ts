export const dynamic = 'force-dynamic';

import getProfileData from '@/lib/profile';
import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {
        const userId = req.headers.get("x-user-id") as string //From middleware;

        const profileData = await getProfileData(userId);
        
        if (!profileData) {
            return NextResponse.json({
                message: 'Profile not found',
                data: [],
                success: false,
            }, { status: 404 });
        }
        return NextResponse.json({
            message: 'Profile retrieved successfully',
            data: profileData,
            success: true,
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            message: 'Failed to retrieve profile data',
            data: [],
            success: false,
        }, { status: 500 });
    }
};
