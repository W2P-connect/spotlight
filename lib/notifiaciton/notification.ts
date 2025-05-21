import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { prisma } from '@/lib/prisma';
import { FOLLOW_SPAM_WINDOW_MS, NOTIFICATION_GROUPING_WINDOW_MS } from '@/constantes';
import { Notification } from '@/types';

const expo = new Expo();

type NotificationData = {
    userName: string;
    profilePicture: string | null;
    [key: string]: any;
};

type NotificationType = 'like' | 'comment' | 'generic' | 'follow'

export function sendPushNotification(
    toUserId: string,
    createdBy: string,
    message: string,
    data: NotificationData,
    title: string,
    type: "like" | "comment",
    postId: string
): Promise<void>;

export function sendPushNotification(
    toUserId: string,
    createdBy: string,
    message: string,
    data: NotificationData,
    title?: string,
    type?: "generic" | "follow"
): Promise<void>;

// Implémentation
export async function sendPushNotification(
    toUserId: string,
    createdBy: string,
    message: string,
    data: NotificationData,
    title: string = "",
    type: NotificationType = "generic",
    postId?: string
): Promise<void> {
    if ((type === "like" || type === "comment") && !postId) {
        throw new Error(`postId is required for notification type '${type}'`);
    }

    //ANTISPAM
    if (!(await shouldSendNotification(toUserId, postId, createdBy, type))) {
        console.log("Spam detected, nothing to do.");
        return;
    }

    let dbNotification;

    // Gestion spéciale pour likes/comments avec postId
    if ((type === 'like' || type === 'comment') && postId) {
        const existingNotif = await prisma.notification.findFirst({
            where: {
                userId: toUserId,
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
                    userId: toUserId,
                    type,
                    message,
                    data: {
                        ...data,
                        users: [data.userName],
                    },
                    postId,
                    createdBy
                },
            });
        }
    } else {
        // Cas générique
        dbNotification = await prisma.notification.create({
            data: {
                userId: toUserId,
                type,
                message,
                data,
                postId,
                createdBy
            },
        });
    }

    const tokens = await prisma.pushToken.findMany({
        where: { profileId: toUserId },
    });

    if (tokens.length === 0) {
        process.env.NODE_ENV === "development" &&
            console.log(`No push tokens found for user ${toUserId}`);
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

        const enrichedData: Notification = {
            ...dbNotification,
            data

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

            console.log("success sending push notifications", ticketChunk.map((ticket) => ticket.status));
        } catch (error) {
            console.error('Error while sending push notifications:', error);
        }
    }
};

export const shouldSendNotification = async (
    userId: string,
    postId: string | undefined,
    createdBy: string,
    type: NotificationType
): Promise<boolean> => {
    if (type === "like" || type === "comment") {
        if (!postId) {
            console.warn(`postId is required for notification type '${type}'`);
            return false;
        }

        const existingNotif = await prisma.notification.findFirst({
            where: {
                userId,
                postId,
                type,
                createdBy,
                createdAt: {
                    gte: new Date(Date.now() - NOTIFICATION_GROUPING_WINDOW_MS)
                }
            }
        });

        if (existingNotif) {
            return false;
        }
    }

    if (type === "follow") {
        const existingFollowNotif = await prisma.notification.findFirst({
            where: {
                userId,
                type: "follow",
                createdBy,
                createdAt: {
                    gte: new Date(Date.now() - FOLLOW_SPAM_WINDOW_MS)
                }
            }
        });

        if (existingFollowNotif) {
            return false;
        }
    }
    return true;
};
