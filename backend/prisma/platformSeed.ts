import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Platform Owner Seeding...');

    // 1. Create Super Admin Role
    const superAdminRole = await prisma.platformRole.upsert({
        where: { id: 'super-admin-role' },
        update: {},
        create: {
            id: 'super-admin-role',
            name: 'Super Admin',
            permissions: [
                'view_dashboard',
                'manage_onboarding',
                'view_tenants',
                'suspend_tenants',
                'manage_plans',
                'manage_coupons',
                'view_payments',
                'refund_payments',
                'manage_tickets',
                'manage_staff'
            ]
        }
    });

    // 2. Create the Platform Owner user
    const hashedPassword = await bcrypt.hash('admin123!', 10);

    await prisma.platformUser.upsert({
        where: { email: 'owner@yuoser.com' },
        update: {},
        create: {
            email: 'owner@yuoser.com',
            name: 'Mazen (Platform Owner)',
            password: hashedPassword,
            roleId: superAdminRole.id,
            isActive: true
        }
    });

    console.log('✅ Default Platform Owner and Role seeded successfully!');
    console.log('Email: owner@yuoser.com');
    console.log('Password: admin123!');
}

main()
    .catch((e) => {
        console.error('❌ Failed to seed Platform Owner:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
