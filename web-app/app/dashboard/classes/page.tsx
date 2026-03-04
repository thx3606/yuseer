'use client';

import { motion } from 'framer-motion';
import { Search, Filter, Plus, Clock, Users, BookOpen, Star, MoreVertical } from 'lucide-react';
import Link from 'next/link';

const classesData = [
    { id: 1, name: 'حلقة الإمام نافع', teacher: 'الشيخ عبدالباسط محمد', students: 15, level: 'متقدم (مراجعة)', time: 'العصر', type: 'قرآن كريم' },
    { id: 2, name: 'حلقة الإمام ورش', teacher: 'الشيخ محمد محمود', students: 12, level: 'متوسط (حفظ)', time: 'المغرب', type: 'قرآن كريم' },
    { id: 3, name: 'دورة النورانية', teacher: 'أ. صالح إبراهيم', students: 20, level: 'مبتدئ', time: 'العصر', type: 'قاعدة نورانية' },
    { id: 4, name: 'شرح تحفة الأطفال', teacher: 'الشيخ أبوبكر الصديق', students: 25, level: 'مبتدئ', time: 'العشاء', type: 'متون علمية' },
    { id: 5, name: 'حلقة الإقراء والإجازة', teacher: 'د. خالد الزهراني', students: 5, level: 'إتقان', time: 'الفجر', type: 'إجازات' },
];

export default function ClassesPage() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-emerald-600 to-emerald-400 mb-2">الحلقات والمسارات التدريسية</h2>
                    <p className="text-muted-foreground font-medium">إدارة الحلقات القرآنية والمتون وتوزيع الطلاب والهيئة</p>
                </div>

                <Link href="/dashboard/classes/new" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-1 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    إنشاء حلقة جديدة
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'حلقات القرآن الكريم', value: '42', color: 'from-emerald-500 to-emerald-400' },
                    { label: 'حلقات المتون العلمية', value: '15', color: 'from-amber-500 to-amber-400' },
                    { label: 'حلقات القاعدة النورانية', value: '7', color: 'from-blue-500 to-blue-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`rounded-3xl p-6 text-white bg-gradient-to-br ${stat.color} shadow-lg relative overflow-hidden`}
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-xl" />
                        <p className="text-white/80 font-medium text-lg mb-2">{stat.label}</p>
                        <p className="text-4xl font-black">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="bg-card border-slate-200 dark:border-slate-800 border rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pr-12 pl-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
                            placeholder="ابحث عن حلقة، معلم، مادة..."
                        />
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-semibold shadow-sm text-slate-700 dark:text-slate-200">
                        <Filter className="w-5 h-5" />
                        تصفية النتائج
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-slate-50/20 dark:bg-[#0f172a]">
                    {classesData.map((cls, idx) => (
                        <motion.div
                            key={cls.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-emerald-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300" />

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full mb-3">
                                        {cls.type}
                                    </span>
                                    <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-1">{cls.name}</h3>
                                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{cls.teacher}</p>
                                </div>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-500 font-medium">الطلاب</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{cls.students} طالب</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-xl">
                                        <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-500 font-medium">المستوى</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate">{cls.level}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">وقت الحلقة: {cls.time}</span>
                                </div>
                                <button className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                                    إدارة الحلقة &larr;
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
