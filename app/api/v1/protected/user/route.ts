export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';

import { createAdminClient, updateUserMetadata } from '@/utils/supabase/admin';
import { isValidName, isValidUsername, userMetadataSchema } from '@/lib/zod/user';
import { apiResponse } from '@/utils/apiResponse';
import { prisma } from '@/lib/prisma';
import { getProfileById, updateProfileData } from '@/lib/profile';

export const PUT = async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;
    const body = await req.json();

    const { firstName, lastName, username } = body;

    // Vérification basique des longueurs + caractères
    if (!isValidName(firstName) || !isValidName(lastName)) {
        return apiResponse({
            message: 'First name or last name is invalid.',
            success: false,
            status: 400
        });
    }

    if (!isValidUsername(username)) {
        return apiResponse({
            message: 'Invalid username. Must be 3-20 characters long and contain only letters, numbers, and underscores.',
            success: false,
            status: 400
        });
    }

    const parsedMetadata = userMetadataSchema.safeParse(body);
    if (!parsedMetadata.success) {
        return apiResponse({
            message: 'Invalid metadata in request body',
            error: parsedMetadata.error.message,
            success: false,
            status: 400
        });
    }

    try {
        const profile = await getProfileById(userId);

        if (!profile) {
            return apiResponse({
                message: 'Profile not found',
                success: false,
                status: 404
            });
        }

        if (profile.username !== username && profile.username) {
            return apiResponse({
                message: 'Username cannot be changed',
                success: false,
                status: 400
            });
        }

        const updatedProfile = await updateProfileData(userId, firstName, lastName, username);

        updateUserMetadata(userId, parsedMetadata.data);

        return apiResponse({
            message: 'User updated successfully',
            data: updatedProfile,
            success: true,
        });

    } catch (error: any) {
        console.error('Error updating user:', error);
        return apiResponse({
            message: 'An unexpected error occurred',
            error: error.message,
            success: false,
            status: 500
        });
    }
};

export const GET = async (req: NextRequest) => {
    const supabaseAdmin = createAdminClient();

    const user_id = req.headers.get("x-user-id") as string;
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
        return apiResponse({
            message: 'Query parameter "q" is required and must be at least 2 characters.',
            success: false,
        });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('profile')
            .select('id, display_name, profil_picture, first_name, last_name, username')
            .ilike('search_value', `%${query}%`)
            .limit(10);

        if (error) {
            return apiResponse({
                message: 'Failed to fetch users',
                error: error.message,
                success: false,
                status: 500
            });
        }

        return apiResponse({
            message: 'Users fetched successfully',
            data: data.filter((user) => user.id !== user_id),
            success: true,
        });

    } catch (error: any) {
        console.error('Error fetching users:', error);
        return apiResponse({
            message: 'An unexpected error occurred',
            error: error.message,
            success: false,
            status: 500
        });
    }
};
