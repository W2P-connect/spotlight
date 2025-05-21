import { NextRequest } from "next/server";
import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";
import { prisma } from "@/lib/prisma";
import { cleanComment } from "@/utils/utils";

export const PUT = withErrorHandler(async (
    req: NextRequest,
    { params }: { params: Promise<{ commentId: string }> }
) => {
    const current_user_id = req.headers.get("x-user-id") as string;
    const { commentId } = await params;

    const body = await req.json();
    const { content } = body;

    const cleanContent = cleanComment(content);

    if (!cleanContent || cleanContent.trim() === "") {
        return apiResponse({
            message: "Invalid comment content.",
            success: false,
            error: "InvalidContent"
        });
    }

    const comment = await prisma.comment.update({
        where: {
            id: commentId,
            userId: current_user_id
        },
        data: { content: cleanContent }
    });

    if (!comment) {
        return apiResponse({
            message: "Comment not found.",
            success: false,
            error: "CommentNotFound"
        });
    }

    return apiResponse({
        message: `Comment successfully updated`,
        data: comment,
        success: true
    });
});
