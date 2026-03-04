import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إدخال البيانات...\n');

  // حذف البيانات القديمة
  console.log('🗑️  حذف البيانات القديمة...');
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Organization" CASCADE`;

  const hashedPassword = await bcrypt.hash('123456', 10);

  // =====================================================
  // 1. إنشاء الجمعية
  // =====================================================
  console.log('\n📋 إنشاء الجمعية الخيرية...');
  const organization = await prisma.organization.create({
    data: {
      nameAr: 'جمعية البر الخيرية لتحفيظ القرآن الكريم',
      nameEn: 'Al-Birr Charitable Society for Quran Memorization',
      email: 'info@albirr-quran.org',
      phone: '+966501234567',
      country: 'المملكة العربية السعودية',
      city: 'الرياض',
      address: 'حي النخيل، شارع الملك فهد',
      description: 'جمعية خيرية متخصصة في تحفيظ القرآن الكريم وتعليم العلوم الشرعية',
      isActive: true,
    },
  });
  console.log('✅ تم إنشاء الجمعية:', organization.nameAr);

  // =====================================================
  // 2. إنشاء المسؤول الرئيسي
  // =====================================================
  console.log('\n👤 إنشاء المسؤول الرئيسي...');
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@albirr.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      profile: {
        create: {
          firstName: 'عبدالله',
          lastName: 'المدير',
          firstNameAr: 'عبدالله',
          lastNameAr: 'المدير',
          gender: 'MALE',
          dateOfBirth: new Date('1980-05-15'),
          nationality: 'سعودي',
          phoneNumber: '+966501234567',
          address: 'الرياض، حي النخيل',
        },
      },
    },
  });
  console.log('✅ المسؤول: admin@albirr.com / 123456');

  // =====================================================
  // 3. إنشاء مدير الجمعية
  // =====================================================
  console.log('\n👤 إنشاء مدير الجمعية...');
  const orgAdmin = await prisma.user.create({
    data: {
      email: 'manager@albirr.com',
      password: hashedPassword,
      role: 'ORGANIZATION_ADMIN',
      profile: {
        create: {
          firstName: 'خالد',
          lastName: 'الإداري',
          firstNameAr: 'خالد',
          lastNameAr: 'الإداري',
          gender: 'MALE',
          dateOfBirth: new Date('1985-03-20'),
          nationality: 'سعودي',
          phoneNumber: '+966502345678',
          address: 'الرياض، حي الملقا',
        },
      },
      organizationAdmin: {
        create: {
          organizationId: organization.id,
          department: 'الإدارة العامة',
          position: 'مدير الجمعية',
        },
      },
    },
  });
  console.log('✅ المدير: manager@albirr.com / 123456');

  // =====================================================
  // 4. إنشاء المدرسة
  // =====================================================
  console.log('\n🏫 إنشاء المدرسة...');
  const school = await prisma.school.create({
    data: {
      nameAr: 'مدرسة البر لتحفيظ القرآن الكريم',
      nameEn: 'Al-Birr Quran Memorization School',
      organizationId: organization.id,
      schoolType: 'QURAN',
      phone: '+966501234567',
      email: 'school@albirr.com',
      city: 'الرياض',
      address: 'حي النخيل',
      capacity: 200,
      isActive: true,
    },
  });
  console.log('✅ المدرسة:', school.nameAr);

  // =====================================================
  // 5. إنشاء المعلمين
  // =====================================================
  console.log('\n👨‍🏫 إنشاء المعلمين...');

  const teachersData = [
    {
      firstName: 'أحمد',
      lastName: 'الحافظ',
      email: 'ahmed@albirr.com',
      specialization: 'تحفيظ القرآن الكريم',
      phone: '+966503456789',
    },
    {
      firstName: 'محمد',
      lastName: 'القارئ',
      email: 'mohammed@albirr.com',
      specialization: 'تحفيظ القرآن وتجويد',
      phone: '+966504567890',
    },
    {
      firstName: 'فاطمة',
      lastName: 'المعلمة',
      email: 'fatima@albirr.com',
      specialization: 'القاعدة النورانية',
      phone: '+966505678901',
      gender: 'FEMALE' as const,
    },
  ];

  const teachers = [];
  for (const teacherData of teachersData) {
    const teacher = await prisma.user.create({
      data: {
        email: teacherData.email,
        password: hashedPassword,
        role: 'TEACHER',
        profile: {
          create: {
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            firstNameAr: teacherData.firstName,
            lastNameAr: teacherData.lastName,
            gender: teacherData.gender || 'MALE',
            dateOfBirth: new Date('1985-01-01'),
            nationality: 'سعودي',
            phoneNumber: teacherData.phone,
            address: 'الرياض',
          },
        },
        teacher: {
          create: {
            organizationId: organization.id,
            schoolId: school.id,
            specialization: teacherData.specialization,
            qualifications: 'بكالوريوس شريعة',
            yearsOfExperience: 10,
            hireDate: new Date('2020-01-01'),
          },
        },
      },
      include: { teacher: true },
    });
    teachers.push(teacher);
    console.log(`✅ ${teacherData.firstName}: ${teacherData.email} / 123456`);
  }

  // =====================================================
  // 6. إنشاء الحلقات
  // =====================================================
  console.log('\n📚 إنشاء الحلقات...');

  const class1 = await prisma.class.create({
    data: {
      nameAr: 'حلقة الحفظ المتقدم',
      nameEn: 'Advanced Memorization Circle',
      organizationId: organization.id,
      schoolId: school.id,
      teacherId: teachers[0].teacher!.id,
      subjectType: 'QURAN',
      level: 'متقدم',
      description: 'حلقة لحفظ القرآن الكريم للطلاب المتقدمين',
      maxStudents: 15,
      schedule: 'الأحد، الثلاثاء، الخميس - 5:00 م',
      location: 'القاعة الرئيسية',
      startDate: new Date('2024-01-01'),
      isActive: true,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      nameAr: 'حلقة الحفظ المبتدئين',
      nameEn: 'Beginners Circle',
      organizationId: organization.id,
      schoolId: school.id,
      teacherId: teachers[1].teacher!.id,
      subjectType: 'QURAN',
      level: 'مبتدئ',
      description: 'حلقة للطلاب المبتدئين',
      maxStudents: 20,
      schedule: 'السبت، الإثنين، الأربعاء - 4:00 م',
      location: 'القاعة الثانية',
      startDate: new Date('2024-01-01'),
      isActive: true,
    },
  });

  const class3 = await prisma.class.create({
    data: {
      nameAr: 'حلقة القاعدة النورانية',
      nameEn: 'Noorani Qaida Circle',
      organizationId: organization.id,
      schoolId: school.id,
      teacherId: teachers[2].teacher!.id,
      subjectType: 'NOORANI',
      level: 'تأسيسي',
      description: 'حلقة القاعدة النورانية',
      maxStudents: 25,
      schedule: 'يومياً - 3:00 م',
      location: 'القاعة الثالثة',
      startDate: new Date('2024-01-01'),
      isActive: true,
    },
  });

  console.log('✅ تم إنشاء 3 حلقات');

  // =====================================================
  // 7. إنشاء أولياء الأمور والطلاب
  // =====================================================
  console.log('\n👨‍👩‍👦 إنشاء أولياء الأمور والطلاب...');

  const studentsData = [
    {
      studentName: 'عبدالرحمن',
      guardianName: 'أحمد محمد',
      email: 'student1@test.com',
      guardianEmail: 'guardian1@test.com',
      phone: '+966507001001',
      classId: class1.id,
      dob: new Date('2010-03-15'),
    },
    {
      studentName: 'محمد',
      guardianName: 'خالد عبدالله',
      email: 'student2@test.com',
      guardianEmail: 'guardian2@test.com',
      phone: '+966507002002',
      classId: class1.id,
      dob: new Date('2011-07-20'),
    },
    {
      studentName: 'يوسف',
      guardianName: 'سعيد علي',
      email: 'student3@test.com',
      guardianEmail: 'guardian3@test.com',
      phone: '+966507003003',
      classId: class2.id,
      dob: new Date('2012-01-10'),
    },
    {
      studentName: 'مريم',
      guardianName: 'عبدالله إبراهيم',
      email: 'student4@test.com',
      guardianEmail: 'guardian4@test.com',
      phone: '+966507004004',
      classId: class3.id,
      dob: new Date('2014-09-12'),
      gender: 'FEMALE' as const,
    },
  ];

  for (const data of studentsData) {
    // إنشاء ولي الأمر
    const guardian = await prisma.user.create({
      data: {
        email: data.guardianEmail,
        password: hashedPassword,
        role: 'GUARDIAN',
        profile: {
          create: {
            firstName: data.guardianName.split(' ')[0],
            lastName: data.guardianName.split(' ')[1] || 'ولي أمر',
            firstNameAr: data.guardianName.split(' ')[0],
            lastNameAr: data.guardianName.split(' ')[1] || 'ولي أمر',
            gender: 'MALE',
            phoneNumber: data.phone,
            nationality: 'سعودي',
            address: 'الرياض',
          },
        },
        guardian: {
          create: {
            organizationId: organization.id,
            relationToStudent: 'والد',
          },
        },
      },
      include: { guardian: true },
    });

    // إنشاء الطالب
    const student = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'STUDENT',
        profile: {
          create: {
            firstName: data.studentName,
            lastName: data.guardianName.split(' ')[1] || '',
            firstNameAr: data.studentName,
            lastNameAr: data.guardianName.split(' ')[1] || '',
            gender: data.gender || 'MALE',
            dateOfBirth: data.dob,
            nationality: 'سعودي',
            phoneNumber: data.phone,
            address: 'الرياض',
          },
        },
        student: {
          create: {
            organizationId: organization.id,
            schoolId: school.id,
            guardianId: guardian.guardian!.id,
            studentCode: `STD-${Date.now().toString().slice(-6)}`,
            status: 'ACTIVE',
            enrollmentDate: new Date('2024-01-01'),
            quranProgress: {
              create: {
                organizationId: organization.id,
                currentJuz: Math.floor(Math.random() * 30) + 1,
                currentSurah: Math.floor(Math.random() * 114) + 1,
                currentAyah: 1,
                currentPage: Math.floor(Math.random() * 604) + 1,
                totalPagesMemorized: Math.floor(Math.random() * 200),
              },
            },
          },
        },
      },
      include: { student: true },
    });

    // تسجيل الطالب في الحلقة
    await prisma.studentClass.create({
      data: {
        studentId: student.student!.id,
        classId: data.classId,
        enrollmentDate: new Date('2024-01-01'),
        isActive: true,
      },
    });

    console.log(`✅ ${data.studentName}: ${data.email} / 123456`);
    console.log(`   ولي الأمر: ${data.guardianEmail} / 123456`);
  }

  console.log('\n✅ تم إدخال جميع البيانات بنجاح!');
  console.log('\n========================================');
  console.log('🔐 معلومات تسجيل الدخول:');
  console.log('========================================\n');

  console.log('👑 المسؤول الرئيسي:');
  console.log('   Email: admin@albirr.com');
  console.log('   Password: 123456\n');

  console.log('👤 مدير الجمعية:');
  console.log('   Email: manager@albirr.com');
  console.log('   Password: 123456\n');

  console.log('👨‍🏫 المعلمون:');
  teachersData.forEach((t) => {
    console.log(`   ${t.firstName}: ${t.email} / 123456`);
  });

  console.log('\n👨‍🎓 الطلاب:');
  studentsData.forEach((s) => {
    console.log(`   ${s.studentName}: ${s.email} / 123456`);
    console.log(`   ولي الأمر: ${s.guardianEmail} / 123456`);
  });

  console.log('\n========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
