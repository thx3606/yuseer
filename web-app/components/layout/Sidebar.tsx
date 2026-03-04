'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Settings,
    MessageSquare,
    Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'الرئيسية', href: '/dashboard', icon: LayoutDashboard },
    { name: 'الطلاب', href: '/dashboard/students', icon: Users },
    { name: 'المعلمين', href: '/dashboard/teachers', icon: GraduationCap },
    { name: 'الحلقات المدرسية', href: '/dashboard/classes', icon: BookOpen },
    { name: 'التقييمات والاختبارات', href: '/dashboard/exams', icon: Award },
    { name: 'الرسائل', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-card border-l border-border/50 hidden md:flex flex-col shadow-sm">
            <div className="p-6 flex items-center justify-center border-b border-border/50">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-primary">يُسْر</h1>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} href={item.href}>
                            <span
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group",
                                    isActive ? "text-primary-foreground font-bold" : "text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/90 -z-10 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon className={cn("w-5 h-5 z-10", isActive ? "text-primary-foreground" : "")} />
                                <span className="z-10">{item.name}</span>
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 flex flex-col items-center text-center">
                    <p className="text-sm font-semibold text-foreground mb-1">نسخة مدير النظام</p>
                    <p className="text-xs text-muted-foreground">الإصدار 2.0</p>
                </div>
            </div>
        </aside>
    );
}
