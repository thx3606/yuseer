/**
 * ====================================
 * خدمة التسجيل والقبول (Admission Service)
 * Public Enrollment for Specific Tenants
 * ====================================
 */

import { UserRole, StudentStatus, AdmissionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { generateTenantStudentCode } from '../utils/generators';

interface PublicEnrollmentDTO {
    tenantId: string;
    email: string;
    password?: string; // أحياناً يكون الحساب لولي الأمر ويتم إنشاء الطالب تحته، هنا نفترض الطالب يسجل نفسه
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

export class AdmissionService {
    /**
     * تسجيل طالب جديد عبر الرابط العام (Public Enrollment Endpoint)
     * يتم وضع الطالب في قائمة الانتظار (QUEUE) الخاصة بالجمعية المعنية
     */
    static async enrollStudent(data: PublicEnrollmentDTO): Promise<any> {
        try {
            // 1. التحقق من وجود الجمعية (الـ Tenant)
            const tenant = await prisma.tenant.findUnique({
                where: { id: data.tenantId },
            });

            if (!tenant || tenant.status !== 'ACTIVE') {
                throw new Error('الجمعية غير موجودة أو غير فعالة حالياً');
            }

            // 2. التحقق من البريد الإلكتروني أو الهوية
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: data.email.toLowerCase() },
                        // { nationalId: data.nationalId } // افترضنا أن nationalId موجود في profile في بعض النسخ
                    ],
                },
            });

            if (existingUser) {
                throw new Error('البريد الإلكتروني للإيقاع مستخدم مسبقاً في النظام');
            }

            const passwordToUse = data.password || data.nationalId || '123456';
            const hashedPassword = await bcrypt.hash(passwordToUse, 10);

            // 3. إنشاء الطالب في قائمة الانتظار (Transaction)
            const result = await prisma.$transaction(async (tx) => {
                // إنشاء حساب المستخدم
                const user = await tx.user.create({
                    data: {
                        email: data.email.toLowerCase(),
                        password: hashedPassword,
                        role: UserRole.STUDENT,
                        tenantId: data.tenantId, // ربط المستخدم بالجمعية مباشرة
                        isActive: false, // لا يستطيع الدخول حتى يتفعل
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

                // إنشاء رقم طالبي فريد
                const studentCode = await generateTenantStudentCode(data.tenantId, tx);

                // إنشاء سجل الطالب في الانتظار
                const student = await tx.student.create({
                    data: {
                        userId: user.id,
                        studentCode: studentCode,
                        status: StudentStatus.PENDING,
                        admissionStatus: AdmissionStatus.QUEUE,
                        preferredShift: data.preferredShift,
                        previousMemorization: data.previousMemorization,
                        notes: data.notes,
                    },
                });

                return { user, student };
            });

            logger.info(`✅ New student enrolled in queue for tenant ${tenant.name}: ${data.email}`);
            return result.student;
        } catch (error) {
            logger.error('❌ Error enrolling student:', error);
            throw error;
        }
    }

    /**
     * جلب قائمة الانتظار لجمعية معينة (خاص بإدارة الجمعية)
     */
    static async getAdmissionQueue(tenantId: string): Promise<any[]> {
        return await prisma.student.findMany({
            where: {
                user: { tenantId },
                admissionStatus: AdmissionStatus.QUEUE,
            },
            include: {
                user: {
                    include: { profile: true },
                },
            },
            orderBy: { createdAt: 'asc' }, // الأقدم أولاً
        });
    }
}

export default AdmissionService;
