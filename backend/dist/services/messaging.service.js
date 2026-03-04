"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const notification_service_1 = require("./notification.service");
class MessagingService {
    static async sendMessage(data) {
        try {
            const [sender, receiver] = await Promise.all([
                database_1.default.user.findUnique({
                    where: { id: data.senderId },
                    include: {
                        profile: true,
                    },
                }),
                database_1.default.user.findUnique({
                    where: { id: data.receiverId },
                    include: {
                        profile: true,
                    },
                }),
            ]);
            if (!sender || !receiver) {
                throw new Error('المرسل أو المستقبل غير موجود');
            }
            await this.validateMessageRelationship(sender, receiver);
            const message = await database_1.default.message.create({
                data: {
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    subject: data.subject,
                    content: data.content,
                    attachments: data.attachments || [],
                },
                include: {
                    sender: {
                        include: {
                            profile: true,
                        },
                    },
                    receiver: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
            await notification_service_1.NotificationService.createNotification({
                userId: data.receiverId,
                type: 'MESSAGE',
                title: 'رسالة جديدة',
                message: `لديك رسالة جديدة من ${sender.profile?.firstName} ${sender.profile?.lastName}`,
                data: {
                    messageId: message.id,
                    senderId: data.senderId,
                    senderName: `${sender.profile?.firstName} ${sender.profile?.lastName}`,
                },
            });
            logger_1.logger.info(`Message sent from ${data.senderId} to ${data.receiverId}`);
            return message;
        }
        catch (error) {
            logger_1.logger.error('Error sending message:', error);
            throw error;
        }
    }
    static async sendBroadcastMessage(senderId, receiverIds, subject, content, attachments) {
        try {
            const sender = await database_1.default.user.findUnique({
                where: { id: senderId },
                include: { profile: true },
            });
            if (!sender) {
                throw new Error('المرسل غير موجود');
            }
            if (sender.role !== client_1.UserRole.PLATFORM_OWNER &&
                sender.role !== client_1.UserRole.TENANT_ADMIN &&
                sender.role !== client_1.UserRole.TENANT_STAFF &&
                sender.role !== client_1.UserRole.TEACHER) {
                throw new Error('ليس لديك صلاحية لإرسال رسائل جماعية');
            }
            const messages = await Promise.all(receiverIds.map((receiverId) => database_1.default.message.create({
                data: {
                    senderId,
                    receiverId,
                    subject,
                    content,
                    attachments: attachments || [],
                },
                include: {
                    receiver: {
                        include: {
                            profile: true,
                        },
                    },
                },
            })));
            await Promise.all(messages.map((message) => notification_service_1.NotificationService.createNotification({
                userId: message.receiverId,
                type: 'MESSAGE',
                title: 'رسالة جديدة',
                message: `لديك رسالة جديدة من ${sender.profile?.firstName} ${sender.profile?.lastName}`,
                data: {
                    messageId: message.id,
                    senderId,
                },
            })));
            logger_1.logger.info(`Broadcast message sent from ${senderId} to ${receiverIds.length} recipients`);
            return messages;
        }
        catch (error) {
            logger_1.logger.error('Error sending broadcast message:', error);
            throw error;
        }
    }
    static async getInboxMessages(userId, filters) {
        try {
            const where = {
                receiverId: userId,
                ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
                ...(filters?.fromDate &&
                    filters?.toDate && {
                    createdAt: {
                        gte: filters.fromDate,
                        lte: filters.toDate,
                    },
                }),
            };
            const [messages, total, unreadCount] = await Promise.all([
                database_1.default.message.findMany({
                    where,
                    include: {
                        sender: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: filters?.limit || 20,
                    skip: filters?.offset || 0,
                }),
                database_1.default.message.count({ where }),
                database_1.default.message.count({
                    where: { receiverId: userId, isRead: false },
                }),
            ]);
            return { messages, total, unreadCount };
        }
        catch (error) {
            logger_1.logger.error('Error fetching inbox messages:', error);
            throw error;
        }
    }
    static async getSentMessages(userId, filters) {
        try {
            const where = {
                senderId: userId,
                ...(filters?.fromDate &&
                    filters?.toDate && {
                    createdAt: {
                        gte: filters.fromDate,
                        lte: filters.toDate,
                    },
                }),
            };
            const [messages, total] = await Promise.all([
                database_1.default.message.findMany({
                    where,
                    include: {
                        receiver: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: filters?.limit || 20,
                    skip: filters?.offset || 0,
                }),
                database_1.default.message.count({ where }),
            ]);
            return { messages, total };
        }
        catch (error) {
            logger_1.logger.error('Error fetching sent messages:', error);
            throw error;
        }
    }
    static async getConversation(userId1, userId2, limit = 50) {
        try {
            const messages = await database_1.default.message.findMany({
                where: {
                    OR: [
                        { senderId: userId1, receiverId: userId2 },
                        { senderId: userId2, receiverId: userId1 },
                    ],
                },
                include: {
                    sender: {
                        include: {
                            profile: true,
                        },
                    },
                    receiver: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: { createdAt: 'asc' },
                take: limit,
            });
            await database_1.default.message.updateMany({
                where: {
                    senderId: userId2,
                    receiverId: userId1,
                    isRead: false,
                },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });
            return messages;
        }
        catch (error) {
            logger_1.logger.error('Error fetching conversation:', error);
            throw error;
        }
    }
    static async markAsRead(messageId, userId) {
        try {
            const message = await database_1.default.message.findUnique({
                where: { id: messageId },
            });
            if (!message) {
                throw new Error('الرسالة غير موجودة');
            }
            if (message.receiverId !== userId) {
                throw new Error('ليس لديك صلاحية لقراءة هذه الرسالة');
            }
            const updated = await database_1.default.message.update({
                where: { id: messageId },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });
            return updated;
        }
        catch (error) {
            logger_1.logger.error('Error marking message as read:', error);
            throw error;
        }
    }
    static async markAllAsRead(userId) {
        try {
            await database_1.default.message.updateMany({
                where: {
                    receiverId: userId,
                    isRead: false,
                },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });
            logger_1.logger.info(`All messages marked as read for user ${userId}`);
        }
        catch (error) {
            logger_1.logger.error('Error marking all messages as read:', error);
            throw error;
        }
    }
    static async deleteMessage(messageId, userId) {
        try {
            const message = await database_1.default.message.findUnique({
                where: { id: messageId },
            });
            if (!message) {
                throw new Error('الرسالة غير موجودة');
            }
            if (message.senderId !== userId && message.receiverId !== userId) {
                throw new Error('ليس لديك صلاحية لحذف هذه الرسالة');
            }
            await database_1.default.message.delete({
                where: { id: messageId },
            });
            logger_1.logger.info(`Message ${messageId} deleted by user ${userId}`);
        }
        catch (error) {
            logger_1.logger.error('Error deleting message:', error);
            throw error;
        }
    }
    static async sendMessageToClassGuardians(senderId, classId, subject, content) {
        try {
            const studentClasses = await database_1.default.studentClass.findMany({
                where: { classId, isActive: true },
                include: {
                    student: {
                        include: {
                            guardian: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            });
            const guardianIds = studentClasses
                .map((sc) => sc.student.guardian?.userId)
                .filter((id) => id !== undefined && id !== null);
            const uniqueGuardianIds = [...new Set(guardianIds)];
            const messages = await this.sendBroadcastMessage(senderId, uniqueGuardianIds, subject, content);
            logger_1.logger.info(`Message sent to ${uniqueGuardianIds.length} guardians of class ${classId}`);
            return messages;
        }
        catch (error) {
            logger_1.logger.error('Error sending message to class guardians:', error);
            throw error;
        }
    }
    static async validateMessageRelationship(sender, receiver) {
        if (sender.role === client_1.UserRole.PLATFORM_OWNER) {
            return;
        }
        if (sender.role === client_1.UserRole.TENANT_ADMIN || sender.role === client_1.UserRole.TENANT_STAFF) {
            return;
        }
        if (sender.role === client_1.UserRole.TEACHER) {
            if (receiver.role === client_1.UserRole.STUDENT ||
                receiver.role === client_1.UserRole.PARENT ||
                receiver.role === client_1.UserRole.TENANT_ADMIN ||
                receiver.role === client_1.UserRole.PLATFORM_OWNER ||
                receiver.role === client_1.UserRole.TENANT_STAFF) {
                return;
            }
            throw new Error('لا يمكنك إرسال رسالة لهذا المستخدم');
        }
        if (sender.role === client_1.UserRole.STUDENT) {
            if (receiver.role === client_1.UserRole.TEACHER ||
                receiver.role === client_1.UserRole.TENANT_ADMIN ||
                receiver.role === client_1.UserRole.PLATFORM_OWNER ||
                receiver.role === client_1.UserRole.TENANT_STAFF) {
                return;
            }
            throw new Error('لا يمكنك إرسال رسالة لهذا المستخدم');
        }
        if (sender.role === client_1.UserRole.PARENT) {
            if (receiver.role === client_1.UserRole.TEACHER ||
                receiver.role === client_1.UserRole.TENANT_ADMIN ||
                receiver.role === client_1.UserRole.PLATFORM_OWNER ||
                receiver.role === client_1.UserRole.TENANT_STAFF) {
                return;
            }
            throw new Error('لا يمكنك إرسال رسالة لهذا المستخدم');
        }
        throw new Error('لا يمكنك إرسال رسالة لهذا المستخدم');
    }
    static async searchMessages(userId, query, searchIn = 'both') {
        try {
            const where = {
                OR: [
                    { subject: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ],
            };
            if (searchIn === 'inbox') {
                where.receiverId = userId;
            }
            else if (searchIn === 'sent') {
                where.senderId = userId;
            }
            else {
                where.OR = [
                    ...where.OR.map((condition) => ({ ...condition, receiverId: userId })),
                    ...where.OR.map((condition) => ({ ...condition, senderId: userId })),
                ];
            }
            const messages = await database_1.default.message.findMany({
                where,
                include: {
                    sender: {
                        include: {
                            profile: true,
                        },
                    },
                    receiver: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });
            return messages;
        }
        catch (error) {
            logger_1.logger.error('Error searching messages:', error);
            throw error;
        }
    }
}
exports.MessagingService = MessagingService;
exports.default = MessagingService;
//# sourceMappingURL=messaging.service.js.map