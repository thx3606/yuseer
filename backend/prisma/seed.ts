import { PrismaClient, UserRole, Gender, StudentStatus, MemorizationLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إدخال البيانات الأولية...');
  console.log('Starting database seeding...\n');

  // حذف البيانات القديمة
  console.log('🗑️  حذف البيانات القديمة...');
  await prisma.quranEvaluation.deleteMany();
  await prisma.mutoonEvaluation.deleteMany();
  await prisma.nooraniEvaluation.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.quranProgress.deleteMany();
  await prisma.mutoonProgress.deleteMany();
  await prisma.nooraniProgress.deleteMany();
  await prisma.classEnrollment.deleteMany();
  await prisma.class.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const hashedPassword = await bcrypt.hash('123456', 10);

  // =====================================================
  // 1. إنشاء الجمعية الخيرية
  // =====================================================
  console.log('\n📋 إنشاء الجمعية الخيرية...');
  const organization = await prisma.organization.create({
    data: {
      nameAr: 'جمعية البر الخيرية لتحفيظ القرآن الكريم',
      nameEn: 'Al-Birr Charitable Society for Quran Memorization',
      code: 'ALB-001',
      email: 'info@albirr-quran.org',
      phone: '+966501234567',
      country: 'المملكة العربية السعودية',
      city: 'الرياض',
      address: 'حي النخيل، شارع الملك فهد',
      description: 'جمعية خيرية متخصصة في تحفيظ القرآن الكريم وتعليم العلوم الشرعية',
      establishedDate: new Date('2010-01-01'),
      isActive: true,
    },
  });
  console.log('✅ تم إنشاء الجمعية:', organization.nameAr);

  // =====================================================
  // 2. إنشاء المسؤول الرئيسي (Super Admin)
  // =====================================================
  console.log('\n👤 إنشاء المسؤول الرئيسي...');
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@albirr.com',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      organizationId: organization.id,
      profile: {
        create: {
          firstName: 'عبدالله',
          lastName: 'المدير',
          gender: Gender.MALE,
          dateOfBirth: new Date('1980-05-15'),
          nationality: 'سعودي',
          nationalId: '1011223344',
          phone: '+966501234567',
          address: 'الرياض، حي النخيل',
        },
      },
    },
    include: { profile: true },
  });
  console.log('✅ تم إنشاء المسؤول: admin@albirr.com / 123456');

  // =====================================================
  // 3. إنشاء مدير الجمعية (Admin)
  // =====================================================
  console.log('\n👤 إنشاء مدير الجمعية...');
  const admin = await prisma.user.create({
    data: {
      email: 'manager@albirr.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      organizationId: organization.id,
      profile: {
        create: {
          firstName: 'خالد',
          lastName: 'الإداري',
          gender: Gender.MALE,
          dateOfBirth: new Date('1985-03-20'),
          nationality: 'سعودي',
          nationalId: '1022334455',
          phone: '+966502345678',
          address: 'الرياض، حي الملقا',
        },
      },
    },
    include: { profile: true },
  });
  console.log('✅ تم إنشاء المدير: manager@albirr.com / 123456');

  // =====================================================
  // 4. إنشاء المعلمين
  // =====================================================
  console.log('\n👨‍🏫 إنشاء المعلمين...');

  const teachersData = [
    {
      firstName: 'أحمد',
      lastName: 'الحافظ',
      email: 'ahmed@albirr.com',
      specialization: 'تحفيظ القرآن الكريم - رواية حفص',
      qualification: 'بكالوريوس شريعة - إجازة في القراءات',
      experience: 15,
      phone: '+966503456789',
      nationalId: '1033445566',
    },
    {
      firstName: 'محمد',
      lastName: 'القارئ',
      email: 'mohammed@albirr.com',
      specialization: 'تحفيظ القرآن الكريم وتجويد',
      qualification: 'ماجستير في القراءات - إجازة برواية حفص وشعبة',
      experience: 12,
      phone: '+966504567890',
      nationalId: '1044556677',
    },
    {
      firstName: 'فاطمة',
      lastName: 'المعلمة',
      email: 'fatima@albirr.com',
      specialization: 'القاعدة النورانية وتحفيظ القرآن للمبتدئين',
      qualification: 'دبلوم تحفيظ القرآن - شهادة القاعدة النورانية',
      experience: 8,
      phone: '+966505678901',
      nationalId: '1055667788',
      gender: Gender.FEMALE,
    },
    {
      firstName: 'عائشة',
      lastName: 'الحافظة',
      email: 'aisha@albirr.com',
      specialization: 'المتون العلمية وتحفيظ القرآن',
      qualification: 'بكالوريوس شريعة - حافظة للقرآن الكريم',
      experience: 10,
      phone: '+966506789012',
      nationalId: '1066778899',
      gender: Gender.FEMALE,
    },
  ];

  const teachers = [];
  for (const teacherData of teachersData) {
    const teacher = await prisma.user.create({
      data: {
        email: teacherData.email,
        password: hashedPassword,
        role: UserRole.TEACHER,
        organizationId: organization.id,
        profile: {
          create: {
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            gender: teacherData.gender || Gender.MALE,
            dateOfBirth: new Date('1985-01-01'),
            nationality: 'سعودي',
            nationalId: teacherData.nationalId,
            phone: teacherData.phone,
            address: 'الرياض',
          },
        },
        teacher: {
          create: {
            specialization: teacherData.specialization,
            qualification: teacherData.qualification,
            yearsOfExperience: teacherData.experience,
            organizationId: organization.id,
          },
        },
      },
      include: { profile: true, teacher: true },
    });
    teachers.push(teacher);
    console.log(`✅ ${teacherData.firstName}: ${teacherData.email} / 123456`);
  }

  // =====================================================
  // 5. إنشاء الحلقات
  // =====================================================
  console.log('\n📚 إنشاء الحلقات...');

  const class1 = await prisma.class.create({
    data: {
      nameAr: 'حلقة الحفظ المتقدم',
      nameEn: 'Advanced Memorization Circle',
      code: 'ADV-001',
      type: 'QURAN',
      description: 'حلقة لحفظ القرآن الكريم للطلاب المتقدمين',
      maxStudents: 15,
      teacherId: teachers[0].teacher!.id,
      organizationId: organization.id,
      schedule: 'الأحد، الثلاثاء، الخميس - 5:00 م إلى 7:00 م',
      location: 'القاعة الرئيسية - الدور الأول',
      startDate: new Date('2024-01-01'),
      isActive: true,
    },
  });
  console.log('✅ تم إنشاء حلقة:', class1.nameAr);

  const class2 = await prisma.class.create({
    data: {
      nameAr: 'حلقة الحفظ المبتدئين',
      nameEn: 'Beginners Memorization Circle',
      code: 'BEG-001',
      type: 'QURAN',
      description: 'حلقة لحفظ القرآن الكريم للطلاب المبتدئين',
      maxStudents: 20,
      teacherId: teachers[1].teacher!.id,
      organizationId: organization.id,
      schedule: 'السبت، الإثنين، الأربعاء - 4:00 م إلى 6:00 م',
      location: 'القاعة الثانية - الدور الأول',
      startDate: new Date('2024-01-01'),
      isActive: true,
    },
  });
  console.log('✅ تم إنشاء حلقة:', class2.nameAr);

  const class3 = await prisma.class.create({
    data: {
      nameAr: 'حلقة القاعدة النورانية',
      nameEn: 'Noorani Qaida Circle',
      code: 'NOR-001',
      type: 'NOORANI',
      description: 'حلقة لتعليم القاعدة النورانية للمبتدئين',
      maxStudents: 25,
      teacherId: teachers[2].teacher!.id,
      organizationId: organization.id,
      schedule: 'يومياً عدا الجمعة - 3:00 م إلى 4:30 م',
      location: 'القاعة الثالثة - الدور الأرضي',
      startDate: new Date('2024-01-01'),
      isActive: true,
    },
  });
  console.log('✅ تم إنشاء حلقة:', class3.nameAr);

  const class4 = await prisma.class.create({
    data: {
      nameAr: 'حلقة المتون العلمية',
      nameEn: 'Islamic Texts Circle',
      code: 'MTN-001',
      type: 'MUTOON',
      description: 'حلقة لحفظ المتون العلمية (الأربعين النووية، عمدة الأحكام)',
      maxStudents: 15,
      teacherId: teachers[3].teacher!.id,
      organizationId: organization.id,
      schedule: 'الأحد، الثلاثاء - 7:00 م إلى 8:30 م',
      location: 'القاعة الرابعة - الدور الثاني',
      startDate: new Date('2024-01-01'),
      isActive: true,
    },
  });
  console.log('✅ تم إنشاء حلقة:', class4.nameAr);

  // =====================================================
  // 6. إنشاء الطلاب
  // =====================================================
  console.log('\n👨‍🎓 إنشاء الطلاب...');

  const studentsData = [
    {
      firstName: 'عبدالرحمن',
      lastName: 'أحمد',
      email: 'student1@test.com',
      studentCode: 'STD-2024-001',
      dateOfBirth: new Date('2010-03-15'),
      guardianName: 'أحمد محمد',
      guardianPhone: '+966507001001',
      classId: class1.id,
      level: MemorizationLevel.VERY_GOOD,
      currentJuz: 25,
      currentPage: 490,
    },
    {
      firstName: 'محمد',
      lastName: 'خالد',
      email: 'student2@test.com',
      studentCode: 'STD-2024-002',
      dateOfBirth: new Date('2011-07-20'),
      guardianName: 'خالد عبدالله',
      guardianPhone: '+966507002002',
      classId: class1.id,
      level: MemorizationLevel.GOOD,
      currentJuz: 28,
      currentPage: 550,
    },
    {
      firstName: 'يوسف',
      lastName: 'سعيد',
      email: 'student3@test.com',
      studentCode: 'STD-2024-003',
      dateOfBirth: new Date('2012-01-10'),
      guardianName: 'سعيد علي',
      guardianPhone: '+966507003003',
      classId: class2.id,
      level: MemorizationLevel.ACCEPTABLE,
      currentJuz: 5,
      currentPage: 85,
    },
    {
      firstName: 'عمر',
      lastName: 'حسن',
      email: 'student4@test.com',
      studentCode: 'STD-2024-004',
      dateOfBirth: new Date('2013-05-25'),
      guardianName: 'حسن محمود',
      guardianPhone: '+966507004004',
      classId: class2.id,
      level: MemorizationLevel.BEGINNER,
      currentJuz: 2,
      currentPage: 25,
    },
    {
      firstName: 'مريم',
      lastName: 'عبدالله',
      email: 'student5@test.com',
      studentCode: 'STD-2024-005',
      dateOfBirth: new Date('2014-09-12'),
      guardianName: 'عبدالله إبراهيم',
      guardianPhone: '+966507005005',
      classId: class3.id,
      level: MemorizationLevel.BEGINNER,
      currentJuz: 30,
      currentPage: 582,
      gender: Gender.FEMALE,
    },
    {
      firstName: 'فاطمة',
      lastName: 'أحمد',
      email: 'student6@test.com',
      studentCode: 'STD-2024-006',
      dateOfBirth: new Date('2012-11-08'),
      guardianName: 'أحمد صالح',
      guardianPhone: '+966507006006',
      classId: class4.id,
      level: MemorizationLevel.GOOD,
      currentJuz: 15,
      currentPage: 285,
      gender: Gender.FEMALE,
    },
    {
      firstName: 'حمزة',
      lastName: 'طارق',
      email: 'student7@test.com',
      studentCode: 'STD-2024-007',
      dateOfBirth: new Date('2011-04-18'),
      guardianName: 'طارق فيصل',
      guardianPhone: '+966507007007',
      classId: class1.id,
      level: MemorizationLevel.EXCELLENT,
      currentJuz: 29,
      currentPage: 575,
    },
    {
      firstName: 'زيد',
      lastName: 'ماجد',
      email: 'student8@test.com',
      studentCode: 'STD-2024-008',
      dateOfBirth: new Date('2013-12-03'),
      guardianName: 'ماجد سعد',
      guardianPhone: '+966507008008',
      classId: class2.id,
      level: MemorizationLevel.ACCEPTABLE,
      currentJuz: 3,
      currentPage: 45,
    },
  ];

  const students = [];
  for (const studentData of studentsData) {
    const student = await prisma.user.create({
      data: {
        email: studentData.email,
        password: hashedPassword,
        role: UserRole.STUDENT,
        organizationId: organization.id,
        profile: {
          create: {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            gender: studentData.gender || Gender.MALE,
            dateOfBirth: studentData.dateOfBirth,
            nationality: 'سعودي',
            nationalId: `20${Math.floor(Math.random() * 100000000)}`,
            phone: studentData.guardianPhone,
            address: 'الرياض',
          },
        },
        student: {
          create: {
            studentCode: studentData.studentCode,
            status: StudentStatus.ACTIVE,
            guardianName: studentData.guardianName,
            guardianPhone: studentData.guardianPhone,
            guardianEmail: `guardian${students.length + 1}@test.com`,
            enrollmentDate: new Date('2024-01-01'),
            organizationId: organization.id,
            quranProgress: {
              create: {
                currentJuz: studentData.currentJuz,
                currentSurah: 1,
                currentPage: studentData.currentPage,
                memorizationLevel: studentData.level,
                totalPagesMemorized: studentData.currentPage,
                lastEvaluationDate: new Date(),
                organizationId: organization.id,
              },
            },
            nooraniProgress: {
              create: {
                currentLesson: Math.floor(Math.random() * 10) + 1,
                completedLessons: Math.floor(Math.random() * 8),
                organizationId: organization.id,
              },
            },
          },
        },
      },
      include: { profile: true, student: true },
    });

    // تسجيل الطالب في الحلقة
    await prisma.classEnrollment.create({
      data: {
        studentId: student.student!.id,
        classId: studentData.classId,
        enrollmentDate: new Date('2024-01-01'),
        isActive: true,
      },
    });

    students.push(student);
    console.log(`✅ ${studentData.firstName}: ${studentData.email} / 123456`);
  }

  // =====================================================
  // 7. إنشاء تقييمات نموذجية
  // =====================================================
  console.log('\n📊 إنشاء تقييمات نموذجية...');

  // تقييم للطالب الأول (متقدم)
  await prisma.quranEvaluation.create({
    data: {
      studentId: students[0].student!.id,
      teacherId: teachers[0].teacher!.id,
      classId: class1.id,
      type: 'HIFZ_NEW',
      fromSurah: 'الملك',
      toSurah: 'الملك',
      fromVerse: 1,
      toVerse: 10,
      tajweedScore: 95,
      hifzScore: 92,
      fluencyScore: 90,
      overallScore: 93,
      memorizationLevel: MemorizationLevel.EXCELLENT,
      tajweedErrors: JSON.stringify([
        { type: 'مد', description: 'مد منفصل في الآية 5' },
      ]),
      notes: 'ممتاز، حفظ متقن مع إتقان أحكام التجويد',
      evaluationDate: new Date(),
      organizationId: organization.id,
    },
  });

  await prisma.quranEvaluation.create({
    data: {
      studentId: students[2].student!.id,
      teacherId: teachers[1].teacher!.id,
      classId: class2.id,
      type: 'HIFZ_NEW',
      fromSurah: 'الفاتحة',
      toSurah: 'الفاتحة',
      fromVerse: 1,
      toVerse: 7,
      tajweedScore: 75,
      hifzScore: 80,
      fluencyScore: 70,
      overallScore: 76,
      memorizationLevel: MemorizationLevel.ACCEPTABLE,
      tajweedErrors: JSON.stringify([
        { type: 'غنة', description: 'عدم إظهار الغنة بشكل واضح' },
        { type: 'مد', description: 'قصر في المد الطبيعي' },
      ]),
      notes: 'جيد، يحتاج إلى مزيد من التدريب على التجويد',
      evaluationDate: new Date(),
      organizationId: organization.id,
    },
  });

  console.log('✅ تم إنشاء تقييمات القرآن');

  // تقييم القاعدة النورانية
  await prisma.nooraniEvaluation.create({
    data: {
      studentId: students[4].student!.id,
      teacherId: teachers[2].teacher!.id,
      classId: class3.id,
      lessonNumber: 5,
      lessonTitle: 'التنوين',
      score: 85,
      letterRecognition: 90,
      pronunciation: 85,
      fluency: 80,
      notes: 'جيد جداً، استيعاب ممتاز لدرس التنوين',
      evaluationDate: new Date(),
      organizationId: organization.id,
    },
  });

  console.log('✅ تم إنشاء تقييمات القاعدة النورانية');

  // تقييم المتون
  await prisma.mutoonEvaluation.create({
    data: {
      studentId: students[5].student!.id,
      teacherId: teachers[3].teacher!.id,
      classId: class4.id,
      matnName: 'الأربعين النووية',
      hadithNumber: '1',
      hadithText: 'إنما الأعمال بالنيات...',
      memorization: 90,
      understanding: 85,
      overallScore: 88,
      notes: 'حفظ متقن مع فهم جيد للحديث',
      evaluationDate: new Date(),
      organizationId: organization.id,
    },
  });

  console.log('✅ تم إنشاء تقييمات المتون');

  // =====================================================
  // 8. إنشاء حضور وغياب
  // =====================================================
  console.log('\n📅 إنشاء سجل الحضور...');

  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    for (const student of students.slice(0, 4)) {
      await prisma.attendance.create({
        data: {
          studentId: student.student!.id,
          classId: class1.id,
          date: date,
          status: i === 0 ? 'PRESENT' : i === 3 ? 'ABSENT' : 'PRESENT',
          notes: i === 3 ? 'غياب بعذر - مرض' : undefined,
          organizationId: organization.id,
        },
      });
    }
  }

  console.log('✅ تم إنشاء سجل الحضور للأيام الخمسة الماضية');

  // =====================================================
  // النهاية
  // =====================================================
  console.log('\n✅ تم إدخال جميع البيانات بنجاح!');
  console.log('\n========================================');
  console.log('🔐 معلومات تسجيل الدخول:');
  console.log('========================================\n');

  console.log('👑 المسؤول الرئيسي (Super Admin):');
  console.log('   Email: admin@albirr.com');
  console.log('   Password: 123456\n');

  console.log('👤 مدير الجمعية (Admin):');
  console.log('   Email: manager@albirr.com');
  console.log('   Password: 123456\n');

  console.log('👨‍🏫 المعلمون (Teachers):');
  teachersData.forEach((t) => {
    console.log(`   ${t.firstName}: ${t.email} / 123456`);
  });

  console.log('\n👨‍🎓 الطلاب (Students):');
  studentsData.forEach((s) => {
    console.log(`   ${s.firstName}: ${s.email} / 123456`);
  });

  console.log('\n========================================');
  console.log('📊 إحصائيات النظام:');
  console.log('========================================');
  console.log(`   الجمعيات: 1`);
  console.log(`   المستخدمين: ${2 + teachersData.length + studentsData.length}`);
  console.log(`   المعلمين: ${teachersData.length}`);
  console.log(`   الطلاب: ${studentsData.length}`);
  console.log(`   الحلقات: 4`);
  console.log(`   التقييمات: 3`);
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إدخال البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
