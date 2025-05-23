import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";
import { NextRequest } from "next/server";

export const PUT = withErrorHandler(async (
    req: NextRequest,
) => {
    const userId = req.headers.get("x-user-id") as string //From middleware;
    const body = await req.json();
    const { token } = body;

    if (!token) {
        console.log("Missing push token");
        return apiResponse({
            message: "Missing push token",
            data: null,
            success: false
        });
    }

    await prisma.pushToken.update({
        where: { token, profileId: userId },
        data: { profileId: null },
    });

    return apiResponse({
        message: `Push token updated successfully`,
        success: true,
    });
});
