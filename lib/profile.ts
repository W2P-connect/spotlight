import { Profile } from '@prisma/client';
import { prisma } from './prisma';
import { createClient } from '@supabase/supabase-js';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const getProfileData = async (userId: Profile["id"], publicData = false) => {

    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) return null;

    const profile = await prisma.profile.findUnique({
        where: { id: userId },
        include: {
            following: { select: { followingId: true } },
            followers: { select: { followerId: true } },
            Like: { select: { postId: true } },
            WorkoutHistory: {
                include: {
                    exercises: { include: { exercise: true } }
                },
                where: { isPublic: true }
            },
        },
    });

    if (!profile) return null;

    const profileData = {
        ...profile,
        ...user.user,
        posts: profile.WorkoutHistory,
        profilPicture: profile.profilPicture,
        followers: profile?.followers.map(f => f.followerId),
        following: profile?.following.map(f => f.followingId),
        like: profile?.Like.map(f => f.postId),
    };

    if (!publicData) return profileData;

    return {
        id: profileData.id,
        profilPicture: profileData.profilPicture,
        fisrtName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username,
        following: profileData.following,
        followers: profileData.followers,
        followingCount: profileData.followingCount,
        followersCount: profileData.followersCount,
        posts: profileData.posts,
        like: profileData.like,
    }
}

export default getProfileData;

export async function toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
        return {
            message: "You can't follow yourself.",
            error: "InvalidOperation",
            success: false
        };
    }

    try {
        // Vérifier si la relation existe déjà
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        if (existingFollow) {
            // Déjà follow => Unfollow
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId
                    }
                }
            });

            await prisma.profile.update({
                where: { id: followingId },
                data: { followersCount: { decrement: 1 } }
            });

            await prisma.profile.update({
                where: { id: followerId },
                data: { followingCount: { decrement: 1 } }
            });

            return {
                message: "unfollowed",
                error: null,
                success: true
            };
        } else {
            await prisma.follow.create({
                data: {
                    followerId,
                    followingId
                }
            });

            await prisma.profile.update({
                where: { id: followingId },
                data: { followersCount: { increment: 1 } }
            });

            await prisma.profile.update({
                where: { id: followerId },
                data: { followingCount: { increment: 1 } }
            });

            return {
                message: "followed",
                error: null,
                success: true
            };
        }

    } catch (err: any) {
        console.error("ToggleFollow Error:", err);

        return {
            message: "An error occurred during follow/unfollow process.",
            error: err.message || "Unknown error",
            success: false
        };
    }
}

