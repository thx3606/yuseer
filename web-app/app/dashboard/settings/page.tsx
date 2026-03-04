'use client';

import { motion } from 'framer-motion';
import { User, Bell, Lock, Globe, Database, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-emerald-400 mb-2">إعدادات النظام</h2>
                <p className="text-slate-500 font-medium">إدارة تفضيلات الحساب وتهيئات النظام العامة</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Settings Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: 'profile', name: 'الملف الشخصي', icon: User, active: true },
                        { id: 'notifications', name: 'الإشعارات', icon: Bell, active: false },
                        { id: 'security', name: 'الأمان والخصوصية', icon: Lock, active: false },
                        { id: 'system', name: 'إعدادات النظام', icon: Globe, active: false },
                        { id: 'backup', name: 'النسخ الاحتياطي', icon: Database, active: false },
                    ].map((item) => (
                        <button
                            key={item.id}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${item.active
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Settings Content Area */}
                <div className="lg:col-span-3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
                    >
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-4xl text-slate-300">
                                    <User className="w-10 h-10 text-slate-400" />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">مدير النظام (Admin)</h3>
                                <p className="text-slate-500 mb-3">admin@yuoser.com</p>
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
                                    صلاحيات كاملة
                                </span>
                            </div>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">الاسم الأول</label>
                                    <input type="text" defaultValue="مدير" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">اسم العائلة</label>
                                    <input type="text" defaultValue="النظام" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">رقم الجوال</label>
                                    <input type="text" defaultValue="+966 50 123 4567" dir="ltr" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow text-left" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">لغة واجهة النظام</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow appearance-none">
                                        <option value="ar">العربية</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">نبذة تعريفية</label>
                                <textarea rows={4} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow"></textarea>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                                    إلغاء
                                </button>
                                <button type="button" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5">
                                    <Save className="w-5 h-5" />
                                    حفظ التغييرات
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
