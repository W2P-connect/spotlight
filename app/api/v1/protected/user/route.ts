export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';

import { createAdminClient } from '@/utils/supabase/admin';
import { userMetadataSchema } from '@/lib/zod/user';


export const PUT = async (
    req: NextRequest,
) => {
    const userId = req.headers.get("x-user-id") as string;

    const body = await req.json();
    const parsed = userMetadataSchema.safeParse(body);

    if (!parsed.success) {
        console.log(parsed.error);

        return NextResponse.json(
            {
                message: 'Invalid request body',
                errors: parsed.error.format(),
                success: false,
            },
            { status: 400 }
        );
    }
    const supabaseAdmin = createAdminClient();
    try {
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: parsed.data,
        });

        if (error) {
            return NextResponse.json(
                {
                    message: 'Failed to update user metadata',
                    error: error.message,
                    success: false,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: 'User metadata updated successfully',
                data: data.user?.user_metadata,
                success: true,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error updating user metadata:', error);
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
