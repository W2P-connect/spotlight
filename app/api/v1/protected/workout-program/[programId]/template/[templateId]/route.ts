export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withErrorHandler } from '@/utils/errorHandler';
import { apiResponse } from '@/utils/apiResponse';
import { removeUndefined, safeStringify } from '@/utils/utils';

// Définition du schéma de validation avec Zod
const updateSchema = z.object({
    order: z.number().optional(),
});

export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ programId: string, templateId: string }> }
) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;
    const { programId, templateId } = await params;

    if (!programId || !templateId) {
        return apiResponse({
            message: 'Missing required parameters: templateId and/or programId',
            success: false,
        });
    }

    // Récupération et validation du corps de la requête
    const body = await req.json();
    const parsedBody = updateSchema.safeParse(body);

    if (!parsedBody.success) {
        return apiResponse({
            message: 'Invalid request body',
            success: false,
            req: req,
            log: {
                message: 'Invalid request body',
                metadata: {
                    body,
                    error: parsedBody.error.message,
                    parsedBodyData: removeUndefined(parsedBody.data),
                    parsedBodyError: safeStringify(parsedBody.error),
                },
            }
        });
    }

    // Mise à jour de la relation entre le programme et le template
    const existingRelation = await prisma.workoutProgramWorkoutTemplate.updateMany({
        where: {
            workoutProgramId: programId,
            workoutTemplateId: templateId,
            deletedAt: null
        },
        data: parsedBody.data
    });

    return apiResponse({
        message: 'Successfully updated template relation from program',
        data: existingRelation,
        success: true,
    });
});

export const DELETE = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ programId: string, templateId: string }> }
) => {
    // Vérification des paramètres
    const { programId, templateId } = await params;
    if (!programId || !templateId) {
        return apiResponse({
            message: 'Missing required parameters: templateId and/or programId',
            success: false,
        });
    }

    try {
        await prisma.workoutProgramWorkoutTemplate.updateMany({
            where: {
                workoutProgramId: programId,
                workoutTemplateId: templateId
            },
            data: {
                deletedAt: new Date()
            }
        });

        return apiResponse({
            message: 'Successfully removed template from program',
            success: true,
        });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return apiResponse({
                message: 'Program or template not found',
                success: true,
            });
        }
        throw error;
    }
});