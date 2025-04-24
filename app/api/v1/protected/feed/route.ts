import { NextRequest } from "next/server";
import { apiResponse } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;

    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '5');
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
                exercises: {
                    include: { exercise: true },
                    orderBy: { order: 'asc' }
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
