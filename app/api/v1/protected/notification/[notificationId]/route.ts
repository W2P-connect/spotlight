import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";

export const DELETE = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ notificationId: string }> }
) => {
    const { notificationId } = await params;

    await prisma.notification.delete({
        where: { id: notificationId },
    });

    return apiResponse({
        message: 'Notification deleted successfully',
        data: null,
        success: true,
    });
})
