import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";

export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ notificationId: string }> }
) => {
    const { notificationId } = await params;

    await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });

    return apiResponse({
        message: 'Notification marked as read',
        data: null,
        success: true,
    });
});
