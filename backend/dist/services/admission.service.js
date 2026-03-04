"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissionService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const generators_1 = require("../utils/generators");
class AdmissionService {
    static async enrollStudent(data) {
        try {
            const tenant = await database_1.default.tenant.findUnique({
                where: { id: data.tenantId },
            });
            if (!tenant || tenant.status !== 'ACTIVE') {
                throw new Error('الجمعية غير موجودة أو غير فعالة حالياً');
            }
            const existingUser = await database_1.default.user.findFirst({
                where: {
                    OR: [
                        { email: data.email.toLowerCase() },
                    ],
                },
            });
            if (existingUser) {
                throw new Error('البريد الإلكتروني للإيقاع مستخدم مسبقاً في النظام');
            }
            const passwordToUse = data.password || data.nationalId || '123456';
            const hashedPassword = await bcryptjs_1.default.hash(passwordToUse, 10);
            const result = await database_1.default.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        email: data.email.toLowerCase(),
                        password: hashedPassword,
                        role: client_1.UserRole.STUDENT,
                        tenantId: data.tenantId,
                        isActive: false,
                        profile: {
                            create: {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                firstNameAr: data.firstName,
                                lastNameAr: data.lastName,
                                gender: data.gender,
                                phoneNumber: data.phoneNumber,
                                dateOfBirth: data.dateOfBirth,
                            },
                        },
                    },
                });
                const studentCode = await (0, generators_1.generateTenantStudentCode)(data.tenantId, tx);
                const student = await tx.student.create({
                    data: {
                        userId: user.id,
                        studentCode: studentCode,
                        status: client_1.StudentStatus.PENDING,
                        admissionStatus: client_1.AdmissionStatus.QUEUE,
                        preferredShift: data.preferredShift,
                        previousMemorization: data.previousMemorization,
                        notes: data.notes,
                    },
                });
                return { user, student };
            });
            logger_1.logger.info(`✅ New student enrolled in queue for tenant ${tenant.name}: ${data.email}`);
            return result.student;
        }
        catch (error) {
            logger_1.logger.error('❌ Error enrolling student:', error);
            throw error;
        }
    }
    static async getAdmissionQueue(tenantId) {
        return await database_1.default.student.findMany({
            where: {
                user: { tenantId },
                admissionStatus: client_1.AdmissionStatus.QUEUE,
            },
            include: {
                user: {
                    include: { profile: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
}
exports.AdmissionService = AdmissionService;
exports.default = AdmissionService;
//# sourceMappingURL=admission.service.js.map