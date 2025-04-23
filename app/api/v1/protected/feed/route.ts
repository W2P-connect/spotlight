import { NextRequest } from "next/server";
import { apiResponse } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
        return apiResponse({
            message: "Missing user ID.",
            success: false
        });
    }

    try {
        // 1. Récupérer les abonnements (following)
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });

        const followingIds = following.map(f => f.followingId);

        if (followingIds.length === 0) {
            return apiResponse({
                message: "No following users.",
                data: [],
                success: true
            });
        }

        // 2. Récupérer les WorkoutHistory publics des abonnements
        const posts = await prisma.workoutHistory.findMany({
            where: {
                ownerId: { in: followingIds },
                isPublic: true
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        profilPicture: true,
                        firstName: true,
                        lastName: true,
                        displayName: true,
                    }
                },
                Like: {
                    where: { userId: userId },
                    select: { id: true }
                }
            },
            orderBy: { date: 'desc' },
            skip: offset,
            take: limit
        });

        // 3. Formatter les données
        // const formattedPosts = posts.map(post => ({
        //     id: post.id,
        //     name: post.name,
        //     date: post.date,
        //     owner: post.owner,
        //     likesCount: post.likesCount,
        //     commentsCount: post.commentsCount,
        //     hasLiked: post.Like.length > 0
        // }));

        return apiResponse({
            message: "Feed fetched successfully.",
            data: posts,
            success: true
        });

    } catch (error) {
        console.error("Error fetching feed:", error);
        return apiResponse({
            message: "Failed to fetch feed.",
            error: "Error fetching feed",
            success: false
        });
    }
};
