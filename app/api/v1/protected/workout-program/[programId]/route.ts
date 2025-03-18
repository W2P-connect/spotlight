export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

//DELETE /api/v1/protected/workout-program/c06c9f81-efa4-4c8f-9879-a82de622858c 404

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ programId: string }> }
) => {

    try {
        const userId = req.headers.get("x-user-id") as string

        const { programId } = await params

        const deletedProgram = await prisma.workoutProgram.delete({
            where: {
                id: programId,
                ownerId: userId,
            }
        })

        if (deletedProgram) {
            return NextResponse.json({
                message: "Succesfully deleted",
                success: true,
                data: null,
            })
        } else {
            throw new Error("deletedProgram is not defined");
        }

    } catch (error: any) {
        console.error(error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({
                message: `Database error: ${error.message}`,
                success: false,
                data: error
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Failed to delete program",
            success: false,
            data: error
        }, { status: 500 });
    }
}