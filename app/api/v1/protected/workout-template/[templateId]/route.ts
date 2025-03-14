export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string }> }
) => {
    try {
        const userId = req.headers.get("x-user-id") as string //From middleware;

        const { templateId } = await params
        if (!templateId) return

        try {
            await prisma.workoutTemplate.delete({
                where: {
                    ownerId: userId,
                    id: templateId
                }
            });

            return NextResponse.json({
                message: 'Successfully deleted workoutTemplate',
                data: [],
                success: true,
            }, { status: 200 });

        } catch (error: any) {
            if (error.code === 'P2025') {
                return NextResponse.json({
                    message: 'workoutTemplate not found',
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
}
