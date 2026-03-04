/**
 * ====================================
 * مسارات تجريبية - Demo Routes
 * للتجربة والاختبار السريع
 * ====================================
 */

import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import bcrypt from 'bcryptjs';

const router = Router();

/**
 * إضافة طالب تجريبي
 * POST /api/v1/demo/create-student
 */
router.post('/create-student', async (_req: Request, res: Response) => {
  try {
    // إنشاء مستخدم + طالب
    const hashedPassword = await bcrypt.hash('123456', 12);

    const student = await prisma.user.create({
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

    // إنشاء سجل تقدم القرآن
    await prisma.quranProgress.create({
      data: {
        studentId: student.student!.id,
      },
    });

    // إنشاء سجل القاعدة النورانية
    await prisma.nooraniProgress.create({
      data: {
        studentId: student.student!.id,
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
        password: '123456', // للتجربة فقط
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'فشل إنشاء الطالب',
      error: error.message,
    });
  }
});

/**
 * إضافة معلم تجريبي
 * POST /api/v1/demo/create-teacher
 */
router.post('/create-teacher', async (_req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash('123456', 12);

    const teacher = await prisma.user.create({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'فشل إنشاء المعلم',
      error: error.message,
    });
  }
});

/**
 * عرض جميع الطلاب
 * GET /api/v1/demo/students
 */
router.get('/students', async (_req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'فشل جلب الطلاب',
      error: error.message,
    });
  }
});

/**
 * عرض جميع المعلمين
 * GET /api/v1/demo/teachers
 */
router.get('/teachers', async (_req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'فشل جلب المعلمين',
      error: error.message,
    });
  }
});

/**
 * إحصائيات النظام
 * GET /api/v1/demo/stats
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [totalUsers, totalStudents, totalTeachers, totalClasses] = await Promise.all([
      prisma.user.count(),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'فشل جلب الإحصائيات',
      error: error.message,
    });
  }
});

/**
 * حذف جميع البيانات التجريبية
 * DELETE /api/v1/demo/reset
 */
router.delete('/reset', async (_req: Request, res: Response) => {
  try {
    // حذف بترتيب معين لتجنب مشاكل Foreign Keys
    await prisma.quranProgress.deleteMany();
    await prisma.nooraniProgress.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    res.json({
      success: true,
      message: 'تم حذف جميع البيانات التجريبية بنجاح!',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'فشل حذف البيانات',
      error: error.message,
    });
  }
});

export default router;
