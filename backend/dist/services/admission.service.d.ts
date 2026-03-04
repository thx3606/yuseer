interface PublicEnrollmentDTO {
    tenantId: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    nationalId?: string;
    phoneNumber?: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth?: Date;
    preferredShift?: string;
    previousMemorization?: string;
    notes?: string;
}
export declare class AdmissionService {
    static enrollStudent(data: PublicEnrollmentDTO): Promise<any>;
    static getAdmissionQueue(tenantId: string): Promise<any[]>;
}
export default AdmissionService;
//# sourceMappingURL=admission.service.d.ts.map