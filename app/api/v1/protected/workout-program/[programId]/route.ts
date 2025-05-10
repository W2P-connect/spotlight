export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';

//DELETE /api/v1/protected/workout-program/c06c9f81-efa4-4c8f-9879-a82de622858c 404

export const DELETE = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ programId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string

    const { programId } = await params

    try {
        await prisma.workoutProgram.delete({
            where: {
                id: programId,
                ownerId: userId,
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

    try {
        await prisma.workoutProgram.update({
            where: {
                ownerId: userId,
                id: programId
            },
            data: {
                name: body.name,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined
            }
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