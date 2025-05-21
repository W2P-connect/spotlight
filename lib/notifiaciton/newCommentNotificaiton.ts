import { prisma } from '@/lib/prisma';
import { sendPushNotification } from './notification';
import { env } from 'process';

export const newCommentNotification = async (postId: string, commenterId: string) => {

    const post = await prisma.workoutHistory.findUnique({
        where: { id: postId },
        select: { ownerId: true }
    });

    if (!post) {
        console.error(`Post with ID ${postId} not found`);
        return;
    }

    const ownerId = post.ownerId;

    // Optionnel : éviter d'envoyer une notif si l'auteur du commentaire est aussi le propriétaire du post
    if (ownerId === commenterId) {
        return;
    }

    // Récupérer le profile du commentateur pour afficher son username dans la notif
    const commenterProfile = await prisma.profile.findUnique({
        where: { id: commenterId },
        select: { username: true, profilePicture: true }
    });

    if (!commenterProfile?.username) {
        process.env.NODE_ENV === "development"
            && console.error(`Username not found for commenter ${commenterId}`);
        return;
    }

    // Envoi de la notification
    await sendPushNotification(
        ownerId,
        commenterId,
        `${commenterProfile.username} a commenté votre post`,
        {
            userName: commenterProfile.username,
            profilePicture: commenterProfile.profilePicture
        },
        "Nouveau commentaire",
        "comment",
        postId
    );

}

export const newCommentReplyNotification = async (postId: string, commenterId: string, parentId: string) => {

    const post = await prisma.workoutHistory.findUnique({
        where: { id: postId },
        select: { ownerId: true }
    });

    if (!post) {
        console.error(`Post with ID ${postId} not found`);
        return;
    }

    const parentMessage = await prisma.comment.findUnique({
        where: { id: parentId }
    });

    if (!parentMessage) {
        console.error(`Message with ID ${parentId} not found`);
        return;
    }

    // Optionnel : éviter d'envoyer une notif si l'auteur du commentaire est aussi le propriétaire du commentaire parent
    if (parentMessage.userId === commenterId) {
        return;
    }

    // Récupérer le profile du commentateur pour afficher son username dans la notif
    const commenterProfile = await prisma.profile.findUnique({
        where: { id: commenterId },
        select: { username: true, profilePicture: true }
    });

    if (!commenterProfile?.username) {
        return;
    }

    // Envoi de la notification
    await sendPushNotification(
        parentMessage.userId,
        commenterId,
        `${commenterProfile.username} a répondu à votre commentaire`,
        {
            userName: commenterProfile.username,
            profilePicture: commenterProfile.profilePicture
        },
        "Nouveau commentaire",
        "comment",
        postId
    );

}