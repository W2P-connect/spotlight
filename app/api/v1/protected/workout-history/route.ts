export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = async (req: NextRequest) => {
    try {
        const userId = req.headers.get("x-user-id") as string;
        const searchParams = req.nextUrl.searchParams;

        // Récupération des filtres
        const workoutTemplateId = searchParams.get('workoutTemplateId');
        const workoutProgramId = searchParams.get('workoutProgramId');
        const sortOrder = searchParams.get('date') || 'newest'; // Par défaut "newest"

        console.log(searchParams);

        const whereClause: any = {
            ownerId: userId
        };
        if (workoutTemplateId) {
            whereClause.workoutTemplateId = workoutTemplateId;
        }
        if (workoutProgramId) {
            whereClause.workoutTemplate = {
                workoutPrograms: {
                    some: {
                        id: workoutProgramId
                    }
                }
            };
        }

        // Requête Prisma
        const workoutHistory = await prisma?.workoutHistory.findMany({
            where: whereClause,
            include: {
                workoutTemplate: {
                    include: {
                        workoutPrograms: {
                            include: {
                                workoutProgram: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                date: sortOrder === 'newest' ? 'desc' : 'asc'
            }
        });

        if (!workoutHistory) {
            return NextResponse.json({
                message: 'No Workout History found',
                data: [],
                success: false,
            }, { status: 404 });
        }

        const formattedWorkoutHistory = workoutHistory.map(history => ({
            ...history,
            workoutTemplate: history.workoutTemplate
                ? {
                    ...history.workoutTemplate,
                    workoutPrograms: history.workoutTemplate.workoutPrograms.map(wp => wp.workoutProgram)
                }
                : null
        }));

        // console.log(workoutHistory);

        return NextResponse.json({
            message: 'Successfully retrieved workout history',
            data: formattedWorkoutHistory,
            success: true,
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Failed to retrieve workout history',
            data: [],
            success: false,
        }, { status: 500 });
    }
};