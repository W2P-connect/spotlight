import { prisma } from '@/lib/prisma';
import { sendPushNotification } from './notification';

const newLikeNotification = async (postId: string, likerId: string) => {

    const post = await prisma.workoutHistory.findUnique({
        where: { id: postId },
        select: { ownerId: true }
    });

    if (!post) {
        return;
    }

    const ownerId = post.ownerId;


    if (ownerId === likerId) {
        return;
    }

    // Récupérer le profile du liker
    const likerProfile = await prisma.profile.findUnique({
        where: { id: likerId },
        select: { username: true, profilePicture: true }
    });

    if (!likerProfile?.username) {
        console.error(`Username not found for liker ${likerId}`);
        return;
    }

    // Envoi de la notification avec regroupement géré dans sendPushNotification
    await sendPushNotification(
        ownerId,
        likerId,
        `${likerProfile.username} a liké votre post`,
        {
            userName: likerProfile.username,
            profilePicture: likerProfile.profilePicture
        },
        "Nouveau like",
        "like",
        postId
    );
};

export default newLikeNotification;