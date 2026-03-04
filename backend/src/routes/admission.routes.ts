import { Router, Request, Response } from 'express';
import { AdmissionService } from '../services/admission.service';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { UserRole } from '@prisma/client';
import { logger } from '../utils/logger';

const router = Router();

// ====================================
// POST /api/v1/admissions/enroll
// تسجيل طالب جديد (عام/Public) يتبع جمعية معينة
// ====================================
router.post('/enroll', async (req: Request, res: Response) => {
    try {
        const data = req.body;

        // في النسخة النهائية، يُستخرج tenantId من الهيدر (x-tenant-id) أو من الدومين الفرعي
        // حاليا نمرره في المخرجات كجزء من payload لتسهيل العملية
        if (!data.tenantId || !data.email || !data.firstName || !data.lastName) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة',
            });
        }

        const student = await AdmissionService.enrollStudent(data);

        return res.status(201).json({
            success: true,
            message: 'تم تسجيلك بنجاح، ملفك الآن في قائمة الانتظار بانتظار الموافقة',
            messageEn: 'Enrolled successfully, pending admin approval',
            data: {
                studentCode: student.studentCode,
                admissionStatus: student.admissionStatus,
            },
        });
    } catch (error: any) {
        logger.error('❌ Error in public enrollment:', error);
        return res.status(error.message.includes('مستلزمات') || error.message.includes('مستخدم مسبقاً') ? 409 : 500).json({
            success: false,
            message: error.message || 'حدث خطأ أثناء التسجيل',
        });
    }
});

// ====================================
// GET /api/v1/admissions/queue
// جلب قائمة الانتظار للمستأجر الحالي
// ====================================
router.get('/queue', authenticate, authorize(UserRole.TENANT_ADMIN, UserRole.TENANT_STAFF), async (req: Request, res: Response) => {
    try {
        const tenantId = (req as AuthRequest).user?.tenantId;
        if (!tenantId) {
            return res.status(403).json({ success: false, message: 'لا يوجد صلاحية للوصول (tenantId missing)' });
        }

        const queue = await AdmissionService.getAdmissionQueue(tenantId);

        return res.status(200).json({
            success: true,
            data: queue,
            count: queue.length
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب قائمة الانتظار',
        });
    }
});

export default router;
