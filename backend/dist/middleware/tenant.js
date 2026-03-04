"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTenant = exports.requireTenant = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const requireTenant = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'غير مصرح لك بالوصول',
            });
            return;
        }
        if (req.user.role === client_1.UserRole.PLATFORM_OWNER) {
            const requestedTenantId = req.headers['x-tenant-id'];
            if (requestedTenantId) {
                req.user.tenantId = requestedTenantId;
            }
            next();
            return;
        }
        if (!req.user.tenantId) {
            logger_1.logger.warn(`User ${req.user.email} attempted to access tenant resources without a tenantId`);
            res.status(403).json({
                success: false,
                message: 'ليس لديك صلاحية للوصول إلى بيانات أي جمعية',
            });
            return;
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Tenant isolation validation error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ داخلي في التحقق من صلاحيات الجمعية',
        });
    }
};
exports.requireTenant = requireTenant;
const withTenant = (req, where = {}) => {
    if (req.user && req.user.role !== client_1.UserRole.PLATFORM_OWNER) {
        return {
            ...where,
            tenantId: req.user.tenantId,
        };
    }
    if (req.user && req.user.role === client_1.UserRole.PLATFORM_OWNER && req.user.tenantId) {
        return {
            ...where,
            tenantId: req.user.tenantId,
        };
    }
    return where;
};
exports.withTenant = withTenant;
//# sourceMappingURL=tenant.js.map