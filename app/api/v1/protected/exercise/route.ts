export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = async (req: NextRequest) => {
    try {
        const userId = req.headers.get("x-user-id") as string;

        const exercises = await prisma?.exercise.findMany({
            where: {
                ownerId: userId || null
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            message: 'Successfully geted exercises',
            data: exercises,
            success: true,
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Failed to get exercises',
            data: [],
            success: false,
        }, { status: 500 });
    }
};