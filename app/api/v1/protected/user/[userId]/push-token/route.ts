import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) => {
    const { userId } = await params;
    const body = await req.json();
    const { token } = body;

    if (!token) {
        return apiResponse({
            message: "Missing push token",
            data: null,
            success: false
        });
    }

    const result = await prisma.pushToken.upsert({
        where: { token },
        update: { profileId: userId },
        create: { token, profileId: userId },
    });

    return apiResponse({
        message: `Push token saved successfully`,
        data: result,
        success: true,
    });
});
