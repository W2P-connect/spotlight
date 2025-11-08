export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';
import { updateWorkoutTemplateSchema } from '@/lib/zod/template';

export const DELETE = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;

    const { templateId } = await params

    try {
        await prisma.workoutTemplate.update({
            where: {
                ownerId: userId,
                id: templateId
            },
            data: { deletedAt: new Date() }
        });

        await prisma.workoutProgramWorkoutTemplate.deleteMany({
            where: { workoutTemplateId: templateId }
        })
        
        return apiResponse({
            message: 'Successfully deleted workoutTemplate',
            data: [],
            success: true,
        });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return apiResponse({
                message: 'workoutTemplate not found',
                success: true,
            });
        }
        throw error;
    }
});

export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;

    const { templateId } = await params

    const body = await req.json();
    const parsedData = updateWorkoutTemplateSchema.safeParse(body);

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
        const updateData: { name?: string; archived?: boolean } = {};
        if (parsedData.data.name !== undefined) {
            updateData.name = parsedData.data.name;
        }
        if (parsedData.data.archived !== undefined) {
            updateData.archived = parsedData.data.archived;
        }

        await prisma.workoutTemplate.update({
            where: {
                ownerId: userId,
                id: templateId
            },
            data: updateData
        });

        return apiResponse({
            message: 'Successfully updated workoutTemplate',
            success: true,
        });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return apiResponse({
                message: 'workoutTemplate not found',
                success: false,
                status: 404,
                req: req,
                log: {
                    message: 'workoutTemplate not found',
                    metadata: {
                        templateId,
                        userId,
                    },
                }
            });
        }
        throw error;
    }
})
