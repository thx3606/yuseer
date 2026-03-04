/**
 * ====================================
 * خدمة واتساب
 * WhatsApp Service (Twilio)
 * ====================================
 */

import twilio from 'twilio';
import { logger } from '../utils/logger';

export class WhatsAppService {
  private static client: twilio.Twilio;

  /**
   * تهيئة خدمة واتساب
   */
  static initialize(): void {
    try {
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        logger.warn('⚠️ WhatsApp service not configured (Twilio credentials missing)');
        return;
      }

      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      logger.info('✅ WhatsApp service initialized');
    } catch (error) {
      logger.error('❌ WhatsApp service initialization failed:', error);
    }
  }

  /**
   * إرسال رسالة واتساب
   */
  static async sendMessage(to: string, message: string): Promise<void> {
    try {
      if (!this.client) {
        this.initialize();
      }

      if (!this.client) {
        throw new Error('WhatsApp service not initialized');
      }

      // التأكد من أن الرقم بالصيغة الصحيحة
      const formattedNumber = this.formatPhoneNumber(to);

      await this.client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
        to: `whatsapp:${formattedNumber}`,
        body: message,
      });

      logger.info(`WhatsApp message sent to ${formattedNumber}`);
    } catch (error) {
      logger.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  /**
   * إرسال رسالة ترحيب
   */
  static async sendWelcomeMessage(to: string, name: string): Promise<void> {
    const message = `
🕌 *مرحباً بك في نظام مدارس تحفيظ القرآن الكريم*

أهلاً ${name}،

تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول والبدء في استخدام النظام.

📖 نسأل الله أن يبارك في جهودك ويجعل القرآن شفيعاً لك يوم القيامة.

🔗 ${process.env.FRONTEND_URL}
    `.trim();

    await this.sendMessage(to, message);
  }

  /**
   * إرسال إشعار تقييم جديد
   */
  static async sendEvaluationNotification(
    to: string,
    studentName: string,
    evaluationType: string,
    score: number
  ): Promise<void> {
    const message = `
📊 *تقييم جديد*

تم تقييم ${studentName}

📝 نوع التقييم: ${evaluationType}
⭐ الدرجة: ${score}%

يمكنك الاطلاع على التفاصيل الكاملة من خلال النظام.
    `.trim();

    await this.sendMessage(to, message);
  }

  /**
   * إرسال إشعار غياب
   */
  static async sendAbsenceNotification(
    to: string,
    studentName: string,
    className: string,
    date: string
  ): Promise<void> {
    const message = `
⚠️ *إشعار غياب*

غاب ${studentName} عن الفصل ${className}
📅 التاريخ: ${date}

يرجى التواصل مع إدارة المدرسة في حال وجود عذر.
    `.trim();

    await this.sendMessage(to, message);
  }

  /**
   * إرسال إشعار اختبار قريب
   */
  static async sendExamReminder(
    to: string,
    examTitle: string,
    examDate: string
  ): Promise<void> {
    const message = `
📝 *تذكير باختبار قريب*

📚 الاختبار: ${examTitle}
📅 التاريخ: ${examDate}

نتمنى لك التوفيق والنجاح!
وفقك الله وسدد خطاك.
    `.trim();

    await this.sendMessage(to, message);
  }

  /**
   * إرسال إشعار شهادة جديدة
   */
  static async sendCertificateNotification(
    to: string,
    studentName: string,
    certificateTitle: string
  ): Promise<void> {
    const message = `
🏆 *تهانينا! شهادة جديدة*

تم إصدار شهادة "${certificateTitle}" لـ ${studentName}

✨ بارك الله في جهودك وزادك علماً وحفظاً!

يمكنك تحميل الشهادة من خلال النظام.
    `.trim();

    await this.sendMessage(to, message);
  }

  /**
   * إرسال التقرير الأسبوعي
   */
  static async sendWeeklyReport(
    to: string,
    studentName: string,
    reportData: {
      attendance: number;
      evaluations: number;
      averageScore: number;
      pagesMemorized: number;
    }
  ): Promise<void> {
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

  /**
   * إرسال رسائل جماعية
   */
  static async sendBulkMessages(
    phoneNumbers: string[],
    message: string
  ): Promise<void> {
    try {
      const promises = phoneNumbers.map((number) =>
        this.sendMessage(number, message).catch((error) => {
          logger.error(`Failed to send WhatsApp to ${number}:`, error);
        })
      );

      await Promise.allSettled(promises);

      logger.info(`Bulk WhatsApp messages sent to ${phoneNumbers.length} numbers`);
    } catch (error) {
      logger.error('Error sending bulk WhatsApp messages:', error);
      throw error;
    }
  }

  /**
   * تنسيق رقم الهاتف
   */
  private static formatPhoneNumber(phoneNumber: string): string {
    // إزالة المسافات والرموز
    let formatted = phoneNumber.replace(/[\s\-\(\)]/g, '');

    // إذا كان الرقم يبدأ بـ 0، استبدلها برمز الدولة (مثال: السعودية +966)
    if (formatted.startsWith('0')) {
      formatted = '+966' + formatted.substring(1);
    }

    // إذا لم يبدأ بـ +، أضف +
    if (!formatted.startsWith('+')) {
      formatted = '+' + formatted;
    }

    return formatted;
  }
}

export default WhatsAppService;
