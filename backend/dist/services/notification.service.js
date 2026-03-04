"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const email_service_1 = require("./email.service");
const whatsapp_service_1 = require("./whatsapp.service");
class NotificationService {
    static async createNotification(data) {
        try {
            const notification = await database_1.default.notification.create({
                data: {
                    userId: data.userId,
                    type: data.type,
                    title: data.title,
                    message: data.message,
                    data: data.data || {},
                },
                include: {
                    user: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
            if (data.sendEmail && process.env.NOTIFICATION_EMAIL_ENABLED === 'true') {
                await email_service_1.EmailService.sendNotificationEmail(notification.user.email, data.title, data.message).catch((error) => {
                    logger_1.logger.error('Error sending notification email:', error);
                });
            }
            if (data.sendWhatsApp && process.env.NOTIFICATION_WHATSAPP_ENABLED === 'true') {
                const whatsappNumber = notification.user.profile?.whatsappNumber;
                if (whatsappNumber) {
                    await whatsapp_service_1.WhatsAppService.sendMessage(whatsappNumber, `*${data.title}*\n\n${data.message}`).catch((error) => {
                        logger_1.logger.error('Error sending WhatsApp notification:', error);
                    });
                }
            }
            logger_1.logger.info(`Notification created for user ${data.userId}: ${data.title}`);
            return notification;
        }
        catch (error) {
            logger_1.logger.error('Error creating notification:', error);
            throw error;
        }
    }
    static async createBulkNotifications(userIds, type, title, message, data) {
        try {
            await database_1.default.notification.createMany({
                data: userIds.map((userId) => ({
                    userId,
                    type,
                    title,
                    message,
                    data: data || {},
                })),
            });
            logger_1.logger.info(`Bulk notifications created for ${userIds.length} users: ${title}`);
        }
        catch (error) {
            logger_1.logger.error('Error creating bulk notifications:', error);
            throw error;
        }
    }
    static async getUserNotifications(userId, filters) {
        try {
            const where = {
                userId,
                ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
                ...(filters?.type && { type: filters.type }),
            };
            const [notifications, total, unreadCount] = await Promise.all([
                database_1.default.notification.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    take: filters?.limit || 20,
                    skip: filters?.offset || 0,
                }),
                database_1.default.notification.count({ where }),
                database_1.default.notification.count({
                    where: { userId, isRead: false },
                }),
            ]);
            return { notifications, total, unreadCount };
        }
        catch (error) {
            logger_1.logger.error('Error fetching user notifications:', error);
            throw error;
        }
    }
    static async markAsRead(notificationId, userId) {
        try {
            const notification = await database_1.default.notification.findUnique({
                where: { id: notificationId },
            });
            if (!notification) {
                throw new Error('الإشعار غير موجود');
            }
            if (notification.userId !== userId) {
                throw new Error('ليس لديك صلاحية لقراءة هذا الإشعار');
            }
            const updated = await database_1.default.notification.update({
                where: { id: notificationId },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });
            return updated;
        }
        catch (error) {
            logger_1.logger.error('Error marking notification as read:', error);
            throw error;
        }
    }
    static async markAllAsRead(userId) {
        try {
            await database_1.default.notification.updateMany({
                where: {
                    userId,
                    isRead: false,
                },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });
            logger_1.logger.info(`All notifications marked as read for user ${userId}`);
        }
        catch (error) {
            logger_1.logger.error('Error marking all notifications as read:', error);
            throw error;
        }
    }
    static async deleteNotification(notificationId, userId) {
        try {
            const notification = await database_1.default.notification.findUnique({
                where: { id: notificationId },
            });
            if (!notification) {
                throw new Error('الإشعار غير موجود');
            }
            if (notification.userId !== userId) {
                throw new Error('ليس لديك صلاحية لحذف هذا الإشعار');
            }
            await database_1.default.notification.delete({
                where: { id: notificationId },
            });
            logger_1.logger.info(`Notification ${notificationId} deleted by user ${userId}`);
        }
        catch (error) {
            logger_1.logger.error('Error deleting notification:', error);
            throw error;
        }
    }
    static async deleteReadNotifications(userId) {
        try {
            await database_1.default.notification.deleteMany({
                where: {
                    userId,
                    isRead: true,
                },
            });
            logger_1.logger.info(`All read notifications deleted for user ${userId}`);
        }
        catch (error) {
            logger_1.logger.error('Error deleting read notifications:', error);
            throw error;
        }
    }
    static async notifyNewEvaluation(studentId, teacherName, evaluationType, score) {
        try {
            await this.createNotification({
                userId: studentId,
                type: client_1.NotificationType.EVALUATION,
                title: 'تقييم جديد',
                message: `تم تقييمك من قبل المعلم ${teacherName}. نوع التقييم: ${evaluationType}. الدرجة: ${score}%`,
                data: {
                    teacherName,
                    evaluationType,
                    score,
                },
                sendEmail: true,
            });
            const student = await database_1.default.student.findUnique({
                where: { id: studentId },
                include: { guardian: true },
            });
            if (student?.guardian?.userId) {
                await this.createNotification({
                    userId: student.guardian.userId,
                    type: client_1.NotificationType.EVALUATION,
                    title: 'تقييم جديد لابنك/ابنتك',
                    message: `تم تقييم ابنك/ابنتك من قبل المعلم ${teacherName}. نوع التقييم: ${evaluationType}. الدرجة: ${score}%`,
                    data: {
                        studentId,
                        teacherName,
                        evaluationType,
                        score,
                    },
                    sendEmail: true,
                    sendWhatsApp: true,
                });
            }
        }
        catch (error) {
            logger_1.logger.error('Error sending evaluation notification:', error);
        }
    }
    static async notifyUpcomingExam(studentIds, examTitle, examDate) {
        try {
            await this.createBulkNotifications(studentIds, client_1.NotificationType.EXAM, 'اختبار قريب', `لديك اختبار قريب: ${examTitle}. التاريخ: ${examDate.toLocaleDateString('ar-SA')}`, {
                examTitle,
                examDate: examDate.toISOString(),
            });
            logger_1.logger.info(`Upcoming exam notifications sent to ${studentIds.length} students`);
        }
        catch (error) {
            logger_1.logger.error('Error sending upcoming exam notifications:', error);
        }
    }
    static async notifyAbsence(studentId, date, className) {
        try {
            const student = await database_1.default.student.findUnique({
                where: { id: studentId },
                include: { guardian: true },
            });
            if (!student?.guardian?.userId) {
                return;
            }
            await this.createNotification({
                userId: student.guardian.userId,
                type: client_1.NotificationType.ATTENDANCE,
                title: 'إشعار غياب',
                message: `غاب ابنك/ابنتك عن الفصل ${className} بتاريخ ${date.toLocaleDateString('ar-SA')}`,
                data: {
                    studentId,
                    className,
                    date: date.toISOString(),
                },
                sendWhatsApp: true,
            });
        }
        catch (error) {
            logger_1.logger.error('Error sending absence notification:', error);
        }
    }
    static async notifyCertificateIssued(studentId, certificateTitle, certificateUrl) {
        try {
            await this.createNotification({
                userId: studentId,
                type: client_1.NotificationType.CERTIFICATE,
                title: 'شهادة جديدة',
                message: `تهانينا! تم إصدار شهادة ${certificateTitle} لك`,
                data: {
                    certificateTitle,
                    certificateUrl,
                },
                sendEmail: true,
            });
            const student = await database_1.default.student.findUnique({
                where: { id: studentId },
                include: { guardian: true },
            });
            if (student?.guardian?.userId) {
                await this.createNotification({
                    userId: student.guardian.userId,
                    type: client_1.NotificationType.CERTIFICATE,
                    title: 'شهادة جديدة لابنك/ابنتك',
                    message: `تهانينا! تم إصدار شهادة ${certificateTitle} لابنك/ابنتك`,
                    data: {
                        studentId,
                        certificateTitle,
                        certificateUrl,
                    },
                    sendEmail: true,
                    sendWhatsApp: true,
                });
            }
        }
        catch (error) {
            logger_1.logger.error('Error sending certificate notification:', error);
        }
    }
    static async notifyStudentAdmission(studentId, schoolName, className) {
        try {
            await this.createNotification({
                userId: studentId,
                type: client_1.NotificationType.ADMISSION,
                title: 'قبول طلبك',
                message: `تم قبولك في ${schoolName} - ${className}. مرحباً بك!`,
                data: {
                    schoolName,
                    className,
                },
                sendEmail: true,
            });
            const student = await database_1.default.student.findUnique({
                where: { id: studentId },
                include: { guardian: true },
            });
            if (student?.guardian?.userId) {
                await this.createNotification({
                    userId: student.guardian.userId,
                    type: client_1.NotificationType.ADMISSION,
                    title: 'قبول طلب ابنك/ابنتك',
                    message: `تم قبول ابنك/ابنتك في ${schoolName} - ${className}`,
                    data: {
                        studentId,
                        schoolName,
                        className,
                    },
                    sendEmail: true,
                    sendWhatsApp: true,
                });
            }
        }
        catch (error) {
            logger_1.logger.error('Error sending admission notification:', error);
        }
    }
}
exports.NotificationService = NotificationService;
exports.default = NotificationService;
//# sourceMappingURL=notification.service.js.map