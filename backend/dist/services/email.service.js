"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../utils/logger");
class EmailService {
    static transporter;
    static initialize() {
        try {
            this.transporter = nodemailer_1.default.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            logger_1.logger.info('✅ Email service initialized');
        }
        catch (error) {
            logger_1.logger.error('❌ Email service initialization failed:', error);
        }
    }
    static async sendEmail(options) {
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
            logger_1.logger.info(`Email sent to ${options.to}: ${options.subject}`);
        }
        catch (error) {
            logger_1.logger.error('Error sending email:', error);
            throw error;
        }
    }
    static async sendWelcomeEmail(email, name) {
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
    static async sendPasswordResetEmail(email, resetToken) {
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
    static async sendNotificationEmail(email, title, message) {
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
    static async sendWeeklyReportToGuardian(email, studentName, reportData) {
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
    static stripHtml(html) {
        return html.replace(/<[^>]*>/g, '');
    }
}
exports.EmailService = EmailService;
exports.default = EmailService;
//# sourceMappingURL=email.service.js.map