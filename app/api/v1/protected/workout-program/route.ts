export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import { Prisma } from '@prisma/client';

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
        const workoutTemplateLinkSchema = z.object({
            id: z.string().uuid().optional(),
            createdAt: z.coerce.date().optional(),
            updatedAt: z.coerce.date().optional(),
            ownerId: z.string().uuid(),
            name: z.string(),
        });

        // Vérification du corps de la requête avec Zod
        const body = await req.json();
        const parsedData = workoutTemplateLinkSchema.safeParse(body);

        if (!parsedData.success) {
            console.log(parsedData.error);
            return NextResponse.json({
                message: 'Invalid request body',
                errors: parsedData.error.format(),
                success: false,
            }, { status: 400 });
        }

        const userId = req.headers.get("x-user-id") as string;

        if(userId !== parsedData.data.ownerId) {
            return NextResponse.json({
                message: "Wrong user-id header",
                success: false,
            }, { status: 401 });
        }

        const newWorkoutProgram = await prisma.workoutProgram.create({
            data: parsedData.data
        });

        return NextResponse.json({
            message: "Successfully created workout program",
            data: newWorkoutProgram,
            success: true,
        }, { status: 201 });

    } catch (error) {
        console.error(error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({
                message: `Database error: ${error.message}`,
                success: false,
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Failed to create workout program",
            success: false,
        }, { status: 500 });
    }
};
