export const dynamic = 'force-dynamic'

import { createAdminClient, updateUserMetadata } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {

    const userId = req.headers.get("x-user-id") as string //From middleware

    const supabase = await createAdminClient();

    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
        return NextResponse.json({
            message: "No file provided",
            success: false,
            data: null
        }, { status: 400 });
    }
    const fileName = (file as File).name;

    const { error } = await supabase.storage
        .from("profile.pictures")
        .upload(fileName, file, {
            upsert: true,
            cacheControl: '3600',
        })

    if (error) {
        return NextResponse.json({
            success: false,
            data: null,
            message: error.message
        }, { status: 500 });
    }

    const { data: publicUrlData } = supabase
        .storage
        .from("profile.pictures")
        .getPublicUrl(fileName);

    const publicUrl = publicUrlData?.publicUrl;
    const publicUrlWithBuster = `${publicUrl}?t=${Date.now()}`;

    if (!publicUrl) {
        return NextResponse.json({
            message: "Failed to get public url",
            success: false,
            data: null
        }, { status: 500 });
    }

    const metadataUpdate = await updateUserMetadata(userId, {
        profil_picture_uri: publicUrlWithBuster,
    });

    if (!metadataUpdate.success) {
        return NextResponse.json({
            success: false,
            message: metadataUpdate.error,
        }, { status: 500 });
    }

    const { error: profileUpdateError } = await supabase
        .from('profile')
        .update({
            profil_picture: publicUrlWithBuster
        })
        .eq('id', userId);

    if (profileUpdateError) {
        return NextResponse.json(
            {
                message: 'User profile picure update failed in table',
                error: profileUpdateError.message,
                success: false,
            },
            { status: 500 }
        );
    }



    return NextResponse.json({
        message: "Profile picture uploaded successfully",
        success: true,
        data: {
            url: publicUrlWithBuster
        }
    }, { status: 200 });
}