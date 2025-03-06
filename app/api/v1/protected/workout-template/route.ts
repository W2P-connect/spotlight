export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = async (req: NextRequest) => {
    try {
        const userId = req.headers.get("x-user-id") as string //From middleware;
        const searchParams = req.nextUrl.searchParams;

        const workoutTemplateId = searchParams.get('workoutTemplateId');
        const workoutProgramId = searchParams.get('workoutProgramId');
        const sortOrder = searchParams.get('date') || 'newest';

        const whereClause: any = {
            ownerId: userId
        };
        if (workoutTemplateId) {
            whereClause.id = workoutTemplateId;
        }
        if (workoutProgramId) {
            whereClause.workoutPrograms = {
                some: {
                    id: workoutProgramId
                }
            }
        }

        const workoutTemplates = await prisma?.workoutTemplate.findMany({
            where: whereClause,
            include: {
                workoutHistory: { include: { exercises: { include: { exercise: true } } } },
                workoutProgramLinks: { include: { workoutProgram: true } },
                exercises: { include: { exercise: true } }
            },
            orderBy: {
                createdAt: sortOrder === 'newest' ? 'desc' : 'asc'
            }
        })

        if (!workoutTemplates) {
            return NextResponse.json({
                message: 'No Workout History found',
                data: [],
                success: false,
            }, { status: 404 });
        }


        const formattedWorkoutTemplates = workoutTemplates.map(({ workoutProgramLinks, ...rest }) => ({
            ...rest,
            workoutPrograms: workoutProgramLinks.map(link => link.workoutProgram)
        }));

        return NextResponse.json({
            message: 'Successfully retrieved workout templates',
            data: formattedWorkoutTemplates,
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
