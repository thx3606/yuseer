'use client';

import { Bell, Search, User, Building, ChevronDown } from 'lucide-react';

export function Header() {
    return (
        <header className="h-20 bg-card border-b border-border/50 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-card/80">
            <div className="flex-1 flex max-w-md">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pr-10 pl-3 py-2.5 border border-border rounded-xl leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm"
                        placeholder="ابحث عن طالب، معلم، أو حلقة..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-full">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1.5 right-2 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
                </button>

                <div className="h-8 w-px bg-border mx-2"></div>

                <button className="flex items-center gap-3 hover:bg-primary/5 p-2 pr-4 rounded-xl transition-colors border border-transparent hover:border-primary/20 bg-background/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Building className="w-4 h-4" />
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-foreground">جمعية المكنون</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tenant Admin</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground ml-2 hidden sm:block" />
                </button>

                <div className="h-8 w-px bg-border mx-2"></div>

                <button className="flex items-center gap-3 hover:bg-primary/5 p-2 rounded-xl transition-colors">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-foreground">مدير النظام</p>
                        <p className="text-xs text-muted-foreground">أحمد محمد</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                </button>
            </div>
        </header>
    );
}
