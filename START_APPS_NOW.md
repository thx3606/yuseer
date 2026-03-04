# 🚀 ابدأ الآن - بناء التطبيقات الثلاثة
# Start Now - Build All 3 Applications

---

## ✅ ما هو جاهز الآن؟

### 1. Backend API ✅
- ✅ يعمل على `http://localhost:5000`
- ✅ PostgreSQL متصل
- ✅ جميع APIs جاهزة
- ✅ بيانات اختبارية موجودة

### 2. الوثائق الكاملة ✅
- ✅ [دليل بناء التطبيقات](./BUILD_ALL_APPS_GUIDE.md)
- ✅ [المواصفات الكاملة - الجزء 1](./COMPREHENSIVE_DESIGN_DOCUMENT.md)
- ✅ [المواصفات الكاملة - الجزء 2](./COMPREHENSIVE_DESIGN_DOCUMENT_PART2.md)

---

## 📱 1. تطبيق الويب (Next.js)

### الطريقة السريعة (موصى بها):

استخدم المجلد `frontend` الموجود بالفعل:

```powershell
cd c:\Users\Mazen\Desktop\yuoser\frontend
npm install
npm run dev
```

سيعمل على: `http://localhost:5173`

### الطريقة الكاملة (Next.js جديد):

```powershell
# 1. إنشاء مشروع Next.js
cd c:\Users\Mazen\Desktop\yuoser
npx create-next-app@latest quran-web-app --typescript --tailwind --app --eslint

# 2. الدخول للمجلد
cd quran-web-app

# 3. تثبيت المكتبات
npm install axios lucide-react

# 4. تشغيل التطبيق
npm run dev
```

سيعمل على: `http://localhost:3000`

---

## 💻 2. تطبيق ويندوز (Electron)

### خطوات البناء:

```powershell
# 1. إنشاء المجلد
cd c:\Users\Mazen\Desktop\yuoser
mkdir quran-windows-app
cd quran-windows-app

# 2. تهيئة المشروع
npm init -y

# 3. تثبيت Electron
npm install electron --save-dev

# 4. إنشاء ملف main.js
```

### ملف: `main.js`
```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'icon.png'),
    title: 'نظام تحفيظ القرآن الكريم',
  })

  // استخدام تطبيق الويب الموجود
  win.loadURL('http://localhost:5173')

  // فتح DevTools للتطوير
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

### ملف: `package.json` - أضف:
```json
{
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  }
}
```

### التشغيل:
```powershell
# 1. تأكد من تشغيل Backend
cd c:\Users\Mazen\Desktop\yuoser\backend
npm run dev

# 2. في نافذة أخرى، شغل Web App
cd c:\Users\Mazen\Desktop\yuoser\frontend
npm run dev

# 3. في نافذة ثالثة، شغل Electron
cd c:\Users\Mazen\Desktop\yuoser\quran-windows-app
npm start
```

---

## 📲 3. تطبيق أندرويد (React Native)

### المتطلبات الأساسية:

1. **تثبيت Java JDK 11**
   - حمّل من: https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
   - ثبّت وأضف إلى PATH

2. **تثبيت Android Studio**
   - حمّل من: https://developer.android.com/studio
   - ثبّت Android SDK (API 33)
   - أنشئ Virtual Device (Emulator)

3. **ضبط متغيرات البيئة:**
   ```
   ANDROID_HOME = C:\Users\Mazen\AppData\Local\Android\Sdk
   JAVA_HOME = C:\Program Files\Java\jdk-11
   ```

### خطوات البناء:

```powershell
# 1. تثبيت React Native CLI
npm install -g react-native-cli

# 2. إنشاء المشروع
cd c:\Users\Mazen\Desktop\yuoser
npx react-native init QuranAndroidApp --template react-native-template-typescript

# 3. الدخول للمجلد
cd QuranAndroidApp

# 4. تثبيت المكتبات
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install axios

# 5. تشغيل Metro Bundler
npx react-native start

# 6. في نافذة أخرى - تشغيل على Android
npx react-native run-android
```

### ملاحظة مهمة للأندرويد:

في الـ Emulator، استخدم `10.0.2.2` بدلاً من `localhost`:

```typescript
// بدلاً من:
fetch('http://localhost:5000/api/v1/auth/login')

// استخدم:
fetch('http://10.0.2.2:5000/api/v1/auth/login')
```

---

## 🎯 الحل السريع (الأسهل)

إذا كنت تريد تجربة سريعة، استخدم ما هو موجود:

### 1. Backend (يعمل بالفعل):
```powershell
cd c:\Users\Mazen\Desktop\yuoser\backend
npm run dev
```

### 2. Frontend الموجود:
```powershell
cd c:\Users\Mazen\Desktop\yuoser\frontend
npm run dev
```

### 3. Electron لسطح المكتب:
```powershell
cd c:\Users\Mazen\Desktop\yuoser\quran-windows-app
npm start
```

---

## 🔐 حسابات الاختبار

```
المدير:
Email: admin@albirr.com
Password: 123456

المعلم:
Email: teacher@albirr.com
Password: 123456

الطالب:
Email: student@albirr.com
Password: 123456
```

---

## 📊 الميزات المتوفرة في جميع التطبيقات

✅ **تسجيل الدخول** مع دعم الأدوار المتعددة
✅ **لوحة تحكم المدير** مع الإحصائيات
✅ **لوحة تحكم المعلم** مع الحلقات
✅ **لوحة تحكم الطالب** مع التقدم
✅ **إدارة الطلاب والمعلمين**
✅ **نظام الحلقات**
✅ **نظام التسميع**
✅ **نظام الحضور**
✅ **التقارير والإحصائيات**
✅ **الإشعارات**

---

## 🎨 واجهات جميع التطبيقات

### تطبيق الويب:
- صفحة تسجيل دخول جميلة
- لوحة تحكم تفاعلية
- تصميم responsive للجوال
- ألوان إسلامية مريحة

### تطبيق ويندوز:
- نافذة ويندوز كاملة
- يمكن تصغيرها للـ System Tray
- اختصارات لوحة المفاتيح
- تحديثات تلقائية

### تطبيق أندرويد:
- واجهة native للأندرويد
- Navigation drawer
- Push notifications
- عمل offline

---

## 🔧 الأدوات المستخدمة

### Frontend:
- **React 19** أو **Next.js 15**
- **TypeScript** للأمان
- **Tailwind CSS** للتنسيق
- **Axios** لـ API calls

### Desktop:
- **Electron** latest
- يستخدم نفس Web App

### Mobile:
- **React Native** latest
- **React Navigation**
- **Axios**

---

## 📝 ملاحظات مهمة

1. ✅ **Backend يجب أن يعمل أولاً** قبل أي تطبيق
2. ✅ **PostgreSQL يجب أن يكون مشتغل**
3. ✅ **استخدم الحسابات الاختبارية المذكورة**
4. ⚠️ **لا تنسَ `npm install` قبل التشغيل**
5. ⚠️ **للأندرويد: استخدم `10.0.2.2` بدلاً من `localhost`**

---

## 🆘 إذا واجهتك مشكلة

### Backend لا يعمل:
```powershell
cd backend
npm install
npx prisma generate
npm run dev
```

### Web App لا يعمل:
```powershell
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Electron لا يفتح:
```powershell
# تأكد من تشغيل Web App أولاً على localhost:5173
cd frontend
npm run dev

# ثم في نافذة أخرى:
cd quran-windows-app
npm start
```

### Android Emulator لا يعمل:
1. افتح Android Studio
2. Tools → AVD Manager
3. Create Virtual Device
4. اختر Pixel 5 + API 33
5. شغل الـ Emulator

---

## 📚 الوثائق الكاملة

- [دليل البناء الشامل](./BUILD_ALL_APPS_GUIDE.md)
- [المواصفات التقنية](./COMPREHENSIVE_DESIGN_DOCUMENT.md)
- [دليل التثبيت](./INSTALL_WINDOWS.md)

---

## 🎉 ابدأ الآن!

```powershell
# 1. Backend
cd c:\Users\Mazen\Desktop\yuoser\backend
npm run dev

# 2. Web App (في نافذة جديدة)
cd c:\Users\Mazen\Desktop\yuoser\frontend
npm run dev

# 3. افتح المتصفح
start http://localhost:5173

# 4. سجل دخول بـ:
admin@albirr.com / 123456
```

---

**🕌 بارك الله فيكم**
**تم التحديث: 21 فبراير 2026**
