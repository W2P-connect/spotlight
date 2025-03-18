export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Définition du schéma de validation avec Zod
const updateSchema = z.object({
    order: z.number().optional(),
});

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ programId: string, templateId: string }> }
) => {
    try {
        const userId = req.headers.get("x-user-id") as string //From middleware;
        const { programId, templateId } = await params;

        if (!programId || !templateId) {
            return NextResponse.json({
                message: 'Missing required parameters: templateId and/or programId',
                success: false,
            }, { status: 400 });
        }

        // Récupération et validation du corps de la requête
        const body = await req.json();
        const parsedBody = updateSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json({
                message: 'Invalid request body',
                errors: parsedBody.error.format(),
                success: false,
            }, { status: 400 });
        }

        console.log("NEWLINK", parsedBody.data);

        const program = await prisma.workoutProgram.findUnique({
            where: {
                id: programId,
                ownerId: userId,
            }
        });

        if (!program) {
            return NextResponse.json({
                message: 'Program not found or does not belong to the user',
                success: false,
            }, { status: 404 });
        }

        try {
            // Mise à jour de la relation entre le programme et le template
            const existingRelation = await prisma.workoutProgramWorkoutTemplate.update({
                where: {
                    workoutProgramId_workoutTemplateId: {
                        workoutProgramId: programId,
                        workoutTemplateId: templateId
                    }
                },
                data: parsedBody.data
            });

            return NextResponse.json({
                message: 'Successfully updated template relation from program',
                data: existingRelation,
                success: true,
            }, { status: 200 });

        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({
                    message: 'Relation between program and template not found',
                    success: false,
                }, { status: 404 });
            }
            throw error;
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({
            message: 'An unexpected error occurred',
            success: false,
        }, { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ programId: string, templateId: string }> }
) => {
    try {
        // Vérification de l'ID utilisateur
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({
                message: 'User ID is required in headers',
                success: false,
            }, { status: 401 });
        }

        // Vérification des paramètres
        const { programId, templateId } = await params;
        if (!programId || !templateId) {
            return NextResponse.json({
                message: 'Missing required parameters: templateId and/or programId',
                success: false,
            }, { status: 400 });
        }

        try {
            // Suppression de la relation entre le programme et le template
            await prisma.workoutProgramWorkoutTemplate.delete({
                where: {
                    workoutProgramId_workoutTemplateId: {
                        workoutProgramId: programId,
                        workoutTemplateId: templateId
                    }
                }
            });

            return NextResponse.json({
                message: 'Successfully removed template from program',
                success: true,
            }, { status: 200 });

        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({
                    message: 'Relation between program and template not found',
                    success: false,
                }, { status: 404 });
            }
            throw error;
        }

    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({
            message: 'An unexpected error occurred while deleting the template from the program',
            success: false,
        }, { status: 500 });
    }
};