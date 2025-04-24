import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ notificationId: string }> }
) => {
    try {
        const { notificationId } = await params;

        await prisma.notification.delete({
            where: { id: notificationId },
        });

        return apiResponse({
            message: 'Notification deleted successfully',
            data: null,
            success: true,
        });

    } catch (err) {
        console.error("Error deleting notification:", err);
        return apiResponse({
            message: 'Failed to delete notification',
            data: null,
            success: false,
            status: 500,
        });
    }
};
