export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';
import { updateWorkoutProgramSchema } from '@/lib/zod/program';

//DELETE /api/v1/protected/workout-program/c06c9f81-efa4-4c8f-9879-a82de622858c 404

export const DELETE = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ programId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string

    const { programId } = await params

    try {
        await prisma.workoutProgram.update({
            where: {
                id: programId,
                ownerId: userId,
            },
            data: {
                deletedAt: new Date()
            }
        })

        await prisma.workoutProgramWorkoutTemplate.updateMany({
            where: { workoutProgramId: programId },
            data: {
                deletedAt: new Date()
            }
        })


        return apiResponse({
            message: "Succesfully deleted",
            success: true,
        })

    } catch (error: any) {
        if (error.code === 'P2025') {
            //L'entité n'existe déjà plsu dans la bdd
            return apiResponse({
                message: "Succesfully deleted",
                success: true,
            })
        }
        throw error
    }
});

export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ programId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string;

    const { programId } = await params;
    if (!programId) {
        return apiResponse({
            message: 'Missing required parameter: programId',
            success: false,
        });
    };

    const body = await req.json();
    const parsedData = updateWorkoutProgramSchema.safeParse(body);

    if (!parsedData.success) {
        return apiResponse({
            message: 'Invalid request body',
            success: false,
            req: req,
            log: {
                message: 'Invalid request body',
                metadata: {
                    body,
                    error: parsedData.error.message,
                },
            }
        });
    }

    try {
        const updateData: {
            name?: string;
            startDate?: Date | null;
            endDate?: Date | null;
            archived?: boolean;
        } = {};

        if (parsedData.data.name !== undefined) {
            updateData.name = parsedData.data.name;
        }
        if (parsedData.data.startDate !== undefined) {
            updateData.startDate = parsedData.data.startDate ? new Date(parsedData.data.startDate) : null;
        }
        if (parsedData.data.endDate !== undefined) {
            updateData.endDate = parsedData.data.endDate ? new Date(parsedData.data.endDate) : null;
        }
        if (parsedData.data.archived !== undefined) {
            updateData.archived = parsedData.data.archived;
        }

        await prisma.workoutProgram.update({
            where: {
                ownerId: userId,
                id: programId
            },
            data: updateData
        });

        return apiResponse({
            message: 'Successfully updated workout program',
            data: [],
            success: true,
        });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return apiResponse({
                message: 'Workout program not found',
                success: false,
                status: 404,
                req: req,
                log: {
                    message: 'Workout program not found',
                    metadata: {
                        userId,
                        programId,
                    },
                }
            });
        }
        throw error;
    }
});