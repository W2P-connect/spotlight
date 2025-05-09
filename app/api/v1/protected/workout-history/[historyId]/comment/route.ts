import { NextRequest } from "next/server";
import { apiResponse } from "@/utils/apiResponse";
import { createComment, getComments } from "@/lib/post/utils";
import { withErrorHandler } from "@/utils/errorHandler";
import { removeUndefined, safeStringify } from "@/utils/utils";

export const POST = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ historyId: string }> }
) => {
    const current_user_id = req.headers.get("x-user-id") as string;
    const { historyId } = await params;

    const body = await req.json();
    const { content, parentId } = body;

    if (!content || content.trim() === "") {
        return apiResponse({
            message: "Comment content cannot be empty.",
            success: false,
            error: "EmptyContent"
        });
    }

    const result = await createComment(current_user_id, historyId, content, parentId);

    if (!result.success) {
        console.log(result);
        return apiResponse({
            message: result.message,
            error: result.error,
            success: false,
            req: req,
            log: {
                message: result.message ?? "Failed to create comment",
                metadata: {
                    result: safeStringify(result),
                },
            }
        });
    }

    return apiResponse({
        message: "Comment successfully posted.",
        data: result.data,
        success: true
    });
});

export const GET = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ historyId: string }> }
) => {
    const { historyId } = await params;

    const user_id = req.headers.get("x-user-id") as string;

    // Pagination (ex: ?limit=10&offset=0)
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await getComments(user_id, historyId, limit, offset);

    if (!result.success) {
        return apiResponse({
            message: result.message,
            error: result.error,
            success: false,
            req: req,
            log: {
                message: result.message ?? "Failed to fetch comments",
                metadata: {
                    result: safeStringify(result),
                },
            }
        });
    }

    return apiResponse({
        message: "Comments fetched successfully.",
        data: result.data,
        success: true
    });
});

