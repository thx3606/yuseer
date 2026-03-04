/**
 * ====================================
 * خدمة نظام الرسائل المتعدد
 * Multi-party Messaging Service
 * ====================================
 * يدعم الرسائل بين:
 * - معلم ↔ طالب
 * - معلم ↔ ولي أمر
 * - إداري ↔ معلم
 * - إداري ↔ طالب
 * - إداري ↔ ولي أمر
 * ====================================
 */

import { Message, UserRole } from '@prisma/client';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { NotificationService } from './notification.service';

interface SendMessageDTO {
  senderId: string;
  receiverId: string;
  subject?: string;
  content: string;
  attachments?: string[];
}

interface MessageFilters {
  isRead?: boolean;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}

export class MessagingService {
  /**
   * إرسال رسالة
   */
  static async sendMessage(data: SendMessageDTO): Promise<Message> {
    try {
      // التحقق من وجود المرسل والمستقبل
      const [sender, receiver] = await Promise.all([
        prisma.user.findUnique({
          where: { id: data.senderId },
          include: {
            profile: true,
          },
        }),
        prisma.user.findUnique({
          where: { id: data.receiverId },
          include: {
            profile: true,
          },
        }),
      ]);

      if (!sender || !receiver) {
        throw new Error('المرسل أو المستقبل غير موجود');
      }

      // التحقق من الصلاحيات والعلاقات
      await this.validateMessageRelationship(sender, receiver);

      // إنشاء الرسالة
      const message = await prisma.message.create({
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

      // إرسال إشعار للمستقبل
      await NotificationService.createNotification({
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

      logger.info(`Message sent from ${data.senderId} to ${data.receiverId}`);

      return message;
    } catch (error) {
      logger.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * إرسال رسالة جماعية (Broadcast)
   */
  static async sendBroadcastMessage(
    senderId: string,
    receiverIds: string[],
    subject: string,
    content: string,
    attachments?: string[]
  ): Promise<Message[]> {
    try {
      const sender = await prisma.user.findUnique({
        where: { id: senderId },
        include: { profile: true },
      });

      if (!sender) {
        throw new Error('المرسل غير موجود');
      }

      // التحقق من أن المرسل لديه صلاحية إرسال رسائل جماعية
      if (
        sender.role !== UserRole.PLATFORM_OWNER &&
        sender.role !== UserRole.TENANT_ADMIN &&
        sender.role !== UserRole.TENANT_STAFF &&
        sender.role !== UserRole.TEACHER
      ) {
        throw new Error('ليس لديك صلاحية لإرسال رسائل جماعية');
      }

      // إنشاء الرسائل
      const messages = await Promise.all(
        receiverIds.map((receiverId) =>
          prisma.message.create({
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
          })
        )
      );

      // إرسال إشعارات
      await Promise.all(
        messages.map((message) =>
          NotificationService.createNotification({
            userId: message.receiverId,
            type: 'MESSAGE',
            title: 'رسالة جديدة',
            message: `لديك رسالة جديدة من ${sender.profile?.firstName} ${sender.profile?.lastName}`,
            data: {
              messageId: message.id,
              senderId,
            },
          })
        )
      );

      logger.info(`Broadcast message sent from ${senderId} to ${receiverIds.length} recipients`);

      return messages;
    } catch (error) {
      logger.error('Error sending broadcast message:', error);
      throw error;
    }
  }

  /**
   * الحصول على الرسائل الواردة
   */
  static async getInboxMessages(
    userId: string,
    filters?: MessageFilters
  ): Promise<{ messages: Message[]; total: number; unreadCount: number }> {
    try {
      const where: any = {
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
        prisma.message.findMany({
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
        prisma.message.count({ where }),
        prisma.message.count({
          where: { receiverId: userId, isRead: false },
        }),
      ]);

      return { messages, total, unreadCount };
    } catch (error) {
      logger.error('Error fetching inbox messages:', error);
      throw error;
    }
  }

  /**
   * الحصول على الرسائل المرسلة
   */
  static async getSentMessages(
    userId: string,
    filters?: MessageFilters
  ): Promise<{ messages: Message[]; total: number }> {
    try {
      const where: any = {
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
        prisma.message.findMany({
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
        prisma.message.count({ where }),
      ]);

      return { messages, total };
    } catch (error) {
      logger.error('Error fetching sent messages:', error);
      throw error;
    }
  }

  /**
   * الحصول على محادثة بين مستخدمين
   */
  static async getConversation(
    userId1: string,
    userId2: string,
    limit: number = 50
  ): Promise<Message[]> {
    try {
      const messages = await prisma.message.findMany({
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

      // وضع علامة مقروء على الرسائل التي استلمها userId1
      await prisma.message.updateMany({
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
    } catch (error) {
      logger.error('Error fetching conversation:', error);
      throw error;
    }
  }

  /**
   * قراءة رسالة
   */
  static async markAsRead(messageId: string, userId: string): Promise<Message> {
    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        throw new Error('الرسالة غير موجودة');
      }

      if (message.receiverId !== userId) {
        throw new Error('ليس لديك صلاحية لقراءة هذه الرسالة');
      }

      const updated = await prisma.message.update({
        where: { id: messageId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return updated;
    } catch (error) {
      logger.error('Error marking message as read:', error);
      throw error;
    }
  }

  /**
   * قراءة جميع الرسائل
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      await prisma.message.updateMany({
        where: {
          receiverId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      logger.info(`All messages marked as read for user ${userId}`);
    } catch (error) {
      logger.error('Error marking all messages as read:', error);
      throw error;
    }
  }

  /**
   * حذف رسالة
   */
  static async deleteMessage(messageId: string, userId: string): Promise<void> {
    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        throw new Error('الرسالة غير موجودة');
      }

      // التحقق من أن المستخدم هو المرسل أو المستقبل
      if (message.senderId !== userId && message.receiverId !== userId) {
        throw new Error('ليس لديك صلاحية لحذف هذه الرسالة');
      }

      await prisma.message.delete({
        where: { id: messageId },
      });

      logger.info(`Message ${messageId} deleted by user ${userId}`);
    } catch (error) {
      logger.error('Error deleting message:', error);
      throw error;
    }
  }

  /**
   * إرسال رسالة لجميع أولياء أمور طلاب فصل معين
   */
  static async sendMessageToClassGuardians(
    senderId: string,
    classId: string,
    subject: string,
    content: string
  ): Promise<Message[]> {
    try {
      // الحصول على جميع الطلاب في الفصل
      const studentClasses = await prisma.studentClass.findMany({
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

      // الحصول على أولياء الأمور
      const guardianIds = studentClasses
        .map((sc) => sc.student.guardian?.userId)
        .filter((id): id is string => id !== undefined && id !== null);

      // إزالة التكرار
      const uniqueGuardianIds = [...new Set(guardianIds)];

      // إرسال الرسائل
      const messages = await this.sendBroadcastMessage(
        senderId,
        uniqueGuardianIds,
        subject,
        content
      );

      logger.info(
        `Message sent to ${uniqueGuardianIds.length} guardians of class ${classId}`
      );

      return messages;
    } catch (error) {
      logger.error('Error sending message to class guardians:', error);
      throw error;
    }
  }

  /**
   * التحقق من العلاقة بين المرسل والمستقبل
   */
  private static async validateMessageRelationship(sender: any, receiver: any): Promise<void> {
    // المدير العام يمكنه إرسال رسائل لأي شخص
    if (sender.role === UserRole.PLATFORM_OWNER) {
      return;
    }

    // إداري الجمعية يمكنه إرسال رسائل لأي شخص في جمعيته
    if (sender.role === UserRole.TENANT_ADMIN || sender.role === UserRole.TENANT_STAFF) {
      return;
    }

    // المعلم يمكنه إرسال رسائل للطلاب، أولياء الأمور، والإداريين
    if (sender.role === UserRole.TEACHER) {
      if (
        receiver.role === UserRole.STUDENT ||
        receiver.role === UserRole.PARENT ||
        receiver.role === UserRole.TENANT_ADMIN ||
        receiver.role === UserRole.PLATFORM_OWNER ||
        receiver.role === UserRole.TENANT_STAFF
      ) {
        return;
      }
      throw new Error('لا يمكنك إرسال رسالة لهذا المستخدم');
    }

    // الطالب يمكنه إرسال رسائل للمعلمين والإداريين فقط
    if (sender.role === UserRole.STUDENT) {
      if (
        receiver.role === UserRole.TEACHER ||
        receiver.role === UserRole.TENANT_ADMIN ||
        receiver.role === UserRole.PLATFORM_OWNER ||
        receiver.role === UserRole.TENANT_STAFF
      ) {
        return;
      }
      throw new Error('لا يمكنك إرسال رسالة لهذا المستخدم');
    }

    // ولي الأمر يمكنه إرسال رسائل للمعلمين والإداريين
    if (sender.role === UserRole.PARENT) {
      if (
        receiver.role === UserRole.TEACHER ||
        receiver.role === UserRole.TENANT_ADMIN ||
        receiver.role === UserRole.PLATFORM_OWNER ||
        receiver.role === UserRole.TENANT_STAFF
      ) {
        return;
      }
      throw new Error('لا يمكنك إرسال رسالة لهذا المستخدم');
    }

    throw new Error('لا يمكنك إرسال رسالة لهذا المستخدم');
  }

  /**
   * البحث في الرسائل
   */
  static async searchMessages(
    userId: string,
    query: string,
    searchIn: 'inbox' | 'sent' | 'both' = 'both'
  ): Promise<Message[]> {
    try {
      const where: any = {
        OR: [
          { subject: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (searchIn === 'inbox') {
        where.receiverId = userId;
      } else if (searchIn === 'sent') {
        where.senderId = userId;
      } else {
        where.OR = [
          ...where.OR.map((condition: any) => ({ ...condition, receiverId: userId })),
          ...where.OR.map((condition: any) => ({ ...condition, senderId: userId })),
        ];
      }

      const messages = await prisma.message.findMany({
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
    } catch (error) {
      logger.error('Error searching messages:', error);
      throw error;
    }
  }
}

export default MessagingService;
