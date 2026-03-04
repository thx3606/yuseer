/**
 * ====================================
 * خدمة التقارير الاحترافية
 * Professional Reports Service
 * ====================================
 * تقارير يومية، أسبوعية، شهرية، سنوية
 * تقارير حسب الجنسيات والأعمار
 * ====================================
 */

import ExcelJS from 'exceljs';
import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import path from 'path';
import fs from 'fs';

export class ReportsService {
  /**
   * تقرير الحضور اليومي
   */
  static async getDailyAttendanceReport(
    classId?: string,
    date?: Date
  ): Promise<any> {
    try {
      const targetDate = date || new Date();
      const startDate = startOfDay(targetDate);
      const endDate = endOfDay(targetDate);

      const where: Prisma.AttendanceWhereInput = {
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(classId && { classId }),
      };

      const attendances = await prisma.attendance.findMany({
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
    } catch (error) {
      logger.error('Error generating daily attendance report:', error);
      throw error;
    }
  }

  /**
   * تقرير أداء الطلاب الأسبوعي
   */
  static async getWeeklyPerformanceReport(
    classId?: string,
    weekStart?: Date
  ): Promise<any> {
    try {
      const targetWeekStart = weekStart || new Date();
      const startDate = startOfWeek(targetWeekStart);
      const endDate = endOfWeek(targetWeekStart);

      // الحصول على التقييمات الأسبوعية
      const evaluations = await prisma.quranEvaluation.findMany({
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
    } catch (error) {
      logger.error('Error generating weekly performance report:', error);
      throw error;
    }
  }

  /**
   * تقرير شهري شامل
   */
  static async getMonthlyReport(
    tenantId?: string,
    month?: Date
  ): Promise<any> {
    try {
      const targetMonth = month || new Date();
      const startDate = startOfMonth(targetMonth);
      const endDate = endOfMonth(targetMonth);

      /* const where: any = {
        ...(tenantId && { tenantId }),
      }; */

      // إحصائيات الطلاب
      const studentsStats = await this.getStudentsStatistics(tenantId, startDate, endDate);

      // إحصائيات الحضور
      const attendanceStats = await this.getAttendanceStatistics(startDate, endDate);

      // إحصائيات التقييمات
      const evaluationStats = await this.getEvaluationStatistics(startDate, endDate);

      // إحصائيات الشهادات
      const certificatesIssued = await prisma.issuedCertificate.count({
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
    } catch (error) {
      logger.error('Error generating monthly report:', error);
      throw error;
    }
  }

  /**
   * تقرير سنوي
   */
  static async getAnnualReport(
    _tenantId?: string,
    year?: number
  ): Promise<any> {
    try {
      const targetYear = year || new Date().getFullYear();
      const startDate = startOfYear(new Date(targetYear, 0, 1));
      const endDate = endOfYear(new Date(targetYear, 11, 31));

      // عدد الطلاب المسجلين
      const totalStudents = await prisma.student.count({
        where: {
          enrollmentDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // الطلاب المتخرجين
      const graduatedStudents = await prisma.student.count({
        where: {
          status: 'GRADUATED',
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // إجمالي التقييمات
      const totalEvaluations = await prisma.quranEvaluation.count({
        where: {
          evaluationDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // إجمالي الشهادات
      const totalCertificates = await prisma.issuedCertificate.count({
        where: {
          issueDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // معدل الحضور السنوي
      const attendances = await prisma.attendance.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const attendanceRate = attendances.length > 0
        ? Math.round(
          (attendances.filter((a) => a.status === 'PRESENT').length / attendances.length) * 100
        )
        : 0;

      return {
        year: targetYear,
        totalStudents,
        graduatedStudents,
        totalEvaluations,
        totalCertificates,
        attendanceRate,
      };
    } catch (error) {
      logger.error('Error generating annual report:', error);
      throw error;
    }
  }

  /**
   * تقرير حسب الجنسيات
   */
  static async getNationalityReport(): Promise<any> {
    try {
      const students = await prisma.student.findMany({
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

      const nationalityDistribution = students.reduce((acc: any, student) => {
        const nationality = student.user.profile?.nationality || 'غير محدد';
        acc[nationality] = (acc[nationality] || 0) + 1;
        return acc;
      }, {});

      const sorted = Object.entries(nationalityDistribution)
        .map(([nationality, count]) => ({
          nationality,
          count,
          percentage: Math.round((count as number / students.length) * 100),
        }))
        .sort((a: any, b: any) => b.count - a.count);

      return {
        totalStudents: students.length,
        distribution: sorted,
      };
    } catch (error) {
      logger.error('Error generating nationality report:', error);
      throw error;
    }
  }

  /**
   * تقرير حسب الأعمار
   */
  static async getAgeDistributionReport(): Promise<any> {
    try {
      const students = await prisma.student.findMany({
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

        if (age >= 5 && age <= 10) ageGroups['5-10']++;
        else if (age >= 11 && age <= 15) ageGroups['11-15']++;
        else if (age >= 16 && age <= 20) ageGroups['16-20']++;
        else if (age >= 21 && age <= 30) ageGroups['21-30']++;
        else if (age > 30) ageGroups['30+']++;
      });

      return {
        totalStudents: students.length,
        ageGroups,
      };
    } catch (error) {
      logger.error('Error generating age distribution report:', error);
      throw error;
    }
  }

  /**
   * تقرير أداء معلم محدد
   */
  static async getTeacherPerformanceReport(
    teacherId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    try {
      const start = startDate || startOfMonth(new Date());
      const end = endDate || endOfMonth(new Date());

      const evaluations = await prisma.quranEvaluation.findMany({
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
      const averageScore =
        totalEvaluations > 0
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
    } catch (error) {
      logger.error('Error generating teacher performance report:', error);
      throw error;
    }
  }

  /**
   * تصدير تقرير إلى Excel
   */
  static async exportToExcel(reportType: string, data: any): Promise<string> {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('التقرير');

      // إضافة العنوان
      worksheet.mergeCells('A1:D1');
      worksheet.getCell('A1').value = `تقرير ${reportType}`;
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      // إضافة التاريخ
      worksheet.mergeCells('A2:D2');
      worksheet.getCell('A2').value = `تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}`;
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      // إضافة البيانات بناءً على نوع التقرير
      this.addDataToWorksheet(worksheet, data);

      // حفظ الملف
      const reportsDir = process.env.REPORTS_DIR || './reports';
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `report_${reportType}_${Date.now()}.xlsx`;
      const filepath = path.join(reportsDir, filename);

      await workbook.xlsx.writeFile(filepath);

      logger.info(`Report exported to Excel: ${filename}`);

      return filepath;
    } catch (error) {
      logger.error('Error exporting report to Excel:', error);
      throw error;
    }
  }

  // ===================================
  // Helpers
  // ===================================

  private static aggregateStudentPerformance(evaluations: any[]): any[] {
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

    const result: any[] = [];

    studentMap.forEach((data) => {
      const avgScore =
        data.evaluations.reduce((sum: number, e: any) => sum + (e.overallScore || 0), 0) /
        data.evaluations.length;

      result.push({
        student: data.student,
        evaluationCount: data.evaluations.length,
        averageScore: Math.round(avgScore * 10) / 10,
      });
    });

    return result.sort((a, b) => b.averageScore - a.averageScore);
  }

  private static async getStudentsStatistics(
    _tenantId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const totalStudents = await prisma.student.count({
      where: {
        status: 'ACTIVE',
      },
    });

    const newStudents = startDate && endDate
      ? await prisma.student.count({
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

  private static async getAttendanceStatistics(startDate: Date, endDate: Date): Promise<any> {
    const attendances = await prisma.attendance.findMany({
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

  private static async getEvaluationStatistics(startDate: Date, endDate: Date): Promise<any> {
    const evaluations = await prisma.quranEvaluation.findMany({
      where: {
        evaluationDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const avgScore =
      evaluations.length > 0
        ? evaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) / evaluations.length
        : 0;

    return {
      total: evaluations.length,
      averageScore: Math.round(avgScore * 10) / 10,
    };
  }

  private static groupEvaluationsByType(evaluations: any[]): any {
    return evaluations.reduce((acc: any, e) => {
      acc[e.evaluationType] = (acc[e.evaluationType] || 0) + 1;
      return acc;
    }, {});
  }

  private static addDataToWorksheet(worksheet: ExcelJS.Worksheet, data: any): void {
    // هنا يمكن تخصيص كيفية إضافة البيانات بناءً على نوع التقرير
    // مثال بسيط:
    let row = 4;
    Object.entries(data).forEach(([key, value]) => {
      worksheet.getCell(`A${row}`).value = key;
      worksheet.getCell(`B${row}`).value = JSON.stringify(value);
      row++;
    });
  }
}

export default ReportsService;
