import { toggleFollow } from "@/lib/profile";
import { createAdminClient } from "@/utils/supabase/admin";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) => {

    const current_user_id = req.headers.get("x-user-id") as string;
    const { userId } = await params;

    try {
        const result = await toggleFollow(current_user_id, userId);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: result.message,
                    data: null,
                    success: false,
                    error: result.error
                }, { status: 400 })
        }
        return NextResponse.json({
            message: `User successfully ${result.message}`,
            data: null,
            success: true,
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error following users', error);
        return NextResponse.json(
            {
                message: 'An unexpected error occurred',
                error: error.message,
                success: false,
            },
            { status: 500 }
        );
    }
};
