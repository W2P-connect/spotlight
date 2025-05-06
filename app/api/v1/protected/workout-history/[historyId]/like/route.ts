
import { toggleLike } from "@/lib/post/utils";
import { NextRequest, NextResponse } from "next/server";
import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";

export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ historyId: string }> }
) => {
    const current_user_id = req.headers.get("x-user-id") as string;
    const { historyId } = await params;

    const result = await toggleLike(current_user_id, historyId);

    if (!result.success) {
        return apiResponse({
            message: result.message,
            error: result.error,
            success: false,
            req: req,
            log: {
                message: result.message ?? "Failed to toggle like",
                metadata: {
                    result,
                },
            }
        });
    }

    return apiResponse({
        message: `Post successfully ${result.message}`,
        success: true
    });
});
