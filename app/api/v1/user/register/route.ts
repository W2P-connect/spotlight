export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const { email, password, username } = await req.json()
        
        // Validation des champs requis
        if (!email || !password || !username) {
            return NextResponse.json({
                message: 'Email, password, and username are required',
                data: [],
                error: null,
                success: true,
            }, {
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
            return NextResponse.json({
                message: error.message ?? 'Signup failed',
                error: error.message,
                success: false,
            }, { status: 400 });
        }

        return NextResponse.json({
            message: 'User signed up successfully. Please check your email to confirm your account.',
            data: data.user,
            success: true,
        }, { status: 200 });

    } catch (err) {
        console.error('Error during signup:', err);
        return NextResponse.json({
            message: 'Failed to sign up user',
            success: false,
        }, { status: 500 });
    }
};
