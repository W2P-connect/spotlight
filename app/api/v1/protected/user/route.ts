export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';

import { createAdminClient, updateUserMetadata } from '@/utils/supabase/admin';
import { isValidName, isValidUsername, userMetadataSchema } from '@/lib/zod/user';
import { apiResponse } from '@/utils/apiResponse';
import { getProfileById, updateProfileData } from '@/lib/profile';
import { withErrorHandler } from '@/utils/errorHandler';

export const PUT = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;
    const body = await req.json();

    const { firstName, lastName, username } = body;

    // Vérification basique des longueurs + caractères
    if (!isValidName(firstName) || !isValidName(lastName)) {
        return apiResponse({
            message: 'First name or last name is invalid.',
            success: false,
            status: 400,
            req: req,
            log: {
                message: 'First name or last name is invalid.',
                metadata: {
                    firstName,
                    lastName,
                },
            }
        });
    }

    if (!isValidUsername(username)) {
        return apiResponse({
            message: 'Invalid username. Must be 3-20 characters long and contain only letters, numbers, and underscores.',
            success: false,
            status: 400,
            req: req,
            log: {
                message: 'Invalid username. Must be 3-20 characters long and contain only letters, numbers, and underscores.',
                metadata: {
                    username,
                },
            }
        });
    }

    const parsedMetadata = body.metadata
        ? userMetadataSchema.safeParse(body.metadata)
        : null;

    if (parsedMetadata && !parsedMetadata.success) {
        return apiResponse({
            message: 'Invalid metadata in request body',
            error: parsedMetadata.error.message,
            success: false,
            status: 400,
            req: req,
            log: {
                message: 'Invalid metadata in request body',
                metadata: {
                    error: parsedMetadata.error.message,
                },
            }
        });
    }
    const profile = await getProfileById(userId);

    if (!profile) {
        return apiResponse({
            message: 'Profile not found',
            success: false,
            status: 404,
            req: req,
            log: {
                message: 'Profile not found',
                metadata: {
                    userId,
                },
            }
        });
    }

    if (profile.username !== username && profile.username && username) {
        return apiResponse({
            message: 'Username cannot be changed',
            success: false,
            status: 400,
            req: req,
            log: {
                message: 'Username cannot be changed',
                metadata: {
                    profileUsername: profile.username,
                    newUsername: username,
                },
            }
        });
    }

    const updatedProfile = await updateProfileData(userId, firstName ?? profile.firstName, lastName ?? profile.lastName, username ?? profile.username);

    if (parsedMetadata) {
        const responseUpdate = await updateUserMetadata(userId, parsedMetadata.data);

        if (!responseUpdate.success) {
            return apiResponse({
                message: 'Failed to update user metadata',
                success: false,
                status: 500,
                req: req,
                log: {
                    message: responseUpdate.error ?? 'Failed to update user metadata',
                    metadata: {
                        error: responseUpdate,
                    },
                }
            });
        }
    }
    return apiResponse({
        message: 'User updated successfully',
        data: updatedProfile,
        success: true,
    });
});

export const GET = withErrorHandler(async (req: NextRequest) => {
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
});
