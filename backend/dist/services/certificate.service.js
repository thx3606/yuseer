"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
class CertificateService {
    static getCertificateHtml(studentName, courseName, grade, date, tenantName) {
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
    static async generatePdfCertificate(tenantId, studentId, _examId) {
        try {
            const tenant = await database_1.default.tenant.findUnique({ where: { id: tenantId } });
            const student = await database_1.default.user.findUnique({
                where: { id: studentId },
                include: { profile: true }
            });
            const courseName = "القرآن الكريم - خمسة أجزاء";
            const grade = "ممتاز مرتفع";
            const date = new Date().toLocaleDateString('ar-SA');
            const tenantName = tenant?.name || "جمعية تحفيظ القرآن الكريم";
            const studentFullName = student?.profile?.firstName ? `${student.profile.firstName} ${student.profile.lastName}` : "طالب القرآن";
            const htmlContent = this.getCertificateHtml(studentFullName, courseName, grade, date, tenantName);
            logger_1.logger.info(`تم إعداد قالب الشهادة بنجاح للطالب ${studentFullName}`);
            return Buffer.from(htmlContent);
        }
        catch (error) {
            logger_1.logger.error('Error generating PDF certificate:', error);
            throw new Error('فشل في عملية إصدار الشهادة');
        }
    }
}
exports.CertificateService = CertificateService;
//# sourceMappingURL=certificate.service.js.map