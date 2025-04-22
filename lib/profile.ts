import { Profile } from '@prisma/client';
import { prisma } from './prisma';
import { createClient } from '@supabase/supabase-js';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const getProfileData = async (userId: Profile["id"]) => {

    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) return null;

    const profile = await prisma.profile.findUnique({
        where: { id: userId },
        include: {
            following: true,
            followers: true,
            WorkoutHistory: {
                include: {
                    exercises: { include: { exercise: true } }
                },
                where: { isPublic: true }
            },
        },
    });

    if (!profile) return null;

    return {
        ...profile,
        ...user.user,
        posts: profile.WorkoutHistory,
        profilPicture: profile.profilPicture,
    };
};

export default getProfileData;  