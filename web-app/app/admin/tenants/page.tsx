'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShieldCheck, Ban, CheckCircle, MoreVertical, CreditCard } from 'lucide-react';

const MOCK_TENANTS = [
    { id: 't1', name: 'جمعية تحفيظ القرآن بالرياض', subdomain: 'riyadh', plan: 'شاملة', status: 'ACTIVE', students: 1250, expires: '01/10/2026' },
    { id: 't2', name: 'مدرسة النور', subdomain: 'alnoor', plan: 'أساسية', status: 'SUSPENDED', students: 45, expires: '15/05/2026' },
    { id: 't3', name: 'مجمع الإمام نافع', subdomain: 'nafi3', plan: 'متقدمة', status: 'ACTIVE', students: 300, expires: '20/12/2026' }
];

export default function PlatformTenantsPage() {
    const [tenants, setTenants] = useState(MOCK_TENANTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleAction = async (id: string, newStatus: string) => {
        setActionLoading(id);
        await new Promise(res => setTimeout(res, 800)); // Simulate API delay
        setTenants(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        setActionLoading(null);
    };

    const filtered = tenants.filter(t => t.name.includes(searchQuery) || t.subdomain.includes(searchQuery));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">إداره الجمعيات والمشتركين</h2>
                    <p className="text-slate-500 mt-1">عرض جميع الكيانات والمؤسسات المسجلة في منصة يسر والتحكم باشتراكاتهم</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-[0_4px_20px_rgba(79,70,229,0.3)] transition-all">
                    تصدير التقرير (CSV)
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ابحث باسم الجمعية أو الـ Subdomain..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-colors">
                        <Filter className="w-5 h-5" /> تصفية النتائج
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    <AnimatePresence>
                        {filtered.map((tenant, idx) => (
                            <motion.div
                                key={tenant.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${tenant.status === 'ACTIVE'
                                        ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                                        : 'bg-slate-50 dark:bg-slate-900 border-rose-200 dark:border-rose-900'
                                    }`}
                            >
                                {tenant.status === 'SUSPENDED' && (
                                    <div className="absolute top-0 right-0 left-0 h-1 bg-rose-500" />
                                )}

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-3 ${tenant.status === 'ACTIVE' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
                                            }`}>
                                            {tenant.status === 'ACTIVE' ? 'فعال' : 'موقوف'}
                                        </span>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">{tenant.name}</h3>
                                        <p className="text-sm font-medium text-slate-500 mt-1">{tenant.subdomain}.yuoser.com</p>
                                    </div>
                                    <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <MoreVertical className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">الطلاب</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-300">{tenant.students.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">الباقة</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-300">{tenant.plan}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-6 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-xs font-bold">تجديد: {tenant.expires}</span>
                                    </div>

                                    {tenant.status === 'ACTIVE' ? (
                                        <button
                                            onClick={() => handleAction(tenant.id, 'SUSPENDED')}
                                            disabled={actionLoading === tenant.id}
                                            className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 flex justify-center items-center transition-colors shadow-sm disabled:opacity-50"
                                            title="إيقاف الكيان"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAction(tenant.id, 'ACTIVE')}
                                            disabled={actionLoading === tenant.id}
                                            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 flex justify-center items-center transition-colors shadow-sm disabled:opacity-50"
                                            title="إعادة تفعيل الكيان"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
