import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";

export const PUT = withErrorHandler(async (req: NextRequest) => {
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
});
