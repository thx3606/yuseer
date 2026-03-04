'use client';

import { motion } from 'framer-motion';
import { Building2, Users, CreditCard, Ticket, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

// Using a mock until backend API is fully connected via React Query / fetch
const KPI_METRICS = [
    { label: 'الإيرادات الشهرية (MRR)', value: '45,000 ر.س', trend: '+12.5%', icon: CreditCard, color: 'from-indigo-600 to-indigo-400', isPositive: true },
    { label: 'الجمعيات النشطة', value: '124', trend: '+4 هذا الاسبوع', icon: Building2, color: 'from-blue-600 to-blue-400', isPositive: true },
    { label: 'طلبات الانضمام (Pending)', value: '3', trend: 'يحتاج مراجعة', icon: AlertTriangle, color: 'from-amber-500 to-amber-400', isPositive: false },
    { label: 'تذاكر الدعم المفتوحة', value: '12', trend: '-2 اليوم', icon: Ticket, color: 'from-rose-500 to-rose-400', isPositive: true },
];

export default function PlatformAdminDashboard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial data load from /api/v1/platform/analytics/kpis
        setTimeout(() => setLoading(false), 800);
    }, []);

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white mb-2">منصة التحكم المركزية (Q-NXI)</h2>
                <p className="text-slate-500 dark:text-slate-400">نظرة عامة على الإيرادات، صحة النظام، ونمو المدارس والجمعيات.</p>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {KPI_METRICS.map((metric, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-gradient-to-br ${metric.color} p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group`}
                    >
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <metric.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full backdrop-blur-md">
                                {metric.trend}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-white/80 font-medium text-sm mb-1">{metric.label}</p>
                            <h3 className="text-3xl font-black">{metric.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Onboarding Requests */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">أحدث طلبات انضمام الجمعيات</h3>
                        <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">عرض الكل ({'>'})</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'جمعية تحفيظ القرآن بالرياض', plan: 'الباقة المتقدمة', date: 'قبل ساعتين', status: 'بانتظار الموافقة' },
                            { name: 'مجمع النور القرآني', plan: 'الباقة الأساسية', date: 'قبل 5 ساعات', status: 'بانتظار الموافقة' },
                            { name: 'مدرسة ابن تيمية', plan: 'الباقة الشاملة', date: 'أمس', status: 'تحت المراجعة' }
                        ].map((req, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-lg">
                                        {req.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white">{req.name}</h4>
                                        <p className="text-xs font-medium text-slate-500">{req.plan} • {req.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg">
                                        {req.status}
                                    </span>
                                    <button className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors">مراجعة</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscriptions Mini-card */}
                <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
                    <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        نطاق نمو المنصة
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">الباقات الشاملة</span>
                                <span className="font-bold">45 جمعية</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">الباقات المتقدمة</span>
                                <span className="font-bold">60 جمعية</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">الباقات الأساسية</span>
                                <span className="font-bold">19 جمعية</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center relative z-10">
                        <p className="text-sm font-medium text-slate-400 mb-2">توقع الإيرادات نهاية هذا الشهر</p>
                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-indigo-400 to-purple-400">52,000 ر.س</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
