// سكريبت بسيط لإنشاء بيانات تجريبية
// Simple script to create demo data

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إنشاء البيانات التجريبية...\n');

  // حذف البيانات القديمة
  console.log('🗑️  حذف البيانات القديمة...');
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          'admin@albirr.com',
          'manager@albirr.com',
          'ahmed@albirr.com',
          'guardian1@test.com',
          'student1@test.com',
        ],
      },
    },
  });
  await prisma.organization.deleteMany({
    where: { email: 'info@albirr.com' },
  });
  console.log('✅ تم حذف البيانات القديمة\n');

  const hashedPassword = await bcrypt.hash('123456', 10);

  // 1. إنشاء الجمعية
  console.log('📋 إنشاء الجمعية...');
  const organization = await prisma.organization.create({
    data: {
      nameAr: 'جمعية البر الخيرية لتحفيظ القرآن الكريم',
      nameEn: 'Al-Birr Charitable Society for Quran Memorization',
      email: 'info@albirr.com',
      phone: '+966501234567',
      country: 'المملكة العربية السعودية',
      city: 'الرياض',
      address: 'حي النخيل، شارع الملك فهد',
      description: 'جمعية خيرية متخصصة في تحفيظ القرآن الكريم',
      isActive: true,
    },
  });
  console.log('✅ تم إنشاء:', organization.nameAr);

  // 2. إنشاء المدرسة
  console.log('\n🏫 إنشاء المدرسة...');
  const school = await prisma.school.create({
    data: {
      nameAr: 'مدرسة البر لتحفيظ القرآن',
      nameEn: 'Al-Birr Quran School',
      organizationId: organization.id,
      type: 'QURAN',
      description: 'مدرسة متخصصة في تحفيظ القرآن الكريم',
      maxStudents: 200,
      isActive: true,
    },
  });
  console.log('✅ تم إنشاء:', school.nameAr);

  // 3. إنشاء المسؤول
  console.log('\n👑 إنشاء المسؤول الرئيسي...');
  const admin = await prisma.user.create({
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
          phoneNumber: '+966501234567',
        },
      },
    },
  });
  console.log('✅ تم إنشاء: admin@albirr.com / 123456');

  // 4. إنشاء مدير الجمعية
  console.log('\n👤 إنشاء مدير الجمعية...');
  const manager = await prisma.user.create({
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
          phoneNumber: '+966502345678',
        },
      },
      organizationAdmin: {
        create: {
          organizationId: organization.id,
          position: 'مدير الجمعية',
        },
      },
    },
  });
  console.log('✅ تم إنشاء: manager@albirr.com / 123456');

  // 5. إنشاء معلم
  console.log('\n👨‍🏫 إنشاء معلم...');
  const teacher = await prisma.user.create({
    data: {
      email: 'ahmed@albirr.com',
      password: hashedPassword,
      role: 'TEACHER',
      profile: {
        create: {
          firstName: 'أحمد',
          lastName: 'الحافظ',
          firstNameAr: 'أحمد',
          lastNameAr: 'الحافظ',
          gender: 'MALE',
          phoneNumber: '+966503456789',
        },
      },
      teacher: {
        create: {
          specialization: 'تحفيظ القرآن الكريم',
          qualifications: ['بكالوريوس شريعة', 'إجازة في القراءات'],
          experienceYears: 10,
          isActive: true,
        },
      },
    },
    include: { teacher: true },
  });
  console.log('✅ تم إنشاء: ahmed@albirr.com / 123456');

  // 6. إنشاء حلقة
  console.log('\n📚 إنشاء حلقة...');
  const classRoom = await prisma.class.create({
    data: {
      nameAr: 'حلقة الحفظ المتقدم',
      nameEn: 'Advanced Memorization Circle',
      schoolId: school.id,
      level: 'متقدم',
      maxStudents: 15,
      schedule: {
        days: ['الأحد', 'الثلاثاء', 'الخميس'],
        time: '5:00 م - 7:00 م',
      },
      isActive: true,
    },
  });
  console.log('✅ تم إنشاء:', classRoom.nameAr);

  // ربط المعلم بالحلقة
  await prisma.teacherClass.create({
    data: {
      teacherId: teacher.teacher.id,
      classId: classRoom.id,
      isPrimary: true,
    },
  });

  // 7. إنشاء ولي أمر
  console.log('\n👨‍👦 إنشاء ولي أمر...');
  const guardian = await prisma.user.create({
    data: {
      email: 'guardian1@test.com',
      password: hashedPassword,
      role: 'GUARDIAN',
      profile: {
        create: {
          firstName: 'محمد',
          lastName: 'أحمد',
          firstNameAr: 'محمد',
          lastNameAr: 'أحمد',
          gender: 'MALE',
          phoneNumber: '+966507001001',
        },
      },
      guardian: {
        create: {
          relationship: 'والد',
          occupation: 'موظف',
        },
      },
    },
    include: { guardian: true },
  });
  console.log('✅ تم إنشاء: guardian1@test.com / 123456');

  // 8. إنشاء طالب
  console.log('\n👨‍🎓 إنشاء طالب...');
  const student = await prisma.user.create({
    data: {
      email: 'student1@test.com',
      password: hashedPassword,
      role: 'STUDENT',
      profile: {
        create: {
          firstName: 'عبدالرحمن',
          lastName: 'محمد',
          firstNameAr: 'عبدالرحمن',
          lastNameAr: 'محمد',
          gender: 'MALE',
          dateOfBirth: new Date('2010-03-15'),
          phoneNumber: '+966507001001',
        },
      },
      student: {
        create: {
          guardianId: guardian.guardian.id,
          studentCode: 'STD-001',
          status: 'ACTIVE',
          enrollmentDate: new Date(),
        },
      },
    },
    include: { student: true },
  });
  console.log('✅ تم إنشاء: student1@test.com / 123456');

  // إنشاء تقدم الطالب في القرآن
  await prisma.quranProgress.create({
    data: {
      studentId: student.student.id,
      currentJuz: 1,
      currentSurah: 1,
      currentPage: 1,
      totalPagesMemorized: 10,
      completionPercentage: 1.7,
    },
  });

  // إنشاء تقدم الطالب في النورانية
  await prisma.nooraniProgress.create({
    data: {
      studentId: student.student.id,
      currentLesson: 1,
    },
  });

  // 9. تسجيل الطالب في الحلقة
  console.log('\n📝 تسجيل الطالب في الحلقة...');
  await prisma.studentClass.create({
    data: {
      studentId: student.student.id,
      classId: classRoom.id,
      enrollmentDate: new Date(),
      isActive: true,
    },
  });
  console.log('✅ تم تسجيل الطالب في الحلقة');

  console.log('\n========================================');
  console.log('✅ تم إنشاء جميع البيانات بنجاح!');
  console.log('========================================\n');

  console.log('🔐 معلومات تسجيل الدخول:\n');
  console.log('👑 المسؤول الرئيسي:');
  console.log('   Email: admin@albirr.com');
  console.log('   Password: 123456\n');

  console.log('👤 مدير الجمعية:');
  console.log('   Email: manager@albirr.com');
  console.log('   Password: 123456\n');

  console.log('👨‍🏫 المعلم:');
  console.log('   Email: ahmed@albirr.com');
  console.log('   Password: 123456\n');

  console.log('👨‍👦 ولي الأمر:');
  console.log('   Email: guardian1@test.com');
  console.log('   Password: 123456\n');

  console.log('👨‍🎓 الطالب:');
  console.log('   Email: student1@test.com');
  console.log('   Password: 123456\n');

  console.log('========================================');
  console.log('📝 البيانات المنشأة:');
  console.log('========================================');
  console.log(`   الجمعيات: 1`);
  console.log(`   المدارس: 1`);
  console.log(`   المستخدمين: 5`);
  console.log(`   الحلقات: 1`);
  console.log('========================================\n');

  console.log('🚀 الآن يمكنك تجربة النظام!');
  console.log('📖 راجع ملف TESTING_GUIDE.md للتفاصيل\n');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
