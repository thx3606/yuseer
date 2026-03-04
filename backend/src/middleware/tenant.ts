/**
 * ====================================
 * Tenant Isolation Middleware
 * ====================================
 * هذا الميدل وير يضمن العزل التام لبيانات الجمعيات
 * (Strict Tenant Data Isolation)
 * بحيث لا يستطيع أي مستخدم الوصول لبيانات جمعية أخرى.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { UserRole } from '@prisma/client';
import { logger } from '../utils/logger';

/**
 * Middleware لضمان أن المستخدم يتبع لجمعية معينة
 * ويتم إرفاق tenantId الخاص به في الطلب ليتم استخدامه في الاستعلامات
 */
export const requireTenant = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'غير مصرح لك بالوصول',
            });
            return;
        }

        // إذا كان المستخدم PLATFORM_OWNER، نتخطى الفحص لأن له صلاحيات على كل النظام
        // ولكن يمكنه تمرير x-tenant-id في الـ Headers لاختيار جمعية معينة بصفته أدمن
        if (req.user.role === UserRole.PLATFORM_OWNER) {
            const requestedTenantId = req.headers['x-tenant-id'] as string;
            if (requestedTenantId) {
                req.user.tenantId = requestedTenantId;
            }
            next();
            return;
        }

        // التحقق من أن المستخدم لديه tenantId
        if (!req.user.tenantId) {
            logger.warn(`User ${req.user.email} attempted to access tenant resources without a tenantId`);
            res.status(403).json({
                success: false,
                message: 'ليس لديك صلاحية للوصول إلى بيانات أي جمعية',
            });
            return;
        }

        // إرفاق الـ tenantId في الطلب (الذي سيتم استخدامه في جميع الـ Services)
        // req.user.tenantId يكون موجوداً مسبقاً من auth.ts

        next();
    } catch (error) {
        logger.error('Tenant isolation validation error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ داخلي في التحقق من صلاحيات الجمعية',
        });
    }
};

/**
 * دالة مساعدة تُضاف إلى Prisma Where clause
 * @param req الطلب
 * @param where استعلام Prisma الأصلي
 * @returns استعلام Prisma مع إضافة tenantId كـ filter إلزامي
 */
export const withTenant = (req: AuthRequest, where: any = {}) => {
    if (req.user && req.user.role !== UserRole.PLATFORM_OWNER) {
        return {
            ...where,
            tenantId: req.user.tenantId,
        };
    }

    // إذا كان PLATFORM_OWNER واختار tenant معين في الهيدر
    if (req.user && req.user.role === UserRole.PLATFORM_OWNER && req.user.tenantId) {
        return {
            ...where,
            tenantId: req.user.tenantId,
        };
    }

    return where;
};
