import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { log } from "console";
import { withErrorHandler } from "@/utils/errorHandler";

export const GET = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;

    const searchParams = req.nextUrl.searchParams
    const since = searchParams.get("since");

    const whereClause: any = { userId };

    if (since) {
        whereClause.updatedAt = { gt: new Date(since) };
    }

    const notifications = await prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
    });

    return apiResponse({
        message: 'Successfully fetched notifications',
        data: notifications,
        success: true,
    });
});
