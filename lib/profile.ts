import { Profile } from '@prisma/client';
import { prisma } from './prisma';
import { createClient } from '@supabase/supabase-js';
import { sendPushNotification } from '@/lib/notifiaciton/notification';

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
            ExerciseGoal: true,
        },
    });

    if (!profile) return null;

    const profileData = {
        ...profile,
        ...user.user,
        posts: profile.WorkoutHistory.map(workout => ({
            ...workout,
            owner: {
                id: profile.id,
                username: profile.username,
                profilePicture: profile.profilePicture,
                firtsName: profile.firstName,
                lastName: profile.lastName,
                displayName: profile.displayName
            }
        })),
        profilePicture: profile.profilePicture,
        followers: profile?.followers.map(f => f.followerId),
        following: profile?.following.map(f => f.followingId),
        like: profile?.Like.map(f => f.postId),
    };

    if (!publicData) return profileData;

    return {
        id: profileData.id,
        profilePicture: profileData.profilePicture,
        fisrtName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username,
        following: profileData.following,
        followers: profileData.followers,
        followingCount: profileData.followingCount,
        followersCount: profileData.followersCount,
        posts: profileData.posts,
        like: profileData.like,
        displayName: profileData.displayName
    }
}

export default getProfileData;

export async function toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
        return {
            message: "You can't follow yourself.",
            error: "InvalidOperation",
            followed: false,
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
                followed: false,
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

            const profile = await prisma.profile.findUnique({ where: { id: followerId } });
            if (profile?.username) {
                sendPushNotification(
                    followingId,
                    followerId,
                    `${profile.username} à commencé à vous suivre !`,
                    {
                        userName: profile.username,
                        profilePicture: profile.profilePicture
                    },
                    "Nouveau follower !",
                    "follow",
                );
            }

            return {
                message: "followed",
                error: null,
                followed: true,
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

export const getProfileById = async (userId: string) => {
    return prisma.profile.findUnique({
        where: { id: userId },
    });
};

export const updateProfileData = async (userId: string, firstName: string, lastName: string, username: string) => {
    const displayName = `${firstName} ${lastName} (${username})`.trim();
    const searchValue = `${firstName} ${lastName} ${username}`.toLowerCase().trim();

    return prisma.profile.update({
        where: { id: userId },
        data: {
            lastName,
            firstName,
            username,
            displayName,
            searchValue,
        }
    });
};
