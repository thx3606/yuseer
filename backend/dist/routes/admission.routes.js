"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admission_service_1 = require("../services/admission.service");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.post('/enroll', async (req, res) => {
    try {
        const data = req.body;
        if (!data.tenantId || !data.email || !data.firstName || !data.lastName) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة',
            });
        }
        const student = await admission_service_1.AdmissionService.enrollStudent(data);
        return res.status(201).json({
            success: true,
            message: 'تم تسجيلك بنجاح، ملفك الآن في قائمة الانتظار بانتظار الموافقة',
            messageEn: 'Enrolled successfully, pending admin approval',
            data: {
                studentCode: student.studentCode,
                admissionStatus: student.admissionStatus,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('❌ Error in public enrollment:', error);
        return res.status(error.message.includes('مستلزمات') || error.message.includes('مستخدم مسبقاً') ? 409 : 500).json({
            success: false,
            message: error.message || 'حدث خطأ أثناء التسجيل',
        });
    }
});
router.get('/queue', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.TENANT_STAFF), async (req, res) => {
    try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            return res.status(403).json({ success: false, message: 'لا يوجد صلاحية للوصول (tenantId missing)' });
        }
        const queue = await admission_service_1.AdmissionService.getAdmissionQueue(tenantId);
        return res.status(200).json({
            success: true,
            data: queue,
            count: queue.length
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب قائمة الانتظار',
        });
    }
});
exports.default = router;
//# sourceMappingURL=admission.routes.js.map