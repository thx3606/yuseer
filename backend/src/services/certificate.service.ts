/**
 * ====================================
 * خدمة إصدار الشهادات (Certificates Service)
 * ====================================
 * هذه الخدمة مسؤولة عن توليد ملفات PDF لشهادات الطلاب بصيغة احترافية
 * لدعم متطلبات تطبيق يسر (فخامة ورقي التصميم).
 */

import { TenantStatus } from '@prisma/client';
import prisma from '../config/database';
import { logger } from '../utils/logger';

// ملاحظة: في بيئة الإنتاج يفضل تثبيت 'puppeteer' أو 'html-pdf-node'
// npm install puppeteer

export class CertificateService {

    /**
     * دالة مساعدة للحصول على قالب HTML جاهز للشهادة
     */
    private static getCertificateHtml(
        studentName: string,
        courseName: string,
        grade: string,
        date: string,
        tenantName: string
    ): string {
        return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <style>
              body { font-family: 'Tajawal', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
              .certificate { width: 800px; height: 600px; padding: 40px; border: 15px solid #059669; box-sizing: border-box; position: relative; background: #fff; margin: auto; }
              .bg-pattern { position: absolute; top:0; left:0; right:0; bottom:0; opacity: 0.05; background-image: url('https://www.transparenttextures.com/patterns/arabesque.png'); pointer-events: none; }
              .header { text-align: center; color: #059669; font-size: 32px; font-weight: bold; margin-bottom: 20px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }
              .sub-header { text-align: center; color: #D4AF37; font-size: 20px; margin-bottom: 40px; }
              .content { text-align: center; line-height: 2; font-size: 20px; color: #334155; }
              .name { font-size: 36px; font-weight: bold; color: #0f172a; margin: 20px 0; text-decoration: underline decoration-color: #D4AF37; }
              .footer { position: absolute; bottom: 50px; left: 50px; right: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
              .signature { border-top: 1px solid #94a3b8; width: 200px; text-align: center; padding-top: 10px; font-weight: bold; color: #0f172a; }
          </style>
      </head>
      <body>
          <div class="certificate">
              <div class="bg-pattern"></div>
              <div class="header">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
              <div class="sub-header">شهادة اجتياز وحفظ</div>
              
              <div class="content">
                  تشهد <strong>${tenantName}</strong><br/>
                  بأن الطالب/الطالبة:<br/>
                  <div class="name">${studentName}</div>
                  قد أتم ولله الحمد حفظ/دراسة <strong>${courseName}</strong><br/>
                  بتقدير: <strong>${grade}</strong><br/>
                  سائلين المولى عز وجل له التوفيق والسداد في الدارين.
              </div>

              <div class="footer">
                  <div class="signature">تاريخ الإصدار<br/>${date}</div>
                  <div class="signature">ختم الجمعية</div>
                  <div class="signature">مدير الجمعية<br/></div>
              </div>
          </div>
      </body>
      </html>
    `;
    }

    /**
     * إصدار الشهادة بصيغة PDF
     */
    public static async generatePdfCertificate(
        tenantId: string,
        studentId: string,
        examId: string
    ): Promise<Buffer> {
        try {
            // 1. استدعاء بيانات الطالب والجمعية
            const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
            const student = await prisma.user.findUnique({ where: { id: studentId } });

            // هنا نفترض جلب بيانات الاختبار الفعلي لكن سنستخدم بيانات وهمية للتوضيح
            const courseName = "القرآن الكريم - خمسة أجزاء";
            const grade = "ممتاز مرتفع";
            const date = new Date().toLocaleDateString('ar-SA');
            const tenantName = tenant?.name || "جمعية تحفيظ القرآن الكريم";
            const studentFullName = student?.firstName ? `${student.firstName} ${student.lastName}` : "طالب القرآن";

            // 2. بناء الـ HTML
            const htmlContent = this.getCertificateHtml(studentFullName, courseName, grade, date, tenantName);

            // 3. تحويل الـ HTML إلى PDF
            // In a real implementation:
            // const browser = await puppeteer.launch();
            // const page = await browser.newPage();
            // await page.setContent(htmlContent);
            // const pdfBuffer = await page.pdf({ format: 'A4', landscape: true });
            // await browser.close();
            // return pdfBuffer;

            logger.info(`تم إعداد قالب الشهادة بنجاح للطالب ${studentFullName}`);

            // نرجع Buffer وهمي في الديمو
            return Buffer.from(htmlContent);

        } catch (error) {
            logger.error('Error generating PDF certificate:', error);
            throw new Error('فشل في عملية إصدار الشهادة');
        }
    }
}
