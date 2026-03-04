'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Building2, Ticket, Settings, Bell, Search, ShieldAlert, CheckCircle2, TicketPercent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORM_NAV = [
    { name: 'الإحصائيات', href: '/admin', icon: LayoutDashboard },
    { name: 'طلبات الانضمام', href: '/admin/onboarding', icon: ShieldAlert, badge: 3 },
    { name: 'الجمعيات والمشتركين', href: '/admin/tenants', icon: Building2 },
    { name: 'المدفوعات', href: '/admin/payments', icon: CreditCard },
    { name: 'كوبونات الخصم', href: '/admin/coupons', icon: TicketPercent },
    { name: 'طاقم المنصة', href: '/admin/staff', icon: Users },
    { name: 'تذاكر الدعم', href: '/admin/support', icon: Ticket },
    { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
];

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex rtl" dir="rtl">

            {/* Super Admin Sidebar (Distinct from Tenant Dashboard) */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="fixed inset-y-0 right-0 z-50 bg-[#0f172a] text-slate-300 border-l border-slate-800 shadow-2xl flex flex-col hidden md:flex"
                    >
                        <div className="p-6 pb-2">
                            <div className="flex items-center gap-3 text-white mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 font-bold text-xl">
                                    Y
                                </div>
                                <div>
                                    <h1 className="font-bold text-xl tracking-wide">YUOSER <span className="text-indigo-400 font-light">NXI</span></h1>
                                    <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Platform Owner</p>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1 scrollbar-hide">
                            <p className="px-4 text-xs font-bold text-slate-500 mb-4 tracking-wider uppercase">الإدارة المركزية</p>
                            {PLATFORM_NAV.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.name} href={item.href}>
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group overflow-hidden ${isActive ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}>
                                            {isActive && (
                                                <motion.div layoutId="platform-nav-indicator" className="absolute right-0 w-1 inset-y-1 bg-indigo-500 rounded-l-full" />
                                            )}
                                            <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            <span>{item.name}</span>
                                            {item.badge && (
                                                <span className="mr-auto bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded-full font-bold">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-slate-800/50">
                            <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-3 border border-slate-800">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex justify-center items-center text-indigo-400">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-white truncate">Mazen</p>
                                    <p className="text-xs text-slate-400 truncate">Super Admin</p>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:pr-[280px]' : ''}`}>

                {/* Platform Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 h-20 flex items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block w-72">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ابحث في الجمعيات، الفواتير، التذاكر..."
                                className="w-full pl-4 pr-10 py-2.5 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
                        </button>
                        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">All Systems Normal</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
