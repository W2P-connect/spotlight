import { prisma } from '@/lib/prisma';
import { sendPushNotification } from './notification';

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

    // Optionnel : éviter d'envoyer une notif si l'auteur du commentaire est aussi le propriétaire
    if (ownerId === commenterId) {
        return;
    }

    // Récupérer le profile du commentateur pour afficher son username dans la notif
    const commenterProfile = await prisma.profile.findUnique({
        where: { id: commenterId },
        select: { username: true }
    });

    if (!commenterProfile?.username) {
        return;
    }

    // Envoi de la notification
    await sendPushNotification(
        ownerId,
        `${commenterProfile.username} a commenté votre post`,
        { userName: commenterProfile.username },
        "Nouveau commentaire",
        "comment",
        postId
    );

}

export default newCommentNotification