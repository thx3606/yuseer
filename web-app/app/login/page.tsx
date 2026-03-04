'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#112240]/80 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </Link>
                        <h1 className="text-3xl font-black text-white tracking-tight">تسجيل الدخول</h1>
                        <p className="text-slate-400 mt-2 text-sm">أهلاً بك مجدداً في نظام يسر للإدارة</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">البريد الإلكتروني / رقم الجوال</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-emerald-500/50" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-[#0a192f] border border-slate-700 rounded-xl py-3 px-10 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="admin@yuoser.com"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-300">كلمة المرور</label>
                                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">نسيت كلمة المرور؟</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-emerald-500/50" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-[#0a192f] border border-slate-700 rounded-xl py-3 px-10 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    dir="ltr"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-emerald-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.location.href = '/dashboard'}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5"
                        >
                            تسجيل الدخول الأن
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        ليس لديك حساب؟ <a href="#" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">تواصل مع الدعم الفني</a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
