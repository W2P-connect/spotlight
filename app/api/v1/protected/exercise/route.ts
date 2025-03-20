export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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

export const POST = async (req: NextRequest) => {
    try {
        const userId = req.headers.get("x-user-id") as string;
        const exercise = await req.json();

        const createdExercise = await prisma.exercise.create({
            data: {
                ...exercise,
                ownerId: userId
            }
        });

        return NextResponse.json({
            message: 'Successfully created exercise',
            data: createdExercise,
            success: true,
        })
    } catch (error: any) {
        console.error(error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({
                message: `Database error: ${error.message}`,
                success: false,
                data: error
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Failed to create exercise",
            success: false,
            data: error
        }, { status: 500 });
    }
};