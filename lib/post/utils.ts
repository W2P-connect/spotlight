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

export async function createComment(userId: string, postId: string, content: string, parentId?: string) {
    try {
        const post = await prisma.workoutHistory.findUnique({ where: { id: postId } });
        if (!post) {
            return { message: "Post not found.", error: "PostNotFound", success: false };
        }

        if (parentId) {
            const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
            if (!parentComment || parentComment.postId !== postId) {
                return { message: "Invalid parent comment.", error: "InvalidParent", success: false };
            }
        }

        const comment = await prisma.comment.create({
            data: {
                userId,
                postId,
                content,
                parentId: parentId || null
            }
        });

        await prisma.workoutHistory.update({
            where: { id: postId },
            data: { commentsCount: { increment: 1 } }
        });

        return { message: "created", error: null, success: true, data: comment };

    } catch (err: any) {
        console.error("CreateComment Error:", err);
        return {
            message: "An error occurred while creating the comment.",
            error: err.message || "Unknown error",
            success: false
        };
    }
}
