import { NextRequest } from "next/server";
import { apiResponse } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";
import { withErrorHandler } from "@/utils/errorHandler";

export const GET = withErrorHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") as string;

    const searchParams = req.nextUrl.searchParams
    const offset = parseInt(searchParams.get('offset') || '0');
    const since = searchParams.get('since');

    if (!userId) {
        return apiResponse({
            message: "Missing user ID.",
            success: false
        });
    }

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
            isPublic: true,
            updatedAt: since ? { gt: new Date(since) } : undefined
        },
        include: {
            owner: {
                select: {
                    id: true,
                    username: true,
                    profilePicture: true,
                    firstName: true,
                    lastName: true,
                    displayName: true,
                }
            },
            exercises: {
                include: { exercise: true },
                orderBy: { order: 'asc' }
            },
        },
        orderBy: { date: 'desc' },
        skip: offset,
        take: 10 //La limite ne doit pas venir du front !
    });


    return apiResponse({
        message: "Feed fetched successfully.",
        data: posts,
        success: true
    });
});
