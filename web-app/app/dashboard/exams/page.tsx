'use client';

import { motion } from 'framer-motion';
import { Award, Search, Filter, Calendar, FileText, CheckCircle2 } from 'lucide-react';

const examsData = [
    { id: 1, title: 'اختبار حفظ 5 أجزاء', date: '2024-03-25', time: '10:00 ص', type: 'شفوي', status: 'قادم', studentsCount: 45 },
    { id: 2, title: 'اختبار تحفة الأطفال', date: '2024-03-15', time: '04:00 م', type: 'تحريري', status: 'مكتمل', studentsCount: 120 },
    { id: 3, title: 'اختبار القاعدة النورانية', date: '2024-03-20', time: '08:00 ص', type: 'شفوي', status: 'جارٍ الانعقاد', studentsCount: 30 },
    { id: 4, title: 'اختبار إجازة رواية حفص', date: '2024-04-01', time: '06:00 ص', type: 'شفوي', status: 'قادم', studentsCount: 5 },
];

export default function ExamsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-emerald-400 mb-2">الاختبارات والشهادات</h2>
                    <p className="text-slate-500 font-medium">إدارة التقييمات الشاملة وإصدار الشهادات للمجتازين</p>
                </div>

                <div className="flex gap-3">
                    <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        إصدار شهادات
                    </button>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-1">
                        جدولة اختبار
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pr-12 pl-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
                            placeholder="ابحث عن اختبار..."
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        {['الكل', 'قادم', 'مكتمل', 'جارٍ الانعقاد'].map((filter, i) => (
                            <button
                                key={i}
                                className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold transition-colors ${i === 0
                                        ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto p-4">
                    <table className="w-full text-right border-separate border-spacing-y-3">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">عنوان الاختبار</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">النوع</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">التاريخ والوقت</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">عدد المسجلين</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {examsData.map((exam, idx) => (
                                <motion.tr
                                    key={exam.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-slate-900 group shadow-sm hover:shadow-md transition-all rounded-2xl"
                                >
                                    <td className="px-6 py-4 rounded-r-2xl border-y border-r border-slate-100 dark:border-slate-800 group-hover:border-emerald-100 dark:group-hover:border-emerald-900/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{exam.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-y border-slate-100 dark:border-slate-800 group-hover:border-emerald-100 dark:group-hover:border-emerald-900/30">
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{exam.type}</span>
                                    </td>
                                    <td className="px-6 py-4 border-y border-slate-100 dark:border-slate-800 group-hover:border-emerald-100 dark:group-hover:border-emerald-900/30">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {exam.date} <span className="text-slate-400 text-xs">|</span> {exam.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-y border-slate-100 dark:border-slate-800 group-hover:border-emerald-100 dark:group-hover:border-emerald-900/30">
                                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-bold">
                                            {exam.studentsCount} طالب
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-y border-slate-100 dark:border-slate-800 group-hover:border-emerald-100 dark:group-hover:border-emerald-900/30">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${exam.status === 'مكتمل' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                                exam.status === 'جارٍ الانعقاد' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 animate-pulse' :
                                                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}>
                                            {exam.status === 'مكتمل' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                            {exam.status === 'جارٍ الانعقاد' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                                            {exam.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 rounded-l-2xl border-y border-l border-slate-100 dark:border-slate-800 group-hover:border-emerald-100 dark:group-hover:border-emerald-900/30">
                                        <button className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                                            إدارة &larr;
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
