export const dynamic = 'force-dynamic';

import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';
import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export const POST = withErrorHandler(async (req: NextRequest) => {
    const { email, password, username } = await req.json()

    // Validation des champs requis
    if (!email || !password || !username) {
        return apiResponse({
            message: 'Email, password, and username are required',
            success: false,
            status: 400
        });
    }

    const supabase = await createClient();

    // Inscription de l'utilisateur avec email et mot de passe
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });

    if (error) {
        return apiResponse({
            message: error.message ?? 'Signup failed',
            error: error.message,
            success: false,
            req: req,
            log: {
                message: error.message ?? 'Signup failed',
                internalError: error,
            }
        });
    }

    return apiResponse({
        message: 'User signed up successfully. Please check your email to confirm your account.',
        data: data.user,
        success: true,
    });
});
