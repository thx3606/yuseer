"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const date_fns_1 = require("date-fns");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ReportsService {
    static async getDailyAttendanceReport(classId, date) {
        try {
            const targetDate = date || new Date();
            const startDate = (0, date_fns_1.startOfDay)(targetDate);
            const endDate = (0, date_fns_1.endOfDay)(targetDate);
            const where = {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                ...(classId && { classId }),
            };
            const attendances = await database_1.default.attendance.findMany({
                where,
                include: {
                    student: {
                        include: {
                            user: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    },
                    class: true,
                },
            });
            const summary = {
                totalStudents: attendances.length,
                present: attendances.filter((a) => a.status === 'PRESENT').length,
                absent: attendances.filter((a) => a.status === 'ABSENT').length,
                late: attendances.filter((a) => a.status === 'LATE').length,
                excused: attendances.filter((a) => a.status === 'EXCUSED').length,
                attendanceRate: 0,
            };
            summary.attendanceRate = attendances.length > 0
                ? Math.round((summary.present / summary.totalStudents) * 100)
                : 0;
            return {
                date: targetDate.toISOString(),
                summary,
                details: attendances,
            };
        }
        catch (error) {
            logger_1.logger.error('Error generating daily attendance report:', error);
            throw error;
        }
    }
    static async getWeeklyPerformanceReport(classId, weekStart) {
        try {
            const targetWeekStart = weekStart || new Date();
            const startDate = (0, date_fns_1.startOfWeek)(targetWeekStart);
            const endDate = (0, date_fns_1.endOfWeek)(targetWeekStart);
            const evaluations = await database_1.default.quranEvaluation.findMany({
                where: {
                    evaluationDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(classId && {
                        student: {
                            classes: {
                                some: {
                                    classId,
                                    isActive: true,
                                },
                            },
                        },
                    }),
                },
                include: {
                    student: {
                        include: {
                            user: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    },
                },
            });
            const studentsPerformance = this.aggregateStudentPerformance(evaluations);
            return {
                weekStart: startDate.toISOString(),
                weekEnd: endDate.toISOString(),
                totalEvaluations: evaluations.length,
                studentsPerformance,
            };
        }
        catch (error) {
            logger_1.logger.error('Error generating weekly performance report:', error);
            throw error;
        }
    }
    static async getMonthlyReport(tenantId, month) {
        try {
            const targetMonth = month || new Date();
            const startDate = (0, date_fns_1.startOfMonth)(targetMonth);
            const endDate = (0, date_fns_1.endOfMonth)(targetMonth);
            const studentsStats = await this.getStudentsStatistics(tenantId, startDate, endDate);
            const attendanceStats = await this.getAttendanceStatistics(startDate, endDate);
            const evaluationStats = await this.getEvaluationStatistics(startDate, endDate);
            const certificatesIssued = await database_1.default.issuedCertificate.count({
                where: {
                    issueDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            return {
                month: targetMonth.toISOString(),
                studentsStats,
                attendanceStats,
                evaluationStats,
                certificatesIssued,
            };
        }
        catch (error) {
            logger_1.logger.error('Error generating monthly report:', error);
            throw error;
        }
    }
    static async getAnnualReport(_tenantId, year) {
        try {
            const targetYear = year || new Date().getFullYear();
            const startDate = (0, date_fns_1.startOfYear)(new Date(targetYear, 0, 1));
            const endDate = (0, date_fns_1.endOfYear)(new Date(targetYear, 11, 31));
            const totalStudents = await database_1.default.student.count({
                where: {
                    enrollmentDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const graduatedStudents = await database_1.default.student.count({
                where: {
                    status: 'GRADUATED',
                    updatedAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const totalEvaluations = await database_1.default.quranEvaluation.count({
                where: {
                    evaluationDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const totalCertificates = await database_1.default.issuedCertificate.count({
                where: {
                    issueDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const attendances = await database_1.default.attendance.findMany({
                where: {
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const attendanceRate = attendances.length > 0
                ? Math.round((attendances.filter((a) => a.status === 'PRESENT').length / attendances.length) * 100)
                : 0;
            return {
                year: targetYear,
                totalStudents,
                graduatedStudents,
                totalEvaluations,
                totalCertificates,
                attendanceRate,
            };
        }
        catch (error) {
            logger_1.logger.error('Error generating annual report:', error);
            throw error;
        }
    }
    static async getNationalityReport() {
        try {
            const students = await database_1.default.student.findMany({
                where: {
                    status: 'ACTIVE',
                },
                include: {
                    user: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
            const nationalityDistribution = students.reduce((acc, student) => {
                const nationality = student.user.profile?.nationality || 'غير محدد';
                acc[nationality] = (acc[nationality] || 0) + 1;
                return acc;
            }, {});
            const sorted = Object.entries(nationalityDistribution)
                .map(([nationality, count]) => ({
                nationality,
                count,
                percentage: Math.round((count / students.length) * 100),
            }))
                .sort((a, b) => b.count - a.count);
            return {
                totalStudents: students.length,
                distribution: sorted,
            };
        }
        catch (error) {
            logger_1.logger.error('Error generating nationality report:', error);
            throw error;
        }
    }
    static async getAgeDistributionReport() {
        try {
            const students = await database_1.default.student.findMany({
                where: {
                    status: 'ACTIVE',
                },
                include: {
                    user: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
            const ageGroups = {
                '5-10': 0,
                '11-15': 0,
                '16-20': 0,
                '21-30': 0,
                '30+': 0,
                'غير محدد': 0,
            };
            students.forEach((student) => {
                const dob = student.user.profile?.dateOfBirth;
                if (!dob) {
                    ageGroups['غير محدد']++;
                    return;
                }
                const age = new Date().getFullYear() - new Date(dob).getFullYear();
                if (age >= 5 && age <= 10)
                    ageGroups['5-10']++;
                else if (age >= 11 && age <= 15)
                    ageGroups['11-15']++;
                else if (age >= 16 && age <= 20)
                    ageGroups['16-20']++;
                else if (age >= 21 && age <= 30)
                    ageGroups['21-30']++;
                else if (age > 30)
                    ageGroups['30+']++;
            });
            return {
                totalStudents: students.length,
                ageGroups,
            };
        }
        catch (error) {
            logger_1.logger.error('Error generating age distribution report:', error);
            throw error;
        }
    }
    static async getTeacherPerformanceReport(teacherId, startDate, endDate) {
        try {
            const start = startDate || (0, date_fns_1.startOfMonth)(new Date());
            const end = endDate || (0, date_fns_1.endOfMonth)(new Date());
            const evaluations = await database_1.default.quranEvaluation.findMany({
                where: {
                    teacherId,
                    evaluationDate: {
                        gte: start,
                        lte: end,
                    },
                },
                include: {
                    student: {
                        include: {
                            user: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    },
                },
            });
            const totalEvaluations = evaluations.length;
            const averageScore = totalEvaluations > 0
                ? evaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) / totalEvaluations
                : 0;
            const studentsEvaluated = new Set(evaluations.map((e) => e.studentId)).size;
            return {
                teacherId,
                period: { start, end },
                totalEvaluations,
                studentsEvaluated,
                averageScore: Math.round(averageScore * 10) / 10,
                evaluationsByType: this.groupEvaluationsByType(evaluations),
            };
        }
        catch (error) {
            logger_1.logger.error('Error generating teacher performance report:', error);
            throw error;
        }
    }
    static async exportToExcel(reportType, data) {
        try {
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('التقرير');
            worksheet.mergeCells('A1:D1');
            worksheet.getCell('A1').value = `تقرير ${reportType}`;
            worksheet.getCell('A1').font = { size: 16, bold: true };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };
            worksheet.mergeCells('A2:D2');
            worksheet.getCell('A2').value = `تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}`;
            worksheet.getCell('A2').alignment = { horizontal: 'center' };
            this.addDataToWorksheet(worksheet, data);
            const reportsDir = process.env.REPORTS_DIR || './reports';
            if (!fs_1.default.existsSync(reportsDir)) {
                fs_1.default.mkdirSync(reportsDir, { recursive: true });
            }
            const filename = `report_${reportType}_${Date.now()}.xlsx`;
            const filepath = path_1.default.join(reportsDir, filename);
            await workbook.xlsx.writeFile(filepath);
            logger_1.logger.info(`Report exported to Excel: ${filename}`);
            return filepath;
        }
        catch (error) {
            logger_1.logger.error('Error exporting report to Excel:', error);
            throw error;
        }
    }
    static aggregateStudentPerformance(evaluations) {
        const studentMap = new Map();
        evaluations.forEach((evaluation) => {
            const studentId = evaluation.studentId;
            if (!studentMap.has(studentId)) {
                studentMap.set(studentId, {
                    student: evaluation.student,
                    evaluations: [],
                    averageScore: 0,
                });
            }
            studentMap.get(studentId).evaluations.push(evaluation);
        });
        const result = [];
        studentMap.forEach((data) => {
            const avgScore = data.evaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) /
                data.evaluations.length;
            result.push({
                student: data.student,
                evaluationCount: data.evaluations.length,
                averageScore: Math.round(avgScore * 10) / 10,
            });
        });
        return result.sort((a, b) => b.averageScore - a.averageScore);
    }
    static async getStudentsStatistics(_tenantId, startDate, endDate) {
        const totalStudents = await database_1.default.student.count({
            where: {
                status: 'ACTIVE',
            },
        });
        const newStudents = startDate && endDate
            ? await database_1.default.student.count({
                where: {
                    enrollmentDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            })
            : 0;
        return {
            totalStudents,
            newStudents,
        };
    }
    static async getAttendanceStatistics(startDate, endDate) {
        const attendances = await database_1.default.attendance.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const present = attendances.filter((a) => a.status === 'PRESENT').length;
        const absent = attendances.filter((a) => a.status === 'ABSENT').length;
        return {
            total: attendances.length,
            present,
            absent,
            rate: attendances.length > 0 ? Math.round((present / attendances.length) * 100) : 0,
        };
    }
    static async getEvaluationStatistics(startDate, endDate) {
        const evaluations = await database_1.default.quranEvaluation.findMany({
            where: {
                evaluationDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const avgScore = evaluations.length > 0
            ? evaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) / evaluations.length
            : 0;
        return {
            total: evaluations.length,
            averageScore: Math.round(avgScore * 10) / 10,
        };
    }
    static groupEvaluationsByType(evaluations) {
        return evaluations.reduce((acc, e) => {
            acc[e.evaluationType] = (acc[e.evaluationType] || 0) + 1;
            return acc;
        }, {});
    }
    static addDataToWorksheet(worksheet, data) {
        let row = 4;
        Object.entries(data).forEach(([key, value]) => {
            worksheet.getCell(`A${row}`).value = key;
            worksheet.getCell(`B${row}`).value = JSON.stringify(value);
            row++;
        });
    }
}
exports.ReportsService = ReportsService;
exports.default = ReportsService;
//# sourceMappingURL=reports.service.js.map