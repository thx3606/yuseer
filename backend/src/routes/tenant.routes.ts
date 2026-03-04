import { Router, Request, Response } from 'express';
import { TenantService } from '../services/tenant.service';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole, TenantStatus } from '@prisma/client';
import { logger } from '../utils/logger';

const router = Router();

// ====================================
// POST /api/v1/tenants/register
// تسجيل مستأجر جديد (عام/بدون توكن)
// ====================================
router.post('/register', async (req: Request, res: Response) => {
    try {
        const data = req.body;

        // تحقق من الحد الأدنى من الحقول المطلوبة
        const requiredFields = ['name', 'nameAr', 'subdomain', 'contactEmail', 'contactPhone', 'adminFirstName', 'adminLastName', 'adminPassword'];
        const missing = requiredFields.filter(f => !data[f]);
        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'بعض الحقول المطلوبة مفقودة',
                required: missing,
            });
        }

        const tenant = await TenantService.registerTenant(data);

        return res.status(201).json({
            success: true,
            message: 'تم تسجيل طلب الجمعية بنجاح وسيتم المراجعة والتفعيل خلال 48 ساعة',
            messageEn: 'Tenant registered successfully and pending approval',
            data: {
                id: tenant.id,
                subdomain: tenant.subdomain,
                status: tenant.status,
            },
        });
    } catch (error: any) {
        logger.error('❌ Error in POST /tenants/register:', error);
        return res.status(error.message.includes('بالفعل') ? 409 : 500).json({
            success: false,
            message: error.message || 'حدث خطأ داخلي',
        });
    }
});

// ====================================
// PUT /api/v1/tenants/:id/activate
// تفعيل مستأجر (خاص بمدير المنصة)
// ====================================
router.put('/:id/activate', authenticate, authorize(UserRole.PLATFORM_OWNER), async (req: Request, res: Response) => {
    try {
        const tenantId = req.params.id;
        const activatedTenant = await TenantService.activateTenant(tenantId);

        return res.status(200).json({
            success: true,
            message: 'تم تفعيل المستأجر وإنشاء الإدارة الخاصة به بنجاح',
            data: activatedTenant,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || 'حدث خطأ في التفعيل',
        });
    }
});

// ====================================
// GET /api/v1/tenants
// الحصول على جميع المستأجرين (خاص بمدير المنصة)
// ====================================
router.get('/', authenticate, authorize(UserRole.PLATFORM_OWNER), async (req: Request, res: Response) => {
    try {
        const status = req.query.status as TenantStatus;
        const tenants = await TenantService.getAllTenants(status ? { status } : undefined);

        return res.status(200).json({
            success: true,
            data: tenants,
            count: tenants.length
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب المستأجرين',
        });
    }
});

export default router;
