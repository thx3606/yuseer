"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
class TenantService {
    static async registerTenant(data) {
        try {
            const existingTenant = await database_1.default.tenant.findFirst({
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
            const existingUser = await database_1.default.user.findUnique({
                where: { email: data.contactEmail.toLowerCase() },
            });
            if (existingUser) {
                throw new Error('البريد الإلكتروني للإدارة مسجل كعضو في النظام بالفعل');
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.adminPassword, 10);
            const newTenant = await database_1.default.$transaction(async (tx) => {
                const tenant = await tx.tenant.create({
                    data: {
                        name: data.name,
                        subdomain: data.subdomain.toLowerCase(),
                        contactEmail: data.contactEmail.toLowerCase(),
                        contactPhone: data.contactPhone,
                        status: client_1.TenantStatus.PENDING,
                    },
                });
                await tx.user.create({
                    data: {
                        email: data.contactEmail.toLowerCase(),
                        password: hashedPassword,
                        role: client_1.UserRole.TENANT_ADMIN,
                        tenantId: tenant.id,
                        isActive: false,
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
            logger_1.logger.info(`✅ New tenant registered: ${newTenant.name} (${newTenant.subdomain}) by admin ${data.contactEmail}`);
            return newTenant;
        }
        catch (error) {
            logger_1.logger.error('❌ Error registering tenant:', error);
            throw error;
        }
    }
    static async activateTenant(tenantId) {
        try {
            const tenant = await database_1.default.tenant.findUnique({
                where: { id: tenantId },
            });
            if (!tenant) {
                throw new Error('المستأجر غير موجود');
            }
            if (tenant.status === client_1.TenantStatus.ACTIVE) {
                throw new Error('المستأجر مفعل بالفعل');
            }
            const updatedTenant = await database_1.default.$transaction(async (tx) => {
                const activated = await tx.tenant.update({
                    where: { id: tenantId },
                    data: { status: client_1.TenantStatus.ACTIVE },
                });
                await tx.user.updateMany({
                    where: { tenantId: tenantId, role: client_1.UserRole.TENANT_ADMIN },
                    data: { isActive: true },
                });
                return activated;
            });
            logger_1.logger.info(`✅ Tenant activated: ${updatedTenant.name}`);
            return updatedTenant;
        }
        catch (error) {
            logger_1.logger.error('❌ Error activating tenant:', error);
            throw error;
        }
    }
    static async getAllTenants(filters) {
        try {
            return await database_1.default.tenant.findMany({
                where: {
                    ...(filters?.status && { status: filters.status }),
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Error fetching all tenants:', error);
            throw error;
        }
    }
}
exports.TenantService = TenantService;
exports.default = TenantService;
//# sourceMappingURL=tenant.service.js.map