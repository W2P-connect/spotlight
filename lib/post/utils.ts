import { prisma } from "@/lib/prisma";
import sanitizeHtml from 'sanitize-html';
import newCommentNotification from "../notifiaciton/newCommentNotificaiton";
import newLikeNotification from "../notifiaciton/newLikeNotification ";


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

            newLikeNotification(postId, userId);

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

        const cleanContent = sanitizeHtml(content, {
            allowedTags: [],      // Aucun tag HTML autorisé
            allowedAttributes: {} // Aucune attribut autorisé
        });

        if (!cleanContent) {
            return { message: "Invalid comment content.", error: "InvalidContent", success: false };
        }

        if (cleanContent.length > 2200) {
            return {
                message: "Invalid comment content: limite max autorisée à 2 200 caractères.",
                error: "TooLong",
                success: false
            };
        }

        const comment = await prisma.comment.create({
            data: {
                userId,
                postId,
                content: cleanContent,
                parentId: parentId || null
            }
        });

        if (parentId) {
            //notification réponse            
        } else {
            newCommentNotification(postId, userId)
        }

        if (!parentId) {
            await prisma.workoutHistory.update({
                where: { id: postId },
                data: { commentsCount: { increment: 1 } }
            });
        }

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

export async function getComments(userId: string, postId: string, limit: number = 10, offset: number = 0) {
    try {
        const post = await prisma.workoutHistory.findUnique({ where: { id: postId } });
        if (!post) {
            return { message: "Post not found.", error: "PostNotFound", success: false };
        }

        // 1️⃣ Récupérer les commentaires principaux avec leurs réponses
        const comments = await prisma.comment.findMany({
            where: {
                postId,
                parentId: null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        profilePicture: true,
                        lastName: true,
                        firstName: true,
                    }
                },
                replies: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                displayName: true,
                                profilePicture: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset
        });


        const commentIds = comments.flatMap(c => [
            c.id,
            ...c.replies.map(r => r.id)
        ]);


        const likedComments = await prisma.commentLike.findMany({
            where: {
                userId,
                commentId: { in: commentIds }
            },
            select: { commentId: true }
        });

        const likedCommentIds = new Set(likedComments.map(like => like.commentId));

        const enrichedComments = comments.map(comment => ({
            ...comment,
            isLikedByCurrentUser: likedCommentIds.has(comment.id),
            replies: comment.replies.map(reply => ({
                ...reply,
                isLikedByCurrentUser: likedCommentIds.has(reply.id)
            }))
        }));

        return { message: "Fetched", error: null, success: true, data: enrichedComments };

    } catch (err: any) {
        console.error("GetComments Error:", err);
        return {
            message: "An error occurred while fetching comments.",
            error: err.message || "Unknown error",
            success: false
        };
    }
}

export async function toggleCommentLike(userId: string, commentId: string) {
    try {
        const existingLike = await prisma.commentLike.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.commentLike.delete({
                where: {
                    userId_commentId: {
                        userId,
                        commentId
                    }
                }
            });

            await prisma.comment.update({
                where: { id: commentId },
                data: { likesCount: { decrement: 1 } }
            });

            return { message: "unliked", error: null, success: true };
        } else {
            // Like
            await prisma.commentLike.create({
                data: { userId, commentId }
            });

            await prisma.comment.update({
                where: { id: commentId },
                data: { likesCount: { increment: 1 } }
            });

            return { message: "liked", error: null, success: true };
        }

    } catch (err: any) {
        console.error("ToggleCommentLike Error:", err);
        return {
            message: "An error occurred during like/unlike process.",
            error: err.message || "Unknown error",
            success: false
        };
    }
}
