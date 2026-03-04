"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
router.post('/create-student', async (_req, res) => {
    try {
        const hashedPassword = await bcryptjs_1.default.hash('123456', 12);
        const student = await database_1.default.user.create({
            data: {
                email: `student${Date.now()}@test.com`,
                password: hashedPassword,
                role: 'STUDENT',
                profile: {
                    create: {
                        firstName: 'أحمد',
                        lastName: 'محمد',
                        firstNameAr: 'أحمد',
                        lastNameAr: 'محمد',
                        phoneNumber: '+966501234567',
                        gender: 'MALE',
                        nationality: 'السعودية',
                        city: 'الرياض',
                    },
                },
                student: {
                    create: {
                        studentCode: `STD-${Date.now()}`,
                        status: 'ACTIVE',
                    },
                },
            },
            include: {
                profile: true,
                student: true,
            },
        });
        await database_1.default.quranProgress.create({
            data: {
                studentId: student.student.id,
            },
        });
        await database_1.default.nooraniProgress.create({
            data: {
                studentId: student.student.id,
            },
        });
        res.status(201).json({
            success: true,
            message: 'تم إنشاء الطالب بنجاح!',
            data: {
                id: student.id,
                email: student.email,
                name: `${student.profile?.firstName} ${student.profile?.lastName}`,
                studentCode: student.student?.studentCode,
                password: '123456',
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'فشل إنشاء الطالب',
            error: error.message,
        });
    }
});
router.post('/create-teacher', async (_req, res) => {
    try {
        const hashedPassword = await bcryptjs_1.default.hash('123456', 12);
        const teacher = await database_1.default.user.create({
            data: {
                email: `teacher${Date.now()}@test.com`,
                password: hashedPassword,
                role: 'TEACHER',
                profile: {
                    create: {
                        firstName: 'عبدالله',
                        lastName: 'أحمد',
                        firstNameAr: 'عبدالله',
                        lastNameAr: 'أحمد',
                        phoneNumber: '+966507654321',
                        gender: 'MALE',
                        nationality: 'السعودية',
                        city: 'جدة',
                    },
                },
                teacher: {
                    create: {
                        specialization: 'تحفيظ القرآن الكريم',
                        experienceYears: 5,
                    },
                },
            },
            include: {
                profile: true,
                teacher: true,
            },
        });
        res.status(201).json({
            success: true,
            message: 'تم إنشاء المعلم بنجاح!',
            data: {
                id: teacher.id,
                email: teacher.email,
                name: `${teacher.profile?.firstName} ${teacher.profile?.lastName}`,
                password: '123456',
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'فشل إنشاء المعلم',
            error: error.message,
        });
    }
});
router.get('/students', async (_req, res) => {
    try {
        const students = await database_1.default.student.findMany({
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                quranProgress: true,
            },
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json({
            success: true,
            count: students.length,
            data: students.map((s) => ({
                id: s.id,
                studentCode: s.studentCode,
                name: `${s.user.profile?.firstName} ${s.user.profile?.lastName}`,
                email: s.user.email,
                status: s.status,
                quranProgress: s.quranProgress?.completionPercentage || 0,
                createdAt: s.createdAt,
            })),
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'فشل جلب الطلاب',
            error: error.message,
        });
    }
});
router.get('/teachers', async (_req, res) => {
    try {
        const teachers = await database_1.default.teacher.findMany({
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json({
            success: true,
            count: teachers.length,
            data: teachers.map((t) => ({
                id: t.id,
                name: `${t.user.profile?.firstName} ${t.user.profile?.lastName}`,
                email: t.user.email,
                specialization: t.specialization,
                experienceYears: t.experienceYears,
                createdAt: t.createdAt,
            })),
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'فشل جلب المعلمين',
            error: error.message,
        });
    }
});
router.get('/stats', async (_req, res) => {
    try {
        const [totalUsers, totalStudents, totalTeachers, totalClasses] = await Promise.all([
            database_1.default.user.count(),
            database_1.default.student.count(),
            database_1.default.teacher.count(),
            database_1.default.class.count(),
        ]);
        res.json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalTeachers,
                totalClasses,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'فشل جلب الإحصائيات',
            error: error.message,
        });
    }
});
router.delete('/reset', async (_req, res) => {
    try {
        await database_1.default.quranProgress.deleteMany();
        await database_1.default.nooraniProgress.deleteMany();
        await database_1.default.student.deleteMany();
        await database_1.default.teacher.deleteMany();
        await database_1.default.profile.deleteMany();
        await database_1.default.user.deleteMany();
        res.json({
            success: true,
            message: 'تم حذف جميع البيانات التجريبية بنجاح!',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'فشل حذف البيانات',
            error: error.message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=demo.routes.js.map