"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const twilio_1 = __importDefault(require("twilio"));
const logger_1 = require("../utils/logger");
class WhatsAppService {
    static client;
    static initialize() {
        try {
            if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
                logger_1.logger.warn('⚠️ WhatsApp service not configured (Twilio credentials missing)');
                return;
            }
            this.client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            logger_1.logger.info('✅ WhatsApp service initialized');
        }
        catch (error) {
            logger_1.logger.error('❌ WhatsApp service initialization failed:', error);
        }
    }
    static async sendMessage(to, message) {
        try {
            if (!this.client) {
                this.initialize();
            }
            if (!this.client) {
                throw new Error('WhatsApp service not initialized');
            }
            const formattedNumber = this.formatPhoneNumber(to);
            await this.client.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
                to: `whatsapp:${formattedNumber}`,
                body: message,
            });
            logger_1.logger.info(`WhatsApp message sent to ${formattedNumber}`);
        }
        catch (error) {
            logger_1.logger.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }
    static async sendWelcomeMessage(to, name) {
        const message = `
🕌 *مرحباً بك في نظام مدارس تحفيظ القرآن الكريم*

أهلاً ${name}،

تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول والبدء في استخدام النظام.

📖 نسأل الله أن يبارك في جهودك ويجعل القرآن شفيعاً لك يوم القيامة.

🔗 ${process.env.FRONTEND_URL}
    `.trim();
        await this.sendMessage(to, message);
    }
    static async sendEvaluationNotification(to, studentName, evaluationType, score) {
        const message = `
📊 *تقييم جديد*

تم تقييم ${studentName}

📝 نوع التقييم: ${evaluationType}
⭐ الدرجة: ${score}%

يمكنك الاطلاع على التفاصيل الكاملة من خلال النظام.
    `.trim();
        await this.sendMessage(to, message);
    }
    static async sendAbsenceNotification(to, studentName, className, date) {
        const message = `
⚠️ *إشعار غياب*

غاب ${studentName} عن الفصل ${className}
📅 التاريخ: ${date}

يرجى التواصل مع إدارة المدرسة في حال وجود عذر.
    `.trim();
        await this.sendMessage(to, message);
    }
    static async sendExamReminder(to, examTitle, examDate) {
        const message = `
📝 *تذكير باختبار قريب*

📚 الاختبار: ${examTitle}
📅 التاريخ: ${examDate}

نتمنى لك التوفيق والنجاح!
وفقك الله وسدد خطاك.
    `.trim();
        await this.sendMessage(to, message);
    }
    static async sendCertificateNotification(to, studentName, certificateTitle) {
        const message = `
🏆 *تهانينا! شهادة جديدة*

تم إصدار شهادة "${certificateTitle}" لـ ${studentName}

✨ بارك الله في جهودك وزادك علماً وحفظاً!

يمكنك تحميل الشهادة من خلال النظام.
    `.trim();
        await this.sendMessage(to, message);
    }
    static async sendWeeklyReport(to, studentName, reportData) {
        const message = `
📊 *التقرير الأسبوعي - ${studentName}*

✅ الحضور: ${reportData.attendance}%
📝 عدد التقييمات: ${reportData.evaluations}
⭐ متوسط الدرجات: ${reportData.averageScore}%
📖 الصفحات المحفوظة: ${reportData.pagesMemorized}

بارك الله في جهود ابنك/ابنتك!

للتفاصيل الكاملة: ${process.env.FRONTEND_URL}
    `.trim();
        await this.sendMessage(to, message);
    }
    static async sendBulkMessages(phoneNumbers, message) {
        try {
            const promises = phoneNumbers.map((number) => this.sendMessage(number, message).catch((error) => {
                logger_1.logger.error(`Failed to send WhatsApp to ${number}:`, error);
            }));
            await Promise.allSettled(promises);
            logger_1.logger.info(`Bulk WhatsApp messages sent to ${phoneNumbers.length} numbers`);
        }
        catch (error) {
            logger_1.logger.error('Error sending bulk WhatsApp messages:', error);
            throw error;
        }
    }
    static formatPhoneNumber(phoneNumber) {
        let formatted = phoneNumber.replace(/[\s\-\(\)]/g, '');
        if (formatted.startsWith('0')) {
            formatted = '+966' + formatted.substring(1);
        }
        if (!formatted.startsWith('+')) {
            formatted = '+' + formatted;
        }
        return formatted;
    }
}
exports.WhatsAppService = WhatsAppService;
exports.default = WhatsAppService;
//# sourceMappingURL=whatsapp.service.js.map