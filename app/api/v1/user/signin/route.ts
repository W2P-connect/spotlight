export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();
        
        // Validation des champs requis
        if (!email || !password) {
            return NextResponse.json({
                message: 'Email and password are required',
                data: [],
                error: null,
                success: false,
            }, {
                status: 400
            });
        }

        const supabase = await createClient();

        // Connexion de l'utilisateur avec email et mot de passe
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return NextResponse.json({
                message: error.message ?? 'Sign-in failed',
                error: error.message,
                success: false,
            }, { status: 400 });
        }

        return NextResponse.json({
            message: 'User signed in successfully.',
            data: {
                session: data.session,
                user: await supabase.auth.getUser(),
            },
            success: true,
        }, { status: 200 });

    } catch (err) {
        console.error('Error during sign-in:', err);
        return NextResponse.json({
            message: 'Failed to sign in user',
            success: false,
        }, { status: 500 });
    }
};