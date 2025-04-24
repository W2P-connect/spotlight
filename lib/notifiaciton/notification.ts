import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { prisma } from '@/lib/prisma';
import { NOTIFICATION_GROUPING_WINDOW_MS } from '@/constantes';

const expo = new Expo();

type NotificationData = {
    userName: string;
    [key: string]: any;
};

export function sendPushNotification(
    userId: string,
    message: string,
    data: NotificationData,
    title: string,
    type: "like" | "comment",
    postId: string
): Promise<void>;

export function sendPushNotification(
    userId: string,
    message: string,
    data: NotificationData,
    title?: string,
    type?: "generic" | "follow"
): Promise<void>;

// Implémentation
export async function sendPushNotification(
    userId: string,
    message: string,
    data: NotificationData,
    title: string = "",
    type: "like" | "comment" | "generic" | "follow" = "generic",
    postId?: string
): Promise<void> {
    if ((type === "like" || type === "comment") && !postId) {
        throw new Error(`postId is required for notification type '${type}'`);
    }

    let dbNotification;

    // Gestion spéciale pour likes/comments avec postId
    if ((type === 'like' || type === 'comment') && postId) {
        const existingNotif = await prisma.notification.findFirst({
            where: {
                userId,
                postId,
                type,
                createdAt: {
                    gte: new Date(Date.now() - NOTIFICATION_GROUPING_WINDOW_MS)  // Dernières 4 heures
                },
            }
        });

        if (existingNotif) {
            const existingData = existingNotif.data as NotificationData;

            const updatedUsers = existingData.users || [existingData.userName];
            if (!updatedUsers.includes(data.userName)) {
                updatedUsers.push(data.userName);
            }

            dbNotification = await prisma.notification.update({
                where: { id: existingNotif.id },
                data: {
                    message: `Ton post reçoit de l'engagement !`,
                    data: {
                        ...existingData,
                        users: updatedUsers,
                    }
                }
            });
        } else {
            dbNotification = await prisma.notification.create({
                data: {
                    userId,
                    type,
                    message,
                    data: {
                        ...data,
                        users: [data.userName],
                    },
                    postId,
                },
            });
        }
    } else {
        // Cas générique
        dbNotification = await prisma.notification.create({
            data: {
                userId,
                type,
                message,
                data,
                postId,
            },
        });
    }

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
            prisma.pushToken.delete({ where: { id: tokenEntry.id } });
            return;
        }

        const enrichedData = {
            ...data,
            notificationId: dbNotification.id,
        };

        const notification: ExpoPushMessage = {
            to: pushToken,
            sound: 'default',
            body: message,
            data: enrichedData,
            ...(title && { title }),
        };

        messages.push(notification);
    });

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);

            ticketChunk.forEach(async (ticket, index) => {
                if (ticket.status === 'error') {
                    const failedToken = chunk[index].to;
                    console.error(`Failed to send to ${failedToken}: ${ticket.message}`);

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