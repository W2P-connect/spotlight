export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const { refresh_token } = await req.json();

        if (!refresh_token) {

            console.log('refresh_token', refresh_token);
            
            return NextResponse.json({
                message: 'Refresh token is required',
                data: {},
                success: false,
            }, { status: 400 });
        }

        const supabase = await createClient();

        // Rafraîchir la session utilisateur via le refresh_token
        const { data, error } = await supabase.auth.refreshSession({ refresh_token });

        if (error) {

            console.log("error", error);
            
            return NextResponse.json({
                message: error.message ?? 'Failed to refresh token',
                data: {},
                success: false,
            }, { status: 401 });
        }

        return NextResponse.json({
            message: 'Token refreshed successfully',
            data: data,
            success: true,
        }, { status: 200 });

    } catch (err) {
        console.error('Error during token refresh:', err);
        return NextResponse.json({
            message: 'Failed to refresh token',
            data: {},
            success: false,
        }, { status: 500 });
    }
};
