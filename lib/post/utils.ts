import { prisma } from "@/lib/prisma";

export async function toggleLike(userId: string, postId: string) {
    try {
        // Vérifie si l'utilisateur a déjà liké le post
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        if (existingLike) {
            // Si déjà liké => Unlike
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }
            });

            // MAJ du compteur de likes
            await prisma.workoutHistory.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } }
            });

            return {
                message: "unliked",
                error: null,
                success: true
            };
        } else {
            // Sinon, Like
            await prisma.like.create({
                data: {
                    userId,
                    postId
                }
            });

            await prisma.workoutHistory.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } }
            });

            return {
                message: "liked",
                error: null,
                success: true
            };
        }

    } catch (err: any) {
        console.error("ToggleLike Error:", err);

        return {
            message: "An error occurred during like/unlike process.",
            error: err.message || "Unknown error",
            success: false
        };
    }
}
