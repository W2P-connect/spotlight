export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import getProfileData from '@/lib/profile';

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ historyId: string }> }
) => {

    try {
        const { historyId } = await params;


        const history = await prisma.workoutHistory.findUnique({
            where: {
                id: historyId,
                isPublic: true,
            },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                    },
                },
            }
        });


        if (!history) {
            return NextResponse.json({
                message: 'Workout history not found or is not public',
                success: false,
            }, { status: 404 });
        }

        const user = await getProfileData(history.ownerId);
        if (!user) {
            return NextResponse.json({
                message: "History's user not found or is deleted",
                success: false,
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Successfully finded history',
            data: {
                history: history,
                user: user,
            },
            success: true,
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Failed to get history',
            data: [],
            success: false,
        }, { status: 500 });
    }
};