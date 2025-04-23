import { NextRequest } from "next/server";
import { apiResponse } from "@/utils/apiResponse";
import { toggleCommentLike } from "@/lib/post/utils";

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ commentId: string }> }
) => {
    const current_user_id = req.headers.get("x-user-id") as string;
    const { commentId } = await params;

    const result = await toggleCommentLike(current_user_id, commentId);

    if (!result.success) {
        return apiResponse({
            message: result.message,
            error: result.error,
            success: false
        });
    }

    return apiResponse({
        message: `Comment successfully ${result.message}`,
        success: true
    });
};
