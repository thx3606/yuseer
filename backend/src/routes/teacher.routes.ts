import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @route GET /api/teacher/classes-board
 * @desc يجلب جميع الفترات والحلقات والطلاب الخاصة بالمعلم في طلب واحد (لعمل Accordion UI بدون تحديث)
 * @access Private (Teacher)
 */
router.get('/classes-board', authenticate, authorize(UserRole.TEACHER), async (req: Request, res: Response) => {
    try {
        const reqUser = (req as any).user;
        const userId = reqUser.id;
        const tenantId = reqUser.tenantId;

        // 1. Get the Teacher record for this user
        const teacher = await prisma.teacher.findUnique({
            where: { userId }
        });

        if (!teacher) {
            res.status(404).json({ success: false, error: 'لم يتم العثور على ملف المعلم' });
            return;
        }

        // 2. Fetch all classes assigned to this teacher with nested students and their progress/last evaluation
        const teacherClasses = await prisma.teacherClass.findMany({
            where: {
                teacherId: teacher.id,
                class: {
                    tenantId: tenantId!, // Ensure tenant isolation
                    isActive: true
                }
            },
            include: {
                class: {
                    include: {
                        shift: true, // For grouping by Shift (الفترة)
                        students: {
                            where: { isActive: true },
                            include: {
                                student: {
                                    include: {
                                        user: {
                                            include: { profile: true }
                                        },
                                        quranProgress: true,
                                        // Fetch only the LAST evaluation to show in the Accordion
                                        quranEvals: {
                                            orderBy: { evaluationDate: 'desc' },
                                            take: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // 3. Format the response to make it easy for the Frontend (Group by Shift)
        const shiftsMap = new Map<string, any>();

        teacherClasses.forEach((tc: any) => {
            const currentClass = tc.class;
            const shiftName = currentClass.shift ? currentClass.shift.name : 'فترة غير محددة';
            const shiftId = currentClass.shift?.id || 'unassigned';

            if (!shiftsMap.has(shiftId)) {
                shiftsMap.set(shiftId, {
                    id: shiftId,
                    name: shiftName,
                    startTime: currentClass.shift?.startTime || '',
                    endTime: currentClass.shift?.endTime || '',
                    classes: []
                });
            }

            const formattedClass = {
                id: currentClass.id,
                name: currentClass.nameAr,
                level: currentClass.level,
                students: currentClass.students.map((sc: any) => {
                    const student = sc.student;
                    const profile = student.user.profile;
                    const lastEval = student.quranEvals[0] || null;

                    return {
                        id: student.id,
                        name: profile ? `${profile.firstName} ${profile.lastName}` : 'طالب غير مسمى',
                        studentCode: student.studentCode,
                        riwayah: student.riwayah || 'حفص عن عاصم',
                        progress: student.quranProgress ? {
                            currentSurah: student.quranProgress.currentSurah,
                            currentJuz: student.quranProgress.currentJuz,
                            currentPage: student.quranProgress.currentPage,
                            lastMemorizedVerse: student.quranProgress.lastMemorizedVerse
                        } : null,
                        lastEvaluation: lastEval ? {
                            id: lastEval.id,
                            type: lastEval.evaluationType,
                            surah: lastEval.surah,
                            fromAyah: lastEval.fromAyah,
                            toAyah: lastEval.toAyah,
                            overallScore: lastEval.overallScore,
                            date: lastEval.evaluationDate
                        } : null
                    };
                })
            };

            shiftsMap.get(shiftId).classes.push(formattedClass);
        });

        const dashboardData = Array.from(shiftsMap.values());

        res.json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        logger.error('Error fetching teacher board:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب بينات المعلم' });
    }
});

export default router;
