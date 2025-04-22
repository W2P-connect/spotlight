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

        const { first_name, last_name, username } = parsed.data;

        const display_name = `${first_name ?? ''} ${last_name ?? ''} ${username ? `(${username})` : ''}`.trim();
        const search_value = `${first_name ?? ''} ${last_name ?? ''} ${username ?? ''}`.toLowerCase().trim();

        const { error: profileUpdateError } = await supabaseAdmin
            .from('profile')
            .update({
                display_name,
                search_value,
                first_name,
                last_name,
                username
            })
            .eq('id', userId);

        if (profileUpdateError) {
            return NextResponse.json(
                {
                    message: 'User metadata updated but failed to update values in profile table',
                    error: profileUpdateError.message,
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

export const GET = async (req: NextRequest) => {
    const supabaseAdmin = createAdminClient();

    const user_id = req.headers.get("x-user-id") as string;
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
        return NextResponse.json(
            {
                message: 'Query parameter "q" is required and must be at least 2 characters.',
                success: false,
            },
            { status: 400 }
        );
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('profile')
            .select('id, display_name, profil_picture') 
            .ilike('search_value', `%${query}%`)
            .limit(10);

        if (error) {
            return NextResponse.json(
                {
                    message: 'Failed to fetch users',
                    error: error.message,
                    success: false,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: 'Users fetched successfully',
                data,
                // data: data.filter((user) => user.id !== user_id),
                success: true,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error fetching users:', error);
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
