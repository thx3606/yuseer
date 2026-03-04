import { Message } from '@prisma/client';
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
export declare class MessagingService {
    static sendMessage(data: SendMessageDTO): Promise<Message>;
    static sendBroadcastMessage(senderId: string, receiverIds: string[], subject: string, content: string, attachments?: string[]): Promise<Message[]>;
    static getInboxMessages(userId: string, filters?: MessageFilters): Promise<{
        messages: Message[];
        total: number;
        unreadCount: number;
    }>;
    static getSentMessages(userId: string, filters?: MessageFilters): Promise<{
        messages: Message[];
        total: number;
    }>;
    static getConversation(userId1: string, userId2: string, limit?: number): Promise<Message[]>;
    static markAsRead(messageId: string, userId: string): Promise<Message>;
    static markAllAsRead(userId: string): Promise<void>;
    static deleteMessage(messageId: string, userId: string): Promise<void>;
    static sendMessageToClassGuardians(senderId: string, classId: string, subject: string, content: string): Promise<Message[]>;
    private static validateMessageRelationship;
    static searchMessages(userId: string, query: string, searchIn?: 'inbox' | 'sent' | 'both'): Promise<Message[]>;
}
export default MessagingService;
//# sourceMappingURL=messaging.service.d.ts.map