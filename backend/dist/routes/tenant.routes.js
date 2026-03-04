"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tenant_service_1 = require("../services/tenant.service");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const data = req.body;
        const requiredFields = ['name', 'nameAr', 'subdomain', 'contactEmail', 'contactPhone', 'adminFirstName', 'adminLastName', 'adminPassword'];
        const missing = requiredFields.filter(f => !data[f]);
        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'بعض الحقول المطلوبة مفقودة',
                required: missing,
            });
        }
        const tenant = await tenant_service_1.TenantService.registerTenant(data);
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
    }
    catch (error) {
        logger_1.logger.error('❌ Error in POST /tenants/register:', error);
        return res.status(error.message.includes('بالفعل') ? 409 : 500).json({
            success: false,
            message: error.message || 'حدث خطأ داخلي',
        });
    }
});
router.put('/:id/activate', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.PLATFORM_OWNER), async (req, res) => {
    try {
        const tenantId = req.params.id;
        const activatedTenant = await tenant_service_1.TenantService.activateTenant(tenantId);
        return res.status(200).json({
            success: true,
            message: 'تم تفعيل المستأجر وإنشاء الإدارة الخاصة به بنجاح',
            data: activatedTenant,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'حدث خطأ في التفعيل',
        });
    }
});
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.PLATFORM_OWNER), async (req, res) => {
    try {
        const status = req.query.status;
        const tenants = await tenant_service_1.TenantService.getAllTenants(status ? { status } : undefined);
        return res.status(200).json({
            success: true,
            data: tenants,
            count: tenants.length
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب المستأجرين',
        });
    }
});
exports.default = router;
//# sourceMappingURL=tenant.routes.js.map