import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";

export const PUT = async (
    req: NextRequest,
    { params }: { params: { notificationId: string } }
) => {
    try {
        const { notificationId } = params;

        await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        return apiResponse({
            message: 'Notification marked as read',
            data: null,
            success: true,
        });

    } catch (err) {
        console.error("Error marking notification as read:", err);
        return apiResponse({
            message: 'Failed to mark notification as read',
            data: null,
            success: false,
            status: 500,
        });
    }
};
