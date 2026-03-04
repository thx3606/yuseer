"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuranEvaluationService = exports.TajweedErrorType = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
var TajweedErrorType;
(function (TajweedErrorType) {
    TajweedErrorType["GHUNNAH"] = "\u063A\u0646\u0629";
    TajweedErrorType["MADD"] = "\u0645\u062F";
    TajweedErrorType["QALQALAH"] = "\u0642\u0644\u0642\u0644\u0629";
    TajweedErrorType["IDGHAM"] = "\u0625\u062F\u063A\u0627\u0645";
    TajweedErrorType["IKHFA"] = "\u0625\u062E\u0641\u0627\u0621";
    TajweedErrorType["IQLAB"] = "\u0625\u0642\u0644\u0627\u0628";
    TajweedErrorType["IZHAR"] = "\u0625\u0638\u0647\u0627\u0631";
    TajweedErrorType["TAFKHEEM"] = "\u062A\u0641\u062E\u064A\u0645";
    TajweedErrorType["TARQEEQ"] = "\u062A\u0631\u0642\u064A\u0642";
    TajweedErrorType["WAQF"] = "\u0648\u0642\u0641";
    TajweedErrorType["MAKHRAJ"] = "\u0645\u062E\u0631\u062C \u062D\u0631\u0641";
    TajweedErrorType["SIFAH"] = "\u0635\u0641\u0629 \u062D\u0631\u0641";
    TajweedErrorType["OTHER"] = "\u0623\u062E\u0631\u0649";
})(TajweedErrorType || (exports.TajweedErrorType = TajweedErrorType = {}));
class QuranEvaluationService {
    static async createEvaluation(data) {
        try {
            const student = await database_1.default.student.findUnique({
                where: { id: data.studentId },
            });
            const teacher = await database_1.default.teacher.findUnique({
                where: { id: data.teacherId },
            });
            if (!student || !teacher) {
                throw new Error('الطالب أو المعلم غير موجود');
            }
            const overallScore = this.calculateOverallScore(data.tajweedScore || 0, data.hifzScore || 0, data.fluencyScore || 0);
            const memorization = this.determineMemorizationLevel(overallScore);
            const evaluation = await database_1.default.quranEvaluation.create({
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
                    tajweedErrors: data.tajweedErrors,
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
            if (data.evaluationType === client_1.QuranEvaluationType.HIFZ_NEW && overallScore >= 70) {
                await this.updateQuranProgress(data.studentId, data.surah, data.fromPage, data.toPage);
            }
            logger_1.logger.info(`New Quran evaluation created for student ${data.studentId} by teacher ${data.teacherId}`);
            return evaluation;
        }
        catch (error) {
            logger_1.logger.error('Error creating Quran evaluation:', error);
            throw error;
        }
    }
    static async getStudentEvaluations(studentId, filters) {
        try {
            const where = {
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
                database_1.default.quranEvaluation.findMany({
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
                database_1.default.quranEvaluation.count({ where }),
            ]);
            return { evaluations, total };
        }
        catch (error) {
            logger_1.logger.error('Error fetching student evaluations:', error);
            throw error;
        }
    }
    static async getStudentEvaluationStats(studentId) {
        try {
            const evaluations = await database_1.default.quranEvaluation.findMany({
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
                .filter((s) => s !== null);
            const hifzScores = evaluations
                .map((e) => e.hifzScore)
                .filter((s) => s !== null);
            const fluencyScores = evaluations
                .map((e) => e.fluencyScore)
                .filter((s) => s !== null);
            const overallScores = evaluations
                .map((e) => e.overallScore)
                .filter((s) => s !== null);
            const memorializationDistribution = evaluations.reduce((acc, curr) => {
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
        }
        catch (error) {
            logger_1.logger.error('Error fetching student evaluation stats:', error);
            throw error;
        }
    }
    static async analyzeTajweedErrors(studentId) {
        try {
            const evaluations = await database_1.default.quranEvaluation.findMany({
                where: { studentId },
                select: { tajweedErrors: true },
            });
            const allErrors = [];
            evaluations.forEach((evaluation) => {
                if (Array.isArray(evaluation.tajweedErrors)) {
                    allErrors.push(...evaluation.tajweedErrors);
                }
            });
            const errorsByType = allErrors.reduce((acc, error) => {
                acc[error.type] = (acc[error.type] || 0) + 1;
                return acc;
            }, {});
            const errorsBySeverity = allErrors.reduce((acc, error) => {
                acc[error.severity] = (acc[error.severity] || 0) + 1;
                return acc;
            }, {});
            const mostCommonErrors = Object.entries(errorsByType)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5);
            return {
                totalErrors: allErrors.length,
                errorsByType,
                errorsBySeverity,
                mostCommonErrors: mostCommonErrors.map(([type, count]) => ({
                    type,
                    count,
                    percentage: ((count / allErrors.length) * 100).toFixed(2),
                })),
                improvementAreas: this.identifyImprovementAreas(errorsByType),
            };
        }
        catch (error) {
            logger_1.logger.error('Error analyzing Tajweed errors:', error);
            throw error;
        }
    }
    static async updateQuranProgress(studentId, surah, fromPage, toPage) {
        try {
            const progress = await database_1.default.quranProgress.findUnique({
                where: { studentId },
            });
            if (!progress) {
                return;
            }
            let pagesMemorized = progress.totalPagesMemorized;
            if (fromPage && toPage) {
                pagesMemorized += toPage - fromPage + 1;
            }
            const completionPercentage = (pagesMemorized / 604) * 100;
            await database_1.default.quranProgress.update({
                where: { studentId },
                data: {
                    totalPagesMemorized: pagesMemorized,
                    completionPercentage,
                    ...(surah && { currentSurah: surah }),
                    ...(toPage && { currentPage: toPage }),
                },
            });
            logger_1.logger.info(`Updated Quran progress for student ${studentId}`);
        }
        catch (error) {
            logger_1.logger.error('Error updating Quran progress:', error);
        }
    }
    static calculateOverallScore(tajweed, hifz, fluency) {
        const weighted = tajweed * 0.4 + hifz * 0.4 + fluency * 0.2;
        return Math.round(weighted * 10) / 10;
    }
    static determineMemorizationLevel(score) {
        if (score >= 95)
            return client_1.MemorizationLevel.EXCELLENT;
        if (score >= 85)
            return client_1.MemorizationLevel.VERY_GOOD;
        if (score >= 75)
            return client_1.MemorizationLevel.GOOD;
        if (score >= 60)
            return client_1.MemorizationLevel.ACCEPTABLE;
        if (score >= 50)
            return client_1.MemorizationLevel.WEAK;
        return client_1.MemorizationLevel.NEEDS_REVIEW;
    }
    static average(numbers) {
        if (numbers.length === 0)
            return 0;
        const sum = numbers.reduce((a, b) => a + b, 0);
        return Math.round((sum / numbers.length) * 10) / 10;
    }
    static identifyImprovementAreas(errorsByType) {
        const areas = [];
        const threshold = 3;
        Object.entries(errorsByType).forEach(([type, count]) => {
            if (count >= threshold) {
                areas.push(`يحتاج إلى تحسين في: ${type}`);
            }
        });
        return areas;
    }
    static async deleteEvaluation(evaluationId, userId) {
        try {
            const evaluation = await database_1.default.quranEvaluation.findUnique({
                where: { id: evaluationId },
                include: { teacher: true },
            });
            if (!evaluation) {
                throw new Error('التقييم غير موجود');
            }
            if (evaluation.teacherId !== userId) {
                const user = await database_1.default.user.findUnique({ where: { id: userId } });
                if (user?.role !== 'PLATFORM_OWNER' &&
                    user?.role !== 'TENANT_ADMIN') {
                    throw new Error('ليس لديك صلاحية لحذف هذا التقييم');
                }
            }
            await database_1.default.quranEvaluation.delete({
                where: { id: evaluationId },
            });
            logger_1.logger.info(`Quran evaluation ${evaluationId} deleted by user ${userId}`);
        }
        catch (error) {
            logger_1.logger.error('Error deleting Quran evaluation:', error);
            throw error;
        }
    }
    static async updateEvaluation(evaluationId, data, userId) {
        try {
            const evaluation = await database_1.default.quranEvaluation.findUnique({
                where: { id: evaluationId },
            });
            if (!evaluation) {
                throw new Error('التقييم غير موجود');
            }
            if (evaluation.teacherId !== userId) {
                const user = await database_1.default.user.findUnique({ where: { id: userId } });
                if (user?.role !== 'PLATFORM_OWNER' &&
                    user?.role !== 'TENANT_ADMIN') {
                    throw new Error('ليس لديك صلاحية لتعديل هذا التقييم');
                }
            }
            let overallScore = evaluation.overallScore;
            if (data.tajweedScore || data.hifzScore || data.fluencyScore) {
                overallScore = this.calculateOverallScore(data.tajweedScore || evaluation.tajweedScore || 0, data.hifzScore || evaluation.hifzScore || 0, data.fluencyScore || evaluation.fluencyScore || 0);
            }
            const memorization = this.determineMemorizationLevel(overallScore || 0);
            const updated = await database_1.default.quranEvaluation.update({
                where: { id: evaluationId },
                data: {
                    ...data,
                    overallScore,
                    memorization,
                    tajweedErrors: data.tajweedErrors,
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
            logger_1.logger.info(`Quran evaluation ${evaluationId} updated by user ${userId}`);
            return updated;
        }
        catch (error) {
            logger_1.logger.error('Error updating Quran evaluation:', error);
            throw error;
        }
    }
}
exports.QuranEvaluationService = QuranEvaluationService;
exports.default = QuranEvaluationService;
//# sourceMappingURL=quran-evaluation.service.js.map