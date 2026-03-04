import type { Metadata } from 'next';
import './globals.css';
import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
    subsets: ['arabic'],
    weight: ['200', '300', '400', '500', '700', '800', '900'],
    variable: '--font-tajawal'
});

export const metadata: Metadata = {
    title: 'يسر | Yuoser - نظام إدارة مدارس التحفيظ',
    description: 'نظام متكامل واحترافي لإدارة مدارس تحفيظ القرآن الكريم والمتون العلمية',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <body className={`${tajawal.variable} font-sans bg-background text-foreground antialiased`}>
                {children}
            </body>
        </html>
    );
}
