export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";

export const GET = async (req: NextRequest) => {
    try {
        const userId = req.headers.get("x-user-id") as string //From middleware;


        const whereClause: any = {
            ownerId: userId
        };

        const workoutPrograms = await prisma.workoutProgram.findMany({
            where: whereClause,
            include: {
                workoutTemplateLinks: {
                    orderBy: {
                        order: 'asc'
                    }
                },
                workoutHistory: true
            },
        })

        if (!workoutPrograms) {
            return NextResponse.json({
                message: 'No Workout Programs found',
                data: [],
                success: false,
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Successfully retrieved workout programs',
            data: workoutPrograms,
            success: true,
        }, { status: 200 });

    } catch (err: TypeError | any) {
        console.error(err);
        return NextResponse.json({
            message: err.message ?? 'Unknown Error',
            data: [],
            error: err,
            success: false,
        }, { status: 500 });
    }
};


export const POST = async (req: NextRequest) => {
    try {
        const workoutProgram = await req.json();
        const userId = req.headers.get("x-user-id") as string;

        const newWorkoutProgram = await prisma.workoutProgram.create({
            data: { ...workoutProgram, ownerId: userId },
        });

        return NextResponse.json({
            message: "Successfully created workout program",
            data: newWorkoutProgram,
            success: true,
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Failed to create workout program",
            data: [],
            success: false,
        }, { status: 500 });
    }
};
