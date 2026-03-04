import { QuranEvaluation, QuranEvaluationType } from '@prisma/client';
export declare enum TajweedErrorType {
    GHUNNAH = "\u063A\u0646\u0629",
    MADD = "\u0645\u062F",
    QALQALAH = "\u0642\u0644\u0642\u0644\u0629",
    IDGHAM = "\u0625\u062F\u063A\u0627\u0645",
    IKHFA = "\u0625\u062E\u0641\u0627\u0621",
    IQLAB = "\u0625\u0642\u0644\u0627\u0628",
    IZHAR = "\u0625\u0638\u0647\u0627\u0631",
    TAFKHEEM = "\u062A\u0641\u062E\u064A\u0645",
    TARQEEQ = "\u062A\u0631\u0642\u064A\u0642",
    WAQF = "\u0648\u0642\u0641",
    MAKHRAJ = "\u0645\u062E\u0631\u062C \u062D\u0631\u0641",
    SIFAH = "\u0635\u0641\u0629 \u062D\u0631\u0641",
    OTHER = "\u0623\u062E\u0631\u0649"
}
interface TajweedError {
    type: TajweedErrorType;
    ayah: number;
    description: string;
    severity: 'minor' | 'moderate' | 'major';
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
export declare class QuranEvaluationService {
    static createEvaluation(data: QuranEvaluationDTO): Promise<QuranEvaluation>;
    static getStudentEvaluations(studentId: string, filters?: {
        evaluationType?: QuranEvaluationType;
        fromDate?: Date;
        toDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{
        evaluations: QuranEvaluation[];
        total: number;
    }>;
    static getStudentEvaluationStats(studentId: string): Promise<any>;
    static analyzeTajweedErrors(studentId: string): Promise<any>;
    private static updateQuranProgress;
    private static calculateOverallScore;
    private static determineMemorizationLevel;
    private static average;
    private static identifyImprovementAreas;
    static deleteEvaluation(evaluationId: string, userId: string): Promise<void>;
    static updateEvaluation(evaluationId: string, data: Partial<QuranEvaluationDTO>, userId: string): Promise<QuranEvaluation>;
}
export default QuranEvaluationService;
//# sourceMappingURL=quran-evaluation.service.d.ts.map