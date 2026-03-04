export declare class WhatsAppService {
    private static client;
    static initialize(): void;
    static sendMessage(to: string, message: string): Promise<void>;
    static sendWelcomeMessage(to: string, name: string): Promise<void>;
    static sendEvaluationNotification(to: string, studentName: string, evaluationType: string, score: number): Promise<void>;
    static sendAbsenceNotification(to: string, studentName: string, className: string, date: string): Promise<void>;
    static sendExamReminder(to: string, examTitle: string, examDate: string): Promise<void>;
    static sendCertificateNotification(to: string, studentName: string, certificateTitle: string): Promise<void>;
    static sendWeeklyReport(to: string, studentName: string, reportData: {
        attendance: number;
        evaluations: number;
        averageScore: number;
        pagesMemorized: number;
    }): Promise<void>;
    static sendBulkMessages(phoneNumbers: string[], message: string): Promise<void>;
    private static formatPhoneNumber;
}
export default WhatsAppService;
//# sourceMappingURL=whatsapp.service.d.ts.map