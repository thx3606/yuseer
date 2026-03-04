/**
 * ====================================
 * خدمة الإشعارات
 * Notification Service
 * ====================================
 */

import { Notification, NotificationType } from '@prisma/client';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { EmailService } from './email.service';
import { WhatsAppService } from './whatsapp.service';

interface CreateNotificationDTO {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  sendEmail?: boolean;
  sendWhatsApp?: boolean;
}

export class NotificationService {
  /**
   * إنشاء إشعار
   */
  static async createNotification(data: CreateNotificationDTO): Promise<Notification> {
    try {
      // إنشاء الإشعار في قاعدة البيانات
      const notification = await prisma.notification.create({
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

      // إرسال إشعار عبر البريد الإلكتروني إذا كان مفعلاً
      if (data.sendEmail && process.env.NOTIFICATION_EMAIL_ENABLED === 'true') {
        await EmailService.sendNotificationEmail(
          notification.user.email,
          data.title,
          data.message
        ).catch((error) => {
          logger.error('Error sending notification email:', error);
        });
      }

      // إرسال إشعار عبر واتساب إذا كان مفعلاً
      if (data.sendWhatsApp && process.env.NOTIFICATION_WHATSAPP_ENABLED === 'true') {
        const whatsappNumber = notification.user.profile?.whatsappNumber;
        if (whatsappNumber) {
          await WhatsAppService.sendMessage(
            whatsappNumber,
            `*${data.title}*\n\n${data.message}`
          ).catch((error) => {
            logger.error('Error sending WhatsApp notification:', error);
          });
        }
      }

      logger.info(`Notification created for user ${data.userId}: ${data.title}`);

      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * إنشاء إشعارات متعددة (Bulk)
   */
  static async createBulkNotifications(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      await prisma.notification.createMany({
        data: userIds.map((userId) => ({
          userId,
          type,
          title,
          message,
          data: data || {},
        })),
      });

      logger.info(`Bulk notifications created for ${userIds.length} users: ${title}`);
    } catch (error) {
      logger.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  /**
   * الحصول على إشعارات المستخدم
   */
  static async getUserNotifications(
    userId: string,
    filters?: {
      isRead?: boolean;
      type?: NotificationType;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> {
    try {
      const where: any = {
        userId,
        ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
        ...(filters?.type && { type: filters.type }),
      };

      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: filters?.limit || 20,
          skip: filters?.offset || 0,
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({
          where: { userId, isRead: false },
        }),
      ]);

      return { notifications, total, unreadCount };
    } catch (error) {
      logger.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  /**
   * قراءة إشعار
   */
  static async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        throw new Error('الإشعار غير موجود');
      }

      if (notification.userId !== userId) {
        throw new Error('ليس لديك صلاحية لقراءة هذا الإشعار');
      }

      const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return updated;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * قراءة جميع الإشعارات
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      logger.info(`All notifications marked as read for user ${userId}`);
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * حذف إشعار
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        throw new Error('الإشعار غير موجود');
      }

      if (notification.userId !== userId) {
        throw new Error('ليس لديك صلاحية لحذف هذا الإشعار');
      }

      await prisma.notification.delete({
        where: { id: notificationId },
      });

      logger.info(`Notification ${notificationId} deleted by user ${userId}`);
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * حذف جميع الإشعارات المقروءة
   */
  static async deleteReadNotifications(userId: string): Promise<void> {
    try {
      await prisma.notification.deleteMany({
        where: {
          userId,
          isRead: true,
        },
      });

      logger.info(`All read notifications deleted for user ${userId}`);
    } catch (error) {
      logger.error('Error deleting read notifications:', error);
      throw error;
    }
  }

  /**
   * إشعارات تلقائية: تقييم جديد
   */
  static async notifyNewEvaluation(
    studentId: string,
    teacherName: string,
    evaluationType: string,
    score: number
  ): Promise<void> {
    try {
      await this.createNotification({
        userId: studentId,
        type: NotificationType.EVALUATION,
        title: 'تقييم جديد',
        message: `تم تقييمك من قبل المعلم ${teacherName}. نوع التقييم: ${evaluationType}. الدرجة: ${score}%`,
        data: {
          teacherName,
          evaluationType,
          score,
        },
        sendEmail: true,
      });

      // إرسال إشعار لولي الأمر أيضاً
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { guardian: true },
      });

      if (student?.guardian?.userId) {
        await this.createNotification({
          userId: student.guardian.userId,
          type: NotificationType.EVALUATION,
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
    } catch (error) {
      logger.error('Error sending evaluation notification:', error);
    }
  }

  /**
   * إشعارات تلقائية: اختبار قريب
   */
  static async notifyUpcomingExam(
    studentIds: string[],
    examTitle: string,
    examDate: Date
  ): Promise<void> {
    try {
      await this.createBulkNotifications(
        studentIds,
        NotificationType.EXAM,
        'اختبار قريب',
        `لديك اختبار قريب: ${examTitle}. التاريخ: ${examDate.toLocaleDateString('ar-SA')}`,
        {
          examTitle,
          examDate: examDate.toISOString(),
        }
      );

      logger.info(`Upcoming exam notifications sent to ${studentIds.length} students`);
    } catch (error) {
      logger.error('Error sending upcoming exam notifications:', error);
    }
  }

  /**
   * إشعارات تلقائية: غياب
   */
  static async notifyAbsence(
    studentId: string,
    date: Date,
    className: string
  ): Promise<void> {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { guardian: true },
      });

      if (!student?.guardian?.userId) {
        return;
      }

      await this.createNotification({
        userId: student.guardian.userId,
        type: NotificationType.ATTENDANCE,
        title: 'إشعار غياب',
        message: `غاب ابنك/ابنتك عن الفصل ${className} بتاريخ ${date.toLocaleDateString('ar-SA')}`,
        data: {
          studentId,
          className,
          date: date.toISOString(),
        },
        sendWhatsApp: true,
      });
    } catch (error) {
      logger.error('Error sending absence notification:', error);
    }
  }

  /**
   * إشعارات تلقائية: شهادة جديدة
   */
  static async notifyCertificateIssued(
    studentId: string,
    certificateTitle: string,
    certificateUrl: string
  ): Promise<void> {
    try {
      await this.createNotification({
        userId: studentId,
        type: NotificationType.CERTIFICATE,
        title: 'شهادة جديدة',
        message: `تهانينا! تم إصدار شهادة ${certificateTitle} لك`,
        data: {
          certificateTitle,
          certificateUrl,
        },
        sendEmail: true,
      });

      // إرسال إشعار لولي الأمر
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { guardian: true },
      });

      if (student?.guardian?.userId) {
        await this.createNotification({
          userId: student.guardian.userId,
          type: NotificationType.CERTIFICATE,
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
    } catch (error) {
      logger.error('Error sending certificate notification:', error);
    }
  }

  /**
   * إشعارات تلقائية: قبول طالب جديد
   */
  static async notifyStudentAdmission(
    studentId: string,
    schoolName: string,
    className: string
  ): Promise<void> {
    try {
      await this.createNotification({
        userId: studentId,
        type: NotificationType.ADMISSION,
        title: 'قبول طلبك',
        message: `تم قبولك في ${schoolName} - ${className}. مرحباً بك!`,
        data: {
          schoolName,
          className,
        },
        sendEmail: true,
      });

      // إرسال إشعار لولي الأمر
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { guardian: true },
      });

      if (student?.guardian?.userId) {
        await this.createNotification({
          userId: student.guardian.userId,
          type: NotificationType.ADMISSION,
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
    } catch (error) {
      logger.error('Error sending admission notification:', error);
    }
  }
}

export default NotificationService;
