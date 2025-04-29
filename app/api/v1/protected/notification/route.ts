import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { log } from "console";

export const GET = async (req: NextRequest) => {
    try {
        const userId = req.headers.get("x-user-id") as string;

        const searchParams = req.nextUrl.searchParams
        const since = searchParams.get("since");

        const whereClause: any = { userId };

        if (since) {
            whereClause.createdAt = { gt: new Date(since) };
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

    } catch (err) {
        console.error("Error fetching notifications:", err);
        return apiResponse({
            message: 'Failed to fetch notifications',
            data: [],
            success: false,
            status: 500,
        });
    }
};
