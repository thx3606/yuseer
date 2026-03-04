'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Plus, User, BookOpen } from 'lucide-react';
import Link from 'next/link';

const studentsData = [
    { id: 1, name: 'أحمد محمود العتيبي', level: 'الجزء الخامس', class: 'حلقة الإمام نافع', status: 'منتظم', progress: 85 },
    { id: 2, name: 'سالم عبدالله الدوسري', level: 'الجزء الأول', class: 'حلقة الإمام ورش', status: 'منتظم', progress: 40 },
    { id: 3, name: 'خالد إبراهيم الزهراني', level: 'كامل القرآن', class: 'حلقة الإقراع', status: 'متخرج', progress: 100 },
    { id: 4, name: 'فيصل عبدالرحمن القحطاني', level: 'الجزء العشرون', class: 'حلقة الإمام الكسائي', status: 'منقطع', progress: 65 },
    { id: 5, name: 'محمد سعد الشهراني', level: 'الجزء الثاني', class: 'حلقة الإمام نافع', status: 'منتظم', progress: 55 },
];

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-primary tracking-tight">إدارة الطلاب</h2>
                    <p className="text-muted-foreground mt-2">عرض وإدارة الحلقات القرآنية وتقييمات الطلاب</p>
                </div>

                <Link href="/dashboard/students/new" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة طالب جديد
                </Link>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/50">
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pr-10 pl-3 py-2.5 border border-border rounded-xl bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            placeholder="ابحث بالاسم، رقم الطالب..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors text-foreground font-medium w-full sm:w-auto justify-center">
                        <Filter className="w-5 h-5" />
                        تصفية
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border/50">
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground w-12">#</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">اسم الطالب</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">الحلقة</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">المستوى (القرآن)</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">نسبة الإنجاز</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">الحالة</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {studentsData.map((student, idx) => (
                                <motion.tr
                                    key={student.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">رقم: 4328{student.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-foreground">
                                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                                            {student.class}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-foreground">{student.level}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-full bg-border rounded-full h-2 max-w-[100px]">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground">{student.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${student.status === 'منتظم' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            student.status === 'متخرج' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground bg-card/50">
                    <p>عرض 1 إلى 5 من أصل 1,240 طالب</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50">السابق</button>
                        <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">التالي</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
