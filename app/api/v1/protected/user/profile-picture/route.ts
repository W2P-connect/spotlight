export const dynamic = 'force-dynamic'

import { apiResponse } from "@/utils/apiResponse";
import { withErrorHandler } from "@/utils/errorHandler";
import { createAdminClient, updateUserMetadata } from "@/utils/supabase/admin";
import { safeStringify } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: NextRequest) => {

    const userId = req.headers.get("x-user-id") as string //From middleware

    const supabase = await createAdminClient();

    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
        return apiResponse({
            message: "No file provided",
            success: false,
            data: null
        });
    }
    const fileName = (file as File).name;

    const { error } = await supabase.storage
        .from("profile.pictures")
        .upload(fileName, file, {
            upsert: true,
            cacheControl: '3600',
        })

    if (error) {
        return apiResponse({
            success: false,
            data: null,
            message: error.message,
            req: req,
            log: {
                message: "Failed to upload profile picture",
                metadata: {
                    error: safeStringify(error),
                },
            }
        });
    }

    const { data: publicUrlData } = supabase
        .storage
        .from("profile.pictures")
        .getPublicUrl(fileName);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
        return apiResponse({
            message: "Failed to get public url",
            success: false,
            data: null,
            status: 500,
            req: req,
            log: {
                message: "Failed to get public url",
                metadata: {
                    error: safeStringify(publicUrlData),
                },
            }
        });
    }

    const publicUrlWithBuster = `${publicUrl}?t=${Date.now()}`;
    const metadataUpdate = await updateUserMetadata(userId, {
        profil_picture_uri: publicUrlWithBuster,
    });

    if (!metadataUpdate.success) {
        apiResponse({
            success: false,
            message: metadataUpdate.error ?? "Failed to update user metadata",
            status: 500,
            req: req,
            log: {
                message: metadataUpdate.error ?? "Failed to update user metadata",
                metadata: metadataUpdate
            }
        });
    }

    const { error: profileUpdateError } = await supabase
        .from('profile')
        .update({
            profil_picture: publicUrlWithBuster
        })
        .eq('id', userId);

    if (profileUpdateError) {
        return apiResponse({
            message: 'User profile picure update failed in table',
            success: false,
            status: 500,
            req: req,
            log: {
                message: profileUpdateError.message,
                metadata: {
                    error: safeStringify(profileUpdateError),
                },
            }
        });
    }

    return apiResponse({
        message: "Profile picture uploaded successfully",
        success: true,
        data: {
            url: publicUrlWithBuster
        }
    });
})