# 🚀 دليل التجربة السريع - Quick Test Guide

## الطريقة الأسهل لتجربة النظام

---

## 1️⃣ افتح Prisma Studio (واجهة مرئية لقاعدة البيانات)

افتح **PowerShell أو CMD جديد** واكتب:

```bash
cd c:\Users\Mazen\Desktop\yuoser\backend
npx prisma studio
```

سيفتح متصفح تلقائياً على: `http://localhost:5555`

---

## 2️⃣ إنشاء جمعية خيرية

1. في Prisma Studio، اضغط على **Organization** من القائمة اليسرى
2. اضغط **Add record**
3. املأ البيانات:
   - **nameAr**: جمعية البر الخيرية
   - **nameEn**: Al-Birr Society
   - **email**: info@albirr.com
   - **phone**: +966501234567
   - **country**: السعودية
   - **city**: الرياض
   - **address**: الرياض
   - **isActive**: ✅ (اختر true)
4. اضغط **Save 1 change**
5. ✅ **انسخ الـ id** (ستحتاجه لاحقاً)

---

## 3️⃣ إنشاء حساب مسؤول

### الخطوة 1: احصل على Password مشفر

افتح **PowerShell** واكتب:

```powershell
cd c:\Users\Mazen\Desktop\yuoser\backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('123456', 10).then(hash => console.log(hash));"
```

✅ **انسخ النتيجة** (مثل: `$2a$10$xxxxxxxxxxx...`)

### الخطوة 2: أنشئ User في Prisma Studio

1. اضغط على **User** من القائمة
2. اضغط **Add record**
3. املأ:
   - **email**: admin@albirr.com
   - **password**: الصق الـ hash اللي نسخته
   - **role**: اختر **SUPER_ADMIN**
   - **isActive**: ✅ true
4. اضغط **Save 1 change**
5. ✅ **انسخ id المستخدم**

### الخطوة 3: أضف Profile للمستخدم

1. اضغط على **Profile** من القائمة
2. اضغط **Add record**
3. املأ:
   - **userId**: الصق id المستخدم اللي نسخته
   - **firstName**: عبدالله
   - **lastName**: المدير
   - **gender**: اختر **MALE**
4. اضغط **Save**

---

## 4️⃣ الآن جرب تسجيل الدخول!

### طريقة 1: باستخدام Thunder Client (VS Code)

1. ثبّت **Thunder Client** extension في VS Code
2. افتح Thunder Client
3. اختر **POST**
4. الرابط: `http://localhost:5000/api/v1/auth/login`
5. اضغط على **Body**
6. اختر **JSON**
7. الصق:
```json
{
  "email": "admin@albirr.com",
  "password": "123456"
}
```
8. اضغط **Send**

✅ **ستحصل على token!**

### طريقة 2: باستخدام PowerShell

```powershell
$body = @{
    email = "admin@albirr.com"
    password = "123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $body
```

---

## 5️⃣ إنشاء بيانات كاملة (اختياري)

إذا تبي بيانات كاملة (معلمين، طلاب، حلقات)، اتبع نفس الطريقة:

### إنشاء مدرسة:

**Model**: School
- nameAr: مدرسة البر لتحفيظ القرآن
- nameEn: Al-Birr Quran School
- organizationId: (id الجمعية اللي أنشأتها)
- phone: +966501234567
- email: school@albirr.com
- city: الرياض
- address: الرياض
- capacity: 200
- isActive: true

### إنشاء معلم:

**خطوة 1 - User**:
- email: ahmed@albirr.com
- password: (احصل على hash مثل ما سويت للمدير)
- role: TEACHER
- isActive: true

**خطوة 2 - Profile**:
- userId: (id المستخدم)
- firstName: أحمد
- lastName: الحافظ
- gender: MALE

**خطوة 3 - Teacher**:
- userId: (id المستخدم)
- schoolId: (id المدرسة)
- specialization: تحفيظ القرآن الكريم
- qualifications: بكالوريوس شريعة
- yearsOfExperience: 10
- hireDate: (اختر أي تاريخ)
- isActive: true

### إنشاء حلقة:

**Model**: Class
- nameAr: حلقة الحفظ المتقدم
- nameEn: Advanced Circle
- schoolId: (id المدرسة)
- teacherId: (id المعلم من جدول Teacher)
- subjectType: QURAN
- level: متقدم
- maxStudents: 15
- schedule: الأحد والثلاثاء 5م
- location: القاعة الأولى
- startDate: (اختر تاريخ)
- isActive: true

### إنشاء طالب:

**خطوة 1 - User**:
- email: student1@test.com
- password: (احصل على hash)
- role: STUDENT
- isActive: true

**خطوة 2 - Profile**:
- userId: (id المستخدم)
- firstName: عبدالرحمن
- lastName: أحمد
- gender: MALE
- dateOfBirth: (اختر تاريخ ميلاد)

**خطوة 3 - Student**:
- userId: (id المستخدم)
- schoolId: (id المدرسة)
- studentCode: STD-001
- status: ACTIVE
- enrollmentDate: (اختر تاريخ)

**خطوة 4 - QuranProgress**:
- studentId: (id الطالب من جدول Student)
- currentJuz: 1
- currentSurah: 1
- currentAyah: 1
- currentPage: 1
- totalPagesMemorized: 0

---

## 6️⃣ تجربة الواجهات (API Endpoints)

بعد ما تنشئ البيانات، جرب هذه الواجهات:

### 🔐 تسجيل الدخول
```
POST http://localhost:5000/api/v1/auth/login
Body: {"email":"admin@albirr.com","password":"123456"}
```

### 📊 الإحصائيات
```
GET http://localhost:5000/api/v1/demo/stats
```

### 👨‍🎓 عرض الطلاب
```
GET http://localhost:5000/api/v1/demo/students
```

### 👨‍🏫 عرض المعلمين
```
GET http://localhost:5000/api/v1/demo/teachers
```

---

## 7️⃣ إنشاء حسابات بسرعة (مساعد)

إذا تبي تسوي حسابات بسرعة، استخدم هذا السكريبت:

```javascript
// احفظ هذا في ملف create-user.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser(email, role, firstName, lastName) {
  const hash = await bcrypt.hash('123456', 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      role,
      profile: {
        create: {
          firstName,
          lastName,
          gender: 'MALE',
        },
      },
    },
  });

  console.log(`✅ تم إنشاء: ${email} / 123456`);
  console.log(`   ID: ${user.id}`);

  await prisma.$disconnect();
}

// استخدام:
createUser('admin@albirr.com', 'SUPER_ADMIN', 'عبدالله', 'المدير');
```

شغّله:
```bash
cd c:\Users\Mazen\Desktop\yuoser\backend
node create-user.js
```

---

## 📝 ملاحظات مهمة:

1. **كلمة السر دائماً**: `123456`
2. **الـ IDs**: دائماً انسخ الـ ID من Prisma Studio للاستخدام في العلاقات
3. **Password**: لازم تحصل على hash قبل ما تدخله في قاعدة البيانات
4. **الترتيب مهم**:
   - أنشئ Organization أولاً
   - ثم School
   - ثم Users (المعلمين/الطلاب)
   - ثم Teacher/Student
   - ثم Class
   - ثم Enrollments

---

## 🎯 مثال كامل:

### إنشاء نظام كامل في 10 دقائق:

1. ✅ افتح Prisma Studio
2. ✅ أنشئ Organization (انسخ ID)
3. ✅ أنشئ School (استخدم organization ID، انسخ school ID)
4. ✅ أنشئ Admin User + Profile
5. ✅ أنشئ Teacher User + Profile + Teacher (استخدم school ID)
6. ✅ أنشئ Class (استخدم school ID + teacher ID)
7. ✅ أنشئ Student User + Profile + Student + QuranProgress
8. ✅ أنشئ StudentClass (ربط الطالب بالحلقة)
9. ✅ جرب تسجيل الدخول!
10. ✅ جرب الـ API endpoints!

---

## 💡 أدوات مساعدة:

### للحصول على Password Hash بسرعة:
```bash
node -e "require('bcryptjs').hash('123456',10).then(h=>console.log(h))"
```

### لحذف كل البيانات والبدء من جديد:
```bash
npx prisma migrate reset
```

---

## ❓ مشاكل شائعة:

### Prisma Studio لا يفتح؟
```bash
# جرب:
npx prisma studio --port 5556
```

### خطأ في العلاقات؟
- تأكد أنك نسخت الـ IDs بشكل صحيح
- تأكد أن الـ IDs موجودة فعلاً في الجداول المرتبطة

### Password لا يعمل؟
- تأكد أنك استخدمت bcrypt hash وليس plain text
- تأكد أن كلمة السر هي `123456`

---

**الآن ابدأ! 🎉**

افتح Prisma Studio:
```bash
cd c:\Users\Mazen\Desktop\yuoser\backend
npx prisma studio
```
