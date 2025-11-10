export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/utils/errorHandler";
import { workoutTemplateLinkSchema } from "@/lib/zod/template";
import { apiResponse } from "@/utils/apiResponse";
import { removeUndefined, safeStringify } from "@/utils/utils";

export const POST = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;

    const body = await req.json();
    const parsedData = workoutTemplateLinkSchema.safeParse(body);

    if (!parsedData.success) {
        console.error(parsedData.error);
        return apiResponse({
            message: 'Invalid request body',
            success: false,
            req: req,
            log: {
                message: 'Invalid request body',
                metadata: {
                    body,
                    error: parsedData.error.message,
                    parsedBodyData: removeUndefined(parsedData.data),
                    parsedBodyError: safeStringify(parsedData.error),
                },
            }
        });
    }
    
    const [program, template] = await prisma.$transaction([
        prisma.workoutProgram.findFirst({
            where: {
                id: parsedData.data.workoutProgramId,
                ownerId: userId
            }
        }),
        prisma.workoutTemplate.findFirst({
            where: {
                id: parsedData.data.workoutTemplateId,
                ownerId: userId
            }
        })
    ])

    if (!program || !template) {
        return apiResponse({
            message: "Not authorized",
            success: false,
        });
    }

    try {
        const newWorkoutTemplateLink = await prisma.workoutProgramWorkoutTemplate.create({
            data: parsedData.data,
        });

        return apiResponse({
            message: "Successfully created workout program template link",
            data: newWorkoutTemplateLink,
            success: true,
        });
    } catch (error: any) {
        console.error("Error creating workout program template link:", error);
        
        // Check if it's a unique constraint error (Prisma code P2002)
        const errorMsg = typeof error.message === 'string' ? error.message : String(error.message || '')
        const errorCode = error.code || ''
        
        const isUniqueError = 
            errorCode === 'P2002' ||
            errorMsg.toLowerCase().includes('duplicate key') ||
            errorMsg.toLowerCase().includes('unique constraint') ||
            errorMsg.toLowerCase().includes('unique violation')
        
        const errorMessage = errorMsg || 'Unknown error'
        
        console.log("Error creating workout program template link", error);

        return apiResponse({
            message: isUniqueError 
                ? `Workout program template link already exists (${errorMessage})`
                : `Failed to create workout program template link (${errorMessage})`,
            error: errorMessage,
            success: false,
            status: isUniqueError ? 409 : 500,
            req: req,
            log: {
                message: `Failed to create workout program template link: ${errorMessage}`,
                metadata: {
                    body,
                    parsedData: safeStringify(parsedData),
                    error: safeStringify(error),
                    errorCode: safeStringify(error.code),
                    errorMeta: safeStringify(error.meta),
                },
            }
        });
    }
});