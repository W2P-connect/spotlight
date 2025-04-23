
import { toggleLike } from "@/lib/post/utils";
import { NextRequest, NextResponse } from "next/server";
import { apiResponse } from "@/utils/apiResponse";

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ historyId: string }> }
) => {
    const current_user_id = req.headers.get("x-user-id") as string;
    const { historyId } = await params;

    console.log("historyId", historyId);
    
    const result = await toggleLike(current_user_id, historyId);

    if (!result.success) {
        return apiResponse({
            message: result.message,
            error: result.error,
            success: false
        });
    }

    return apiResponse({
        message: `Post successfully ${result.message}`,
        success: true
    });
};
