export const dynamic = 'force-dynamic';

import { apiResponse } from '@/utils/apiResponse';
import { withErrorHandler } from '@/utils/errorHandler';
import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export const POST = withErrorHandler(async (req: NextRequest) => {
    const { email, password } = await req.json();

    // Validation des champs requis
    if (!email || !password) {
        return apiResponse({
            message: 'Email and password are required',
            success: false,
        });
    }

    const supabase = await createClient();

    // Connexion de l'utilisateur avec email et mot de passe
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return apiResponse({
            message: error.message ?? 'Sign-in failed',
            error: error.message,
            success: false,
            req: req,
            log: {
                message: error.message ?? 'Sign-in failed',
                internalError: error
            }
        });
    }

    return apiResponse({
        message: 'User signed in successfully.',
        data: {
            session: data.session,
            user: await supabase.auth.getUser(),
        },
        success: true,
    });
});