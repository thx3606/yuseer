interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    attachments?: any[];
}
export declare class EmailService {
    private static transporter;
    static initialize(): void;
    static sendEmail(options: EmailOptions): Promise<void>;
    static sendWelcomeEmail(email: string, name: string): Promise<void>;
    static sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    static sendNotificationEmail(email: string, title: string, message: string): Promise<void>;
    static sendWeeklyReportToGuardian(email: string, studentName: string, reportData: any): Promise<void>;
    private static stripHtml;
}
export default EmailService;
//# sourceMappingURL=email.service.d.ts.map