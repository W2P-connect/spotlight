export const dynamic = 'force-dynamic';

import getProfileData from '@/lib/profile';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) => {
    try {
        const { userId } = await params;

        const profileData = await getProfileData(userId);


        if (!profileData) {
            return NextResponse.json({
                message: 'Profile not found',
                data: [],
                success: false,
            }, { status: 404 });
        }

        //On ne concerve que certaines données car c'est public !! (ne surtout pas inclure le mail)
        const publicData = {
            id: profileData.id,
            profilPicture: profileData.profilPicture,
            fisrtName: profileData.firstName,
            lastName: profileData.lastName,
            username: profileData.username,
            following: profileData.following,
            followers: profileData.followers,
            followingCount: profileData.followingCount,
            followersCount: profileData.followersCount,
            posts: profileData.posts
        }

        return NextResponse.json({
            message: 'Profile retrieved successfully',
            data: publicData,
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
