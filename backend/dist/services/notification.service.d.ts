import { Notification, NotificationType } from '@prisma/client';
interface CreateNotificationDTO {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    sendEmail?: boolean;
    sendWhatsApp?: boolean;
}
export declare class NotificationService {
    static createNotification(data: CreateNotificationDTO): Promise<Notification>;
    static createBulkNotifications(userIds: string[], type: NotificationType, title: string, message: string, data?: Record<string, any>): Promise<void>;
    static getUserNotifications(userId: string, filters?: {
        isRead?: boolean;
        type?: NotificationType;
        limit?: number;
        offset?: number;
    }): Promise<{
        notifications: Notification[];
        total: number;
        unreadCount: number;
    }>;
    static markAsRead(notificationId: string, userId: string): Promise<Notification>;
    static markAllAsRead(userId: string): Promise<void>;
    static deleteNotification(notificationId: string, userId: string): Promise<void>;
    static deleteReadNotifications(userId: string): Promise<void>;
    static notifyNewEvaluation(studentId: string, teacherName: string, evaluationType: string, score: number): Promise<void>;
    static notifyUpcomingExam(studentIds: string[], examTitle: string, examDate: Date): Promise<void>;
    static notifyAbsence(studentId: string, date: Date, className: string): Promise<void>;
    static notifyCertificateIssued(studentId: string, certificateTitle: string, certificateUrl: string): Promise<void>;
    static notifyStudentAdmission(studentId: string, schoolName: string, className: string): Promise<void>;
}
export default NotificationService;
//# sourceMappingURL=notification.service.d.ts.map