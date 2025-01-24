export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {

    try {

        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split('Bearer ')[1] || null;

        if (!token) {
            return NextResponse.json({
                message: 'No token provided',
                data: [],
                success: false,
            }, {
                status: 401
            })
        }

        const supabase = await createClient();
        const user = await supabase.auth.getUser(token);

        if (user.error) {
            console.log(user.error);

            return NextResponse.json({
                message: 'User not authenticated',
                data: [],
                error: user.error,
                success: false,
            }, { status: 401 })
        }

        return NextResponse.json({
            message: 'User authenticated',
            data: user.data,
            error: user.error,
            success: true,
        }, { status: 200 })

    } catch (err) {

        console.log(err);
        return NextResponse.json({
            message: 'Failed to authenticate user',
            data: [],
            success: false,
        }, { status: 500 })
    }
}