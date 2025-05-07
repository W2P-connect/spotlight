import { createClient } from "@supabase/supabase-js";

export const createAdminClient = () =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

type UpdateUserMetadataResult = {
    success: boolean;
    error: string | null;
};

export const updateUserMetadata = async (
    userId: string,
    newMetadata: Record<string, any>
): Promise<UpdateUserMetadataResult> => {
    const supabase = await createAdminClient();

    const { data: userData, error: fetchError } = await supabase.auth.admin.getUserById(userId);

    if (fetchError || !userData?.user) {
        return {
            success: false,
            error: fetchError?.message || "Utilisateur introuvable",
        };
    }

    const existingMetadata = userData.user.user_metadata || {};

    const updatedMetadata = {
        ...existingMetadata,
        ...newMetadata,
    };

    const { error: updateError, data } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: updatedMetadata,
    });

    if (updateError) {
        return {
            success: false,
            error: updateError.message,
        };
    }

    return {
        success: true,
        error: null,
    };
};
