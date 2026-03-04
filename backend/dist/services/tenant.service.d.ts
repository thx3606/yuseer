import { Tenant, TenantStatus } from '@prisma/client';
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
export declare class TenantService {
    static registerTenant(data: RegisterTenantDTO): Promise<Tenant>;
    static activateTenant(tenantId: string): Promise<Tenant>;
    static getAllTenants(filters?: {
        status?: TenantStatus;
    }): Promise<Tenant[]>;
}
export default TenantService;
//# sourceMappingURL=tenant.service.d.ts.map