import { toggleFollow } from "@/lib/profile";
import { apiResponse } from "@/utils/apiResponse";
import { logWarning, withErrorHandler } from "@/utils/errorHandler";
import { createAdminClient } from "@/utils/supabase/admin";
import { removeUndefined } from "@/utils/utils";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) => {

    const current_user_id = req.headers.get("x-user-id") as string;
    const { userId } = await params;

    const result = await toggleFollow(current_user_id, userId);

    if (!result.success) {
        return apiResponse({
            message: result.message,
            data: { followed: result.followed },
            success: false,
            error: result.error,
            req: req,
            log: {
                message: result.message ?? "Failed to toggle folow user",
                metadata: {
                    result: removeUndefined(result),
                    userId_to_follow: userId,
                },
            }
        })
    }
    return apiResponse({
        message: `User successfully ${result.message}`,
        data: { followed: result.followed },
        success: true,
    });
});
