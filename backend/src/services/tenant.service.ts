/**
 * ====================================
 * خدمة المستأجرين (الجمعيات/المدارس)
 * Tenant Service
 * ====================================
 * لمعالجة تسجيل المستأجرين (جمعيات التحفيظ)،
 * وتفعيلها، وإدارتها من قبل مدير المنصة (Platform Owner)
 * ====================================
 */

import { Tenant, UserRole, TenantStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { logger } from '../utils/logger';

interface RegisterTenantDTO {
    name: string;
    nameAr: string;
    subdomain: string;
    contactEmail: string;
    contactPhone: string;
    address?: string;
    city?: string;
    adminFirstName: string;
    adminLastName: string;
    adminPassword: string;
}

export class TenantService {
    /**
     * تسجيل جمعية جديدة (مستأجر)
     * يتم تعيين الحالة الافتراضية إلى PENDING للمراجعة اليدوية
     */
    static async registerTenant(data: RegisterTenantDTO): Promise<Tenant> {
        try {
            // 1. التحقق من أن النطاق الفرعي والبريد غير مستخدمة مسبقاً
            const existingTenant = await prisma.tenant.findFirst({
                where: {
                    OR: [
                        { subdomain: data.subdomain.toLowerCase() },
                        { contactEmail: data.contactEmail.toLowerCase() },
                    ],
                },
            });

            if (existingTenant) {
                throw new Error('النطاق الفرعي أو البريد الإلكتروني مستخدم بالفعل');
            }

            // 2. التحقق من البريد الإلكتروني للمدير
            const existingUser = await prisma.user.findUnique({
                where: { email: data.contactEmail.toLowerCase() },
            });

            if (existingUser) {
                throw new Error('البريد الإلكتروني للإدارة مسجل كعضو في النظام بالفعل');
            }

            const hashedPassword = await bcrypt.hash(data.adminPassword, 10);

            // 3. إنشاء المستأجر والمستخدم المدير في عملية واحدة (Transaction)
            const newTenant = await prisma.$transaction(async (tx) => {
                // إنشاء المستأجر
                const tenant = await tx.tenant.create({
                    data: {
                        name: data.name,
                        subdomain: data.subdomain.toLowerCase(),
                        contactEmail: data.contactEmail.toLowerCase(),
                        contactPhone: data.contactPhone,
                        status: TenantStatus.PENDING, // تتطلب التفعيل من مالك المنصة
                    },
                });

                // إنشاء المستخدم الإداري (Tenant Admin)
                await tx.user.create({
                    data: {
                        email: data.contactEmail.toLowerCase(),
                        password: hashedPassword,
                        role: UserRole.TENANT_ADMIN,
                        tenantId: tenant.id,
                        isActive: false, // غير نشط حتى يتم تفعيل المستأجر
                        profile: {
                            create: {
                                firstName: data.adminFirstName,
                                lastName: data.adminLastName,
                                firstNameAr: data.adminFirstName,
                                lastNameAr: data.adminLastName,
                                phoneNumber: data.contactPhone,
                            },
                        },
                    },
                });

                return tenant;
            });

            logger.info(`✅ New tenant registered: ${newTenant.name} (${newTenant.subdomain}) by admin ${data.contactEmail}`);

            // هنا يمكن إرسال إيميل تنبيه لمالك المنصة لمراجعة الطلب
            return newTenant;
        } catch (error) {
            logger.error('❌ Error registering tenant:', error);
            throw error;
        }
    }

    /**
     * تفعيل المستأجر (من قبل مالك المنصة)
     */
    static async activateTenant(tenantId: string): Promise<Tenant> {
        try {
            const tenant = await prisma.tenant.findUnique({
                where: { id: tenantId },
            });

            if (!tenant) {
                throw new Error('المستأجر غير موجود');
            }

            if (tenant.status === TenantStatus.ACTIVE) {
                throw new Error('المستأجر مفعل بالفعل');
            }

            const updatedTenant = await prisma.$transaction(async (tx) => {
                // تفعيل المستأجر
                const activated = await tx.tenant.update({
                    where: { id: tenantId },
                    data: { status: TenantStatus.ACTIVE },
                });

                // تفعيل جميع حسابات إدارة المستأجر المرتبطة به
                await tx.user.updateMany({
                    where: { tenantId: tenantId, role: UserRole.TENANT_ADMIN },
                    data: { isActive: true },
                });

                return activated;
            });

            logger.info(`✅ Tenant activated: ${updatedTenant.name}`);
            // هنا يمكن إرسال إيميل تشغيل للمستأجر مع رابط لوحة التحكم
            return updatedTenant;
        } catch (error) {
            logger.error('❌ Error activating tenant:', error);
            throw error;
        }
    }

    /**
     * جلب جميع المستأجرين (مخصص لمالك المنصة)
     */
    static async getAllTenants(filters?: { status?: TenantStatus }): Promise<Tenant[]> {
        try {
            return await prisma.tenant.findMany({
                where: {
                    ...(filters?.status && { status: filters.status }),
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            logger.error('❌ Error fetching all tenants:', error);
            throw error;
        }
    }
}

export default TenantService;
