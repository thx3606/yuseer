export declare class ReportsService {
    static getDailyAttendanceReport(classId?: string, date?: Date): Promise<any>;
    static getWeeklyPerformanceReport(classId?: string, weekStart?: Date): Promise<any>;
    static getMonthlyReport(tenantId?: string, month?: Date): Promise<any>;
    static getAnnualReport(_tenantId?: string, year?: number): Promise<any>;
    static getNationalityReport(): Promise<any>;
    static getAgeDistributionReport(): Promise<any>;
    static getTeacherPerformanceReport(teacherId: string, startDate?: Date, endDate?: Date): Promise<any>;
    static exportToExcel(reportType: string, data: any): Promise<string>;
    private static aggregateStudentPerformance;
    private static getStudentsStatistics;
    private static getAttendanceStatistics;
    private static getEvaluationStatistics;
    private static groupEvaluationsByType;
    private static addDataToWorksheet;
}
export default ReportsService;
//# sourceMappingURL=reports.service.d.ts.map