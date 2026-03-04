"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.get('/classes-board', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.TEACHER), async (req, res) => {
    try {
        const reqUser = req.user;
        const userId = reqUser.id;
        const tenantId = reqUser.tenantId;
        const teacher = await database_1.default.teacher.findUnique({
            where: { userId }
        });
        if (!teacher) {
            res.status(404).json({ success: false, error: 'لم يتم العثور على ملف المعلم' });
            return;
        }
        const teacherClasses = await database_1.default.teacherClass.findMany({
            where: {
                teacherId: teacher.id,
                class: {
                    tenantId: tenantId,
                    isActive: true
                }
            },
            include: {
                class: {
                    include: {
                        shift: true,
                        students: {
                            where: { isActive: true },
                            include: {
                                student: {
                                    include: {
                                        user: {
                                            include: { profile: true }
                                        },
                                        quranProgress: true,
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
        const shiftsMap = new Map();
        teacherClasses.forEach((tc) => {
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
                students: currentClass.students.map((sc) => {
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
    }
    catch (error) {
        logger_1.logger.error('Error fetching teacher board:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب بينات المعلم' });
    }
});
exports.default = router;
//# sourceMappingURL=teacher.routes.js.map