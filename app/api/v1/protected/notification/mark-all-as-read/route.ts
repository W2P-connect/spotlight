import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";

export const PUT = async (req: NextRequest) => {
    try {
        const userId = req.headers.get("x-user-id") as string;

        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });

        return apiResponse({
            message: 'All notifications marked as read',
            data: null,
            success: true
        });

    } catch (err) {
        console.error("Error marking all notifications as read:", err);
        return apiResponse({
            message: 'Failed to mark all notifications as read',
            data: null,
            success: false,
            status: 500
        });
    }
};
