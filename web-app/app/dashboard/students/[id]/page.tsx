'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, Award, ShieldCheck, Mail, Phone, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentProfile() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header and Back navigation */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/students" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronRight className="w-6 h-6 text-slate-400" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">ملف الطالب</h2>
                    <p className="text-slate-500 text-sm">عرض وتحليل الأداء التفصيلي للطالب</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 h-32 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 dark:from-emerald-900/40 dark:to-emerald-900/10" />

                        <div className="relative mt-8">
                            <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                أ
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100">أحمد محمود العتيبي</h3>
                            <p className="text-slate-500 text-sm mt-1">طالب منتظم - دبلوم القرآن</p>

                            <div className="mt-6 flex justify-center gap-2">
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">منتظم</span>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">الجزء الخامس</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-right space-y-4">
                            <div>
                                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">رقم الطالب</p>
                                <p className="text-slate-700 dark:text-slate-300 font-semibold font-mono">YS-43281</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">الحلقة الحالية</p>
                                <p className="text-slate-700 dark:text-slate-300 font-semibold">حلقة الإمام نافع</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">المعلم المشرف</p>
                                <p className="text-slate-700 dark:text-slate-300 font-semibold">الشيخ عبدالباسط محمد</p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-2">
                            <button className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors text-sm font-bold">
                                <Phone className="w-4 h-4" /> اتصال
                            </button>
                            <button className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors text-sm font-bold">
                                <Mail className="w-4 h-4" /> مراسلة
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Details and Progress */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">تقدم الحفظ</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-600 dark:text-slate-400">القرآن الكريم</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">16% (5 أجزاء)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '16%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-600 dark:text-slate-400">المتون العلمية (التحفة)</span>
                                        <span className="font-bold text-amber-500">100%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">أحدث التقييمات</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">تسميع سورة البقرة</p>
                                        <p className="text-xs text-slate-500">منذ يومين</p>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold rounded-lg">98% / ممتاز</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">اختبار جزء عم</p>
                                        <p className="text-xs text-slate-500">منذ أسبوعين</p>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold rounded-lg">95% / ممتاز</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">سجل النشاط وحفظ القرآن</h3>
                            <button className="text-sm text-emerald-600 dark:text-emerald-400 font-bold hover:underline">عرض التقرير الكامل</button>
                        </div>

                        <div className="relative pl-4 border-r-2 border-slate-100 dark:border-slate-800 pr-4 space-y-8">
                            {[
                                { title: 'إتمام مراجعة الجزء الرابع', date: 'أمس، 05:30 م', type: 'review' },
                                { title: 'حفظ جديد - سورة آل عمران ص65', date: '10 مارس، 04:15 م', type: 'hifz' },
                                { title: 'غياب بعذر', date: '08 مارس', type: 'absence' }
                            ].map((activity, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -right-[23px] w-4 h-4 rounded-full border-4 border-white dark:border-[#0f172a] ${activity.type === 'review' ? 'bg-blue-500' :
                                            activity.type === 'hifz' ? 'bg-emerald-500' : 'bg-amber-500'
                                        }`} />
                                    <div>
                                        <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{activity.title}</h4>
                                        <p className="text-slate-400 text-xs mt-1">{activity.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
