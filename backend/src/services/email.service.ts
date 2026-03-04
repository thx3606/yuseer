/**
 * ====================================
 * خدمة البريد الإلكتروني
 * Email Service
 * ====================================
 */

import nodemailer, { Transporter } from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: any[];
}

export class EmailService {
  private static transporter: Transporter;

  /**
   * تهيئة خدمة البريد الإلكتروني
   */
  static initialize(): void {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      logger.info('✅ Email service initialized');
    } catch (error) {
      logger.error('❌ Email service initialization failed:', error);
    }
  }

  /**
   * إرسال بريد إلكتروني
   */
  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      if (!this.transporter) {
        this.initialize();
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'نظام مدارس القرآن <noreply@quranschools.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
        attachments: options.attachments,
      };

      await this.transporter.sendMail(mailOptions);

      logger.info(`Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * إرسال بريد الترحيب
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #4CAF50;
          }
          .header h1 {
            color: #4CAF50;
            margin: 0;
          }
          .content {
            padding: 30px 0;
            line-height: 1.8;
            color: #333;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4CAF50;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕌 نظام إدارة مدارس تحفيظ القرآن الكريم</h1>
          </div>
          <div class="content">
            <h2>مرحباً ${name}،</h2>
            <p>نرحب بك في نظام إدارة مدارس تحفيظ القرآن الكريم والمتون العلمية.</p>
            <p>تم إنشاء حسابك بنجاح ويمكنك الآن تسجيل الدخول والبدء في استخدام النظام.</p>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" class="button">
                تسجيل الدخول
              </a>
            </p>
            <p><strong>نصائح للبدء:</strong></p>
            <ul>
              <li>أكمل ملفك الشخصي</li>
              <li>تصفح الفصول والمعلمين</li>
              <li>ابدأ رحلتك في حفظ كتاب الله</li>
            </ul>
            <p>نسأل الله أن يبارك في جهودكم ويجعل القرآن شفيعاً لكم يوم القيامة.</p>
          </div>
          <div class="footer">
            <p>هذا البريد الإلكتروني تم إرساله تلقائياً، يرجى عدم الرد عليه.</p>
            <p>&copy; 2024 نظام إدارة مدارس تحفيظ القرآن الكريم. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'مرحباً بك في نظام مدارس تحفيظ القرآن',
      html,
    });
  }

  /**
   * إرسال بريد إعادة تعيين كلمة المرور
   */
  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .button { display: inline-block; padding: 15px 30px; background-color: #FF5722; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          h1 { color: #FF5722; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔒 إعادة تعيين كلمة المرور</h1>
          <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
          <p>إذا لم تطلب ذلك، يرجى تجاهل هذا البريد.</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
          </p>
          <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
          <p>أو انسخ الرابط التالي في المتصفح:</p>
          <p style="background: #f0f0f0; padding: 10px; word-break: break-all;">${resetUrl}</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'إعادة تعيين كلمة المرور',
      html,
    });
  }

  /**
   * إرسال إشعار عام
   */
  static async sendNotificationEmail(email: string, title: string, message: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          h1 { color: #2196F3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔔 ${title}</h1>
          <p>${message}</p>
          <hr>
          <p style="color: #999; font-size: 12px;">
            هذا البريد الإلكتروني تم إرساله تلقائياً من نظام مدارس تحفيظ القرآن الكريم.
          </p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: title,
      html,
    });
  }

  /**
   * إرسال تقرير أسبوعي لولي الأمر
   */
  static async sendWeeklyReportToGuardian(
    email: string,
    studentName: string,
    reportData: any
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: right; border-bottom: 1px solid #ddd; }
          th { background-color: #4CAF50; color: white; }
          .stat { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📊 التقرير الأسبوعي - ${studentName}</h1>
          <p>السلام عليكم ورحمة الله وبركاته،</p>
          <p>نرسل لكم التقرير الأسبوعي لأداء ابنك/ابنتك ${studentName}:</p>

          <div class="stat">
            <strong>الحضور:</strong> ${reportData.attendance}%
          </div>

          <div class="stat">
            <strong>عدد التقييمات:</strong> ${reportData.evaluations}
          </div>

          <div class="stat">
            <strong>متوسط الدرجات:</strong> ${reportData.averageScore}%
          </div>

          <div class="stat">
            <strong>الصفحات المحفوظة:</strong> ${reportData.pagesMemorized}
          </div>

          <p>بارك الله في جهود ابنك/ابنتك وزادهم علماً وحفظاً.</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `التقرير الأسبوعي - ${studentName}`,
      html,
    });
  }

  /**
   * إزالة HTML tags من النص
   */
  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}

export default EmailService;
