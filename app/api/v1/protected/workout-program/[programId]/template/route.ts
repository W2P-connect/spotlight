export const dynamic = 'force-dynamic';

import { z } from "zod";
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const POST = async (req: NextRequest) => {
    try {
        const workoutTemplateLinkSchema = z.object({
            id: z.string().uuid().optional(),
            workoutProgramId: z.string().uuid(),
            workoutTemplateId: z.string().uuid(),
            order: z.number().int().nonnegative().default(1),
            createdAt: z.coerce.date().optional(),
            updatedAt: z.coerce.date().optional(),
        });

        // Vérification du corps de la requête avec Zod
        const body = await req.json();
        const parsedData = workoutTemplateLinkSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json({
                message: 'Invalid request body',
                errors: parsedData.error.format(),
                success: false,
            }, { status: 400 });
        }

        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({
                message: "Missing 'x-user-id' header",
                success: false,
            }, { status: 400 });
        }

        const [program, template] = await Promise.all([
            await prisma.workoutProgram.findFirst({
                where: {
                    id: parsedData.data.workoutProgramId,
                    ownerId: userId
                }
            }),
            await prisma.workoutTemplate.findFirst({
                where: {
                    id: parsedData.data.workoutTemplateId,
                    ownerId: userId
                }
            })
        ])

        if (!program || !template) {
            return NextResponse.json({
                message: "Not authorized",
                errors: {},
                success: false,
            }, { status: 400 });
        }

        // Création du lien entre le programme et la séance
        const newWorkoutTemplateLink = await prisma.workoutProgramWorkoutTemplate.create({
            data: parsedData.data
        });

        return NextResponse.json({
            message: "Successfully created workout program",
            data: newWorkoutTemplateLink,
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
            message: "Failed to link template",
            success: false,
        }, { status: 500 });
    }
};