'use client';

import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Clock, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
    { name: 'إجمالي الطلاب', value: '1,240', icon: Users, change: '+12%', changeType: 'positive' },
    { name: 'المعلمين', value: '85', icon: GraduationCap, change: '+2', changeType: 'positive' },
    { name: 'الحلقات النشطة', value: '64', icon: BookOpen, change: '0%', changeType: 'neutral' },
    { name: 'ساعات الحفظ (اليوم)', value: '320', icon: Clock, change: '+15%', changeType: 'positive' },
];

const data = [
    { name: 'السبت', pages: 400, students: 240 },
    { name: 'الأحد', pages: 300, students: 139 },
    { name: 'الإثنين', pages: 200, students: 980 },
    { name: 'الثلاثاء', pages: 278, students: 390 },
    { name: 'الأربعاء', pages: 189, students: 480 },
    { name: 'الخميس', pages: 239, students: 380 },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-primary tracking-tight">نظرة عامة</h2>
                <p className="text-muted-foreground mt-2">مرحباً بك مجدداً في نظام يسر لإدارة مدارس التحفيظ. إليك إحصائيات اليوم.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                                <p className="text-3xl font-black mt-2 text-foreground">{stat.value}</p>
                            </div>
                            <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={`font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-500'}`}>
                                {stat.change}
                            </span>
                            <span className="text-muted-foreground mr-2">مقارنة بالأسبوع الماضي</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-card p-6 rounded-3xl border border-border/50 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-foreground">إحصائيات الحفظ الأسبوعية</h3>
                        <button className="text-sm text-primary font-medium bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">
                            عرض التفاصيل
                        </button>
                    </div>
                    <div className="h-80 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="pages" name="الصفحات المحفوظة" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="students" name="الطلاب الحاضرين" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-foreground">النشاطات الحديثة</h3>
                        <Activity className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="relative flex-col items-center flex">
                                    <div className="w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20 z-10" />
                                    {i !== 5 && <div className="w-px h-full bg-border absolute top-3" />}
                                </div>
                                <div className="pb-2">
                                    <p className="text-sm font-semibold text-foreground">إتمام حفظ جزء عم</p>
                                    <p className="text-xs text-muted-foreground mt-1">الطالب: أحمد محمد - حلقة الإمام نافع</p>
                                    <p className="text-[10px] text-gray-400 mt-1">منذ ساعتين</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                        عرض كل النشاطات
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
