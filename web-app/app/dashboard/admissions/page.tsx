'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, User, Phone, FileText, Filter, Search } from 'lucide-react';

const MOCK_ADMISSIONS = [
    {
        id: '1',
        studentCode: 'STU241284',
        name: 'عبدالرحمن محمد العبدالله',
        age: 12,
        gender: 'MALE',
        phone: '0501234567',
        preferredShift: 'العصر',
        previousMemorization: '3 أجزاء',
        status: 'QUEUE',
        date: '2024-03-01'
    },
    {
        id: '2',
        studentCode: 'STU248374',
        name: 'سارة خالد عبدالعزيز',
        age: 10,
        gender: 'FEMALE',
        phone: '0559876543',
        preferredShift: 'المغرب',
        previousMemorization: 'جزء عم',
        status: 'QUEUE',
        date: '2024-03-02'
    },
    {
        id: '3',
        studentCode: 'STU249912',
        name: 'عمر فهد السالم',
        age: 15,
        gender: 'MALE',
        phone: '0561122334',
        preferredShift: 'العصر',
        previousMemorization: 'لم يسبق له الحفظ',
        status: 'QUEUE',
        date: '2024-03-03'
    }
];

export default function AdmissionsQueuePage() {
    const [admissions, setAdmissions] = useState(MOCK_ADMISSIONS);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        // In a real app, this would call the API: PUT /api/v1/admissions/:id/status
        setAdmissions(admissions.filter(a => a.id !== id));
    };

    const filteredAdmissions = admissions.filter(a =>
        a.name.includes(searchQuery) || a.studentCode.includes(searchQuery)
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-primary tracking-tight">قائمة الانتظار والقبول</h2>
                    <p className="text-muted-foreground mt-2">إدارة طلبات التسجيل الجديدة في جمعيتكم وتحويلهم إلى فترات وحلقات.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full md:w-64 pr-10 pl-3 py-2 border border-border rounded-xl leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm"
                            placeholder="بحث بالاسم أو الرقم..."
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-xl hover:bg-muted transition-colors text-sm font-medium">
                        <Filter className="w-4 h-4" />
                        تصفية
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
                    <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">طلبات قيد الانتظار</p>
                        <p className="text-2xl font-bold text-foreground">{admissions.length}</p>
                    </div>
                </div>
                {/* Add more stats if needed */}
            </div>

            <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border/50">
                                <th className="px-6 py-4 text-sm font-semibold text-foreground">الطالب</th>
                                <th className="px-6 py-4 text-sm font-semibold text-foreground">رقم الملف</th>
                                <th className="px-6 py-4 text-sm font-semibold text-foreground">الحفظ السابق</th>
                                <th className="px-6 py-4 text-sm font-semibold text-foreground">الفترة المفضلة</th>
                                <th className="px-6 py-4 text-sm font-semibold text-foreground">تاريخ الطلب</th>
                                <th className="px-6 py-4 text-sm font-semibold text-foreground text-center">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredAdmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        لا توجد طلبات في قائمة الانتظار حالياً
                                    </td>
                                </tr>
                            ) : (
                                filteredAdmissions.map((admission, index) => (
                                    <motion.tr
                                        key={admission.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {admission.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">{admission.name}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Phone className="w-3 h-3" /> {admission.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                                {admission.studentCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground">
                                            {admission.previousMemorization}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground">
                                            {admission.preferredShift}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {admission.date}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleAction(admission.id, 'approve')}
                                                    className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-colors group relative"
                                                    title="قبول الطالب"
                                                >
                                                    <Check className="w-5 h-5" />
                                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">قبول</span>
                                                </button>
                                                <button
                                                    onClick={() => handleAction(admission.id, 'reject')}
                                                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 focus:outline-none transition-colors group relative"
                                                    title="رفض الطلب"
                                                >
                                                    <X className="w-5 h-5" />
                                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-rose-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">رفض</span>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
