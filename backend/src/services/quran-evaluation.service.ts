/**
 * ====================================
 * خدمة التقييم الذكي للقرآن الكريم
 * Intelligent Quran Evaluation Service
 * ====================================
 */

import {
  QuranEvaluation,
  QuranEvaluationType,
  MemorizationLevel,
  Prisma,
} from '@prisma/client';
import prisma from '../config/database';
import { logger } from '../utils/logger';

/**
 * معايير أخطاء التجويد
 */
export enum TajweedErrorType {
  GHUNNAH = 'غنة',
  MADD = 'مد',
  QALQALAH = 'قلقلة',
  IDGHAM = 'إدغام',
  IKHFA = 'إخفاء',
  IQLAB = 'إقلاب',
  IZHAR = 'إظهار',
  TAFKHEEM = 'تفخيم',
  TARQEEQ = 'ترقيق',
  WAQF = 'وقف',
  MAKHRAJ = 'مخرج حرف',
  SIFAH = 'صفة حرف',
  OTHER = 'أخرى',
}

interface TajweedError {
  type: TajweedErrorType;
  ayah: number;
  description: string;
  severity: 'minor' | 'moderate' | 'major'; // خفيف، متوسط، كبير
}

interface QuranEvaluationDTO {
  studentId: string;
  teacherId: string;
  evaluationType: QuranEvaluationType;
  surah?: number;
  fromAyah?: number;
  toAyah?: number;
  fromPage?: number;
  toPage?: number;
  juz?: number;
  tajweedScore?: number;
  hifzScore?: number;
  fluencyScore?: number;
  tajweedErrors?: TajweedError[];
  notes?: string;
  audioRecording?: string;
}

export class QuranEvaluationService {
  /**
   * إنشاء تقييم جديد للقرآن الكريم
   */
  static async createEvaluation(data: QuranEvaluationDTO): Promise<QuranEvaluation> {
    try {
      // التحقق من وجود الطالب والمعلم
      const student = await prisma.student.findUnique({
        where: { id: data.studentId },
      });

      const teacher = await prisma.teacher.findUnique({
        where: { id: data.teacherId },
      });

      if (!student || !teacher) {
        throw new Error('الطالب أو المعلم غير موجود');
      }

      // حساب الدرجة الإجمالية
      const overallScore = this.calculateOverallScore(
        data.tajweedScore || 0,
        data.hifzScore || 0,
        data.fluencyScore || 0
      );

      // تحديد مستوى الحفظ بناءً على الدرجة الإجمالية
      const memorization = this.determineMemorizationLevel(overallScore);

      // إنشاء التقييم
      const evaluation = await prisma.quranEvaluation.create({
        data: {
          studentId: data.studentId,
          teacherId: data.teacherId,
          evaluationType: data.evaluationType,
          surah: data.surah,
          fromAyah: data.fromAyah,
          toAyah: data.toAyah,
          fromPage: data.fromPage,
          toPage: data.toPage,
          juz: data.juz,
          tajweedScore: data.tajweedScore,
          hifzScore: data.hifzScore,
          fluencyScore: data.fluencyScore,
          overallScore,
          tajweedErrors: data.tajweedErrors as unknown as Prisma.JsonArray,
          memorization,
          notes: data.notes,
          audioRecording: data.audioRecording,
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
          teacher: {
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

      // تحديث تقدم الطالب في القرآن
      if (data.evaluationType === QuranEvaluationType.HIFZ_NEW && overallScore >= 70) {
        await this.updateQuranProgress(
          data.studentId,
          data.surah,
          data.fromPage,
          data.toPage
        );
      }

      logger.info(
        `New Quran evaluation created for student ${data.studentId} by teacher ${data.teacherId}`
      );

      return evaluation;
    } catch (error) {
      logger.error('Error creating Quran evaluation:', error);
      throw error;
    }
  }

  /**
   * الحصول على تقييمات الطالب
   */
  static async getStudentEvaluations(
    studentId: string,
    filters?: {
      evaluationType?: QuranEvaluationType;
      fromDate?: Date;
      toDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ evaluations: QuranEvaluation[]; total: number }> {
    try {
      const where: Prisma.QuranEvaluationWhereInput = {
        studentId,
        ...(filters?.evaluationType && { evaluationType: filters.evaluationType }),
        ...(filters?.fromDate &&
          filters?.toDate && {
          evaluationDate: {
            gte: filters.fromDate,
            lte: filters.toDate,
          },
        }),
      };

      const [evaluations, total] = await Promise.all([
        prisma.quranEvaluation.findMany({
          where,
          include: {
            teacher: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
          orderBy: { evaluationDate: 'desc' },
          take: filters?.limit || 20,
          skip: filters?.offset || 0,
        }),
        prisma.quranEvaluation.count({ where }),
      ]);

      return { evaluations, total };
    } catch (error) {
      logger.error('Error fetching student evaluations:', error);
      throw error;
    }
  }

  /**
   * الحصول على إحصائيات تقييم الطالب
   */
  static async getStudentEvaluationStats(studentId: string): Promise<any> {
    try {
      const evaluations = await prisma.quranEvaluation.findMany({
        where: { studentId },
      });

      if (evaluations.length === 0) {
        return {
          totalEvaluations: 0,
          averageTajweed: 0,
          averageHifz: 0,
          averageFluency: 0,
          averageOverall: 0,
          bestScore: 0,
          lowestScore: 0,
          memorializationDistribution: {},
        };
      }

      const tajweedScores = evaluations
        .map((e) => e.tajweedScore)
        .filter((s): s is number => s !== null);
      const hifzScores = evaluations
        .map((e) => e.hifzScore)
        .filter((s): s is number => s !== null);
      const fluencyScores = evaluations
        .map((e) => e.fluencyScore)
        .filter((s): s is number => s !== null);
      const overallScores = evaluations
        .map((e) => e.overallScore)
        .filter((s): s is number => s !== null);

      const memorializationDistribution = evaluations.reduce((acc: any, curr) => {
        const level = curr.memorization || 'UNKNOWN';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      return {
        totalEvaluations: evaluations.length,
        averageTajweed: this.average(tajweedScores),
        averageHifz: this.average(hifzScores),
        averageFluency: this.average(fluencyScores),
        averageOverall: this.average(overallScores),
        bestScore: Math.max(...overallScores),
        lowestScore: Math.min(...overallScores),
        memorializationDistribution,
        recentEvaluations: evaluations.slice(0, 5),
      };
    } catch (error) {
      logger.error('Error fetching student evaluation stats:', error);
      throw error;
    }
  }

  /**
   * تحليل أخطاء التجويد الشائعة للطالب
   */
  static async analyzeTajweedErrors(studentId: string): Promise<any> {
    try {
      const evaluations = await prisma.quranEvaluation.findMany({
        where: { studentId },
        select: { tajweedErrors: true },
      });

      const allErrors: TajweedError[] = [];
      evaluations.forEach((evaluation) => {
        if (Array.isArray(evaluation.tajweedErrors)) {
          allErrors.push(...(evaluation.tajweedErrors as unknown as TajweedError[]));
        }
      });

      // تحليل الأخطاء حسب النوع
      const errorsByType = allErrors.reduce((acc: any, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      }, {});

      // تحليل الأخطاء حسب الخطورة
      const errorsBySeverity = allErrors.reduce((acc: any, error) => {
        acc[error.severity] = (acc[error.severity] || 0) + 1;
        return acc;
      }, {});

      // الأخطاء الأكثر شيوعاً
      const mostCommonErrors = Object.entries(errorsByType)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5);

      return {
        totalErrors: allErrors.length,
        errorsByType,
        errorsBySeverity,
        mostCommonErrors: mostCommonErrors.map(([type, count]) => ({
          type,
          count,
          percentage: ((count as number / allErrors.length) * 100).toFixed(2),
        })),
        improvementAreas: this.identifyImprovementAreas(errorsByType),
      };
    } catch (error) {
      logger.error('Error analyzing Tajweed errors:', error);
      throw error;
    }
  }

  /**
   * تحديث تقدم الطالب في القرآن الكريم
   */
  private static async updateQuranProgress(
    studentId: string,
    surah?: number,
    fromPage?: number,
    toPage?: number
  ): Promise<void> {
    try {
      const progress = await prisma.quranProgress.findUnique({
        where: { studentId },
      });

      if (!progress) {
        return;
      }

      let pagesMemorized = progress.totalPagesMemorized;

      if (fromPage && toPage) {
        pagesMemorized += toPage - fromPage + 1;
      }

      const completionPercentage = (pagesMemorized / 604) * 100; // 604 صفحة في المصحف

      await prisma.quranProgress.update({
        where: { studentId },
        data: {
          totalPagesMemorized: pagesMemorized,
          completionPercentage,
          ...(surah && { currentSurah: surah }),
          ...(toPage && { currentPage: toPage }),
        },
      });

      logger.info(`Updated Quran progress for student ${studentId}`);
    } catch (error) {
      logger.error('Error updating Quran progress:', error);
    }
  }

  /**
   * حساب الدرجة الإجمالية
   */
  private static calculateOverallScore(
    tajweed: number,
    hifz: number,
    fluency: number
  ): number {
    // الأوزان: التجويد 40%، الحفظ 40%، الطلاقة 20%
    const weighted = tajweed * 0.4 + hifz * 0.4 + fluency * 0.2;
    return Math.round(weighted * 10) / 10; // تقريب لأقرب منزلة عشرية
  }

  /**
   * تحديد مستوى الحفظ بناءً على الدرجة
   */
  private static determineMemorizationLevel(score: number): MemorizationLevel {
    if (score >= 95) return MemorizationLevel.EXCELLENT;
    if (score >= 85) return MemorizationLevel.VERY_GOOD;
    if (score >= 75) return MemorizationLevel.GOOD;
    if (score >= 60) return MemorizationLevel.ACCEPTABLE;
    if (score >= 50) return MemorizationLevel.WEAK;
    return MemorizationLevel.NEEDS_REVIEW;
  }

  /**
   * حساب المتوسط
   */
  private static average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return Math.round((sum / numbers.length) * 10) / 10;
  }

  /**
   * تحديد مجالات التحسين
   */
  private static identifyImprovementAreas(errorsByType: any): string[] {
    const areas: string[] = [];
    const threshold = 3; // إذا كان هناك 3 أخطاء أو أكثر من نفس النوع

    Object.entries(errorsByType).forEach(([type, count]) => {
      if ((count as number) >= threshold) {
        areas.push(`يحتاج إلى تحسين في: ${type}`);
      }
    });

    return areas;
  }

  /**
   * حذف تقييم
   */
  static async deleteEvaluation(evaluationId: string, userId: string): Promise<void> {
    try {
      const evaluation = await prisma.quranEvaluation.findUnique({
        where: { id: evaluationId },
        include: { teacher: true },
      });

      if (!evaluation) {
        throw new Error('التقييم غير موجود');
      }

      // التحقق من الصلاحية (المعلم الذي أنشأ التقييم أو الإداري)
      if (evaluation.teacherId !== userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (
          user?.role !== 'PLATFORM_OWNER' &&
          user?.role !== 'TENANT_ADMIN'
        ) {
          throw new Error('ليس لديك صلاحية لحذف هذا التقييم');
        }
      }

      await prisma.quranEvaluation.delete({
        where: { id: evaluationId },
      });

      logger.info(`Quran evaluation ${evaluationId} deleted by user ${userId}`);
    } catch (error) {
      logger.error('Error deleting Quran evaluation:', error);
      throw error;
    }
  }

  /**
   * تحديث تقييم
   */
  static async updateEvaluation(
    evaluationId: string,
    data: Partial<QuranEvaluationDTO>,
    userId: string
  ): Promise<QuranEvaluation> {
    try {
      const evaluation = await prisma.quranEvaluation.findUnique({
        where: { id: evaluationId },
      });

      if (!evaluation) {
        throw new Error('التقييم غير موجود');
      }

      // التحقق من الصلاحية
      if (evaluation.teacherId !== userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (
          user?.role !== 'PLATFORM_OWNER' &&
          user?.role !== 'TENANT_ADMIN'
        ) {
          throw new Error('ليس لديك صلاحية لتعديل هذا التقييم');
        }
      }

      // حساب الدرجة الإجمالية الجديدة إذا تم تحديث الدرجات
      let overallScore = evaluation.overallScore;
      if (data.tajweedScore || data.hifzScore || data.fluencyScore) {
        overallScore = this.calculateOverallScore(
          data.tajweedScore || evaluation.tajweedScore || 0,
          data.hifzScore || evaluation.hifzScore || 0,
          data.fluencyScore || evaluation.fluencyScore || 0
        );
      }

      const memorization = this.determineMemorizationLevel(overallScore || 0);

      const updated = await prisma.quranEvaluation.update({
        where: { id: evaluationId },
        data: {
          ...data,
          overallScore,
          memorization,
          tajweedErrors: data.tajweedErrors as unknown as Prisma.JsonArray,
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
          teacher: {
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

      logger.info(`Quran evaluation ${evaluationId} updated by user ${userId}`);

      return updated;
    } catch (error) {
      logger.error('Error updating Quran evaluation:', error);
      throw error;
    }
  }
}

export default QuranEvaluationService;
