import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const expo = new Expo();

export const sendPushNotification = async (
    userId: string,
    message: string,
    data: Record<string, any> = {},
    title: string = ""
) => {
    // 1. Récupérer tous les tokens de l'utilisateur
    const tokens = await prisma.pushToken.findMany({
        where: { profileId: userId },
    });

    if (tokens.length === 0) {
        console.log(`No push tokens found for user ${userId}`);
        return;
    }

    const messages: ExpoPushMessage[] = [];

    tokens.forEach(tokenEntry => {
        const pushToken = tokenEntry.token;

        if (!Expo.isExpoPushToken(pushToken)) {
            console.warn(`Invalid Expo Push Token: ${pushToken}`);
            // Optionnel : suppression immédiate si le format est invalide
            prisma.pushToken.delete({ where: { id: tokenEntry.id } });
            return;
        }

        const notification: ExpoPushMessage = {
            to: pushToken,
            sound: 'default',
            body: message,
            data,
            ...(title && { title }),
        };

        messages.push(notification);
    });

    // 2. Envoyer les notifications par lots
    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);

            ticketChunk.forEach(async (ticket, index) => {
                if (ticket.status === 'error') {
                    const failedToken = chunk[index].to;
                    console.error(`Failed to send to ${failedToken}: ${ticket.message}`);

                    // Suppression du token invalide (ex: DeviceNotRegistered)
                    if (ticket.details?.error === 'DeviceNotRegistered') {
                        await prisma.pushToken.deleteMany({
                            where: { token: failedToken as string }
                        });
                        console.log(`Deleted invalid token: ${failedToken}`);
                    }
                }
            });
        } catch (error) {
            console.error('Error while sending push notifications:', error);
        }
    }
};
