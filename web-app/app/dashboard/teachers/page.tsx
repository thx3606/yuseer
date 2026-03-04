'use client';

import { motion } from 'framer-motion';
import { Search, Filter, Mail, Phone, MoreVertical, Plus, GraduationCap } from 'lucide-react';

const teachersData = [
    { id: 1, name: 'الشيخ عبدالباسط محمد', classes: 'حلقة الإمام ورش', students: 15, rating: 4.8, status: 'نشط' },
    { id: 2, name: 'الشيخ محمد محمود', classes: 'حلقة الإمام نافع', students: 25, rating: 4.9, status: 'نشط' },
    { id: 3, name: 'الشيخ عمر بن الخطاب', classes: 'الجزء الأول', students: 10, rating: 4.5, status: 'إجازة' },
    { id: 4, name: 'الشيخ أبوبكر الصديق', classes: 'المتون العلمية', students: 30, rating: 5.0, status: 'نشط' },
];

export default function TeachersPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-primary tracking-tight">إدارة المعلمين</h2>
                    <p className="text-muted-foreground mt-2">إدارة الهيئة التعليمية وتقييمات الأداء</p>
                </div>

                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة معلم
                </button>
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
                            placeholder="ابحث بالاسم، التخصص..."
                        />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors text-foreground font-medium w-full sm:w-auto justify-center">
                        <Filter className="w-5 h-5" />
                        تصفية
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {teachersData.map((teacher, idx) => (
                        <motion.div
                            key={teacher.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border border-border/50 rounded-2xl p-6 hover:shadow-md transition-all group bg-background"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{teacher.name}</h3>
                                        <p className="text-sm text-primary font-medium">{teacher.classes}</p>
                                    </div>
                                </div>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-muted p-3 rounded-xl border border-border/50">
                                    <p className="text-xs text-muted-foreground mb-1">الطلاب</p>
                                    <p className="text-lg font-bold text-foreground">{teacher.students}</p>
                                </div>
                                <div className="bg-muted p-3 rounded-xl border border-border/50">
                                    <p className="text-xs text-muted-foreground mb-1">التقييم</p>
                                    <p className="text-lg font-bold text-foreground flex items-center gap-1">
                                        <span className="text-amber-500">★</span> {teacher.rating}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    مراسلة
                                </button>
                                <div className="w-px h-4 bg-border"></div>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    اتصال
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
