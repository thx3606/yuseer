# ====================================
# سكريبت التثبيت التلقائي لـ Windows
# Automatic Installation Script for Windows
# ====================================

Write-Host "==================================================" -ForegroundColor Green
Write-Host "  نظام إدارة مدارس تحفيظ القرآن الكريم" -ForegroundColor Green
Write-Host "  Quranic Schools Management System" -ForegroundColor Green
Write-Host "  Installation Script for Windows" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

# التحقق من Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not found! Please install Node.js v18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# التحقق من npm
Write-Host "2. Checking npm..." -ForegroundColor Cyan
try {
    $npmVersion = npm --version
    Write-Host "   ✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm not found!" -ForegroundColor Red
    exit 1
}

# حذف node_modules القديمة إن وُجدت
Write-Host ""
Write-Host "3. Cleaning old installations..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "   Removing old node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}
if (Test-Path "package-lock.json") {
    Write-Host "   Removing old package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
}
Write-Host "   ✓ Cleanup completed" -ForegroundColor Green

# تثبيت التبعيات
Write-Host ""
Write-Host "4. Installing dependencies..." -ForegroundColor Cyan
Write-Host "   This may take 5-10 minutes. Please wait..." -ForegroundColor Yellow
Write-Host ""

try {
    npm install --legacy-peer-deps 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ! Installation completed with warnings" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Failed to install dependencies!" -ForegroundColor Red
    Write-Host "   Please run manually: npm install --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}

# نسخ ملف البيئة
Write-Host ""
Write-Host "5. Setting up environment file..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item .env.example .env
        Write-Host "   ✓ .env file created from .env.example" -ForegroundColor Green
        Write-Host ""
        Write-Host "   ⚠️  IMPORTANT: Please edit .env file and update:" -ForegroundColor Yellow
        Write-Host "      - DATABASE_URL (PostgreSQL connection)" -ForegroundColor Yellow
        Write-Host "      - JWT_SECRET (random secret key)" -ForegroundColor Yellow
        Write-Host "      - EMAIL credentials (if needed)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✗ .env.example not found!" -ForegroundColor Red
    }
} else {
    Write-Host "   ✓ .env file already exists" -ForegroundColor Green
}

# التحقق من PostgreSQL
Write-Host ""
Write-Host "6. Checking PostgreSQL..." -ForegroundColor Cyan
$pgPath = "C:\Program Files\PostgreSQL"
if (Test-Path $pgPath) {
    Write-Host "   ✓ PostgreSQL installation found" -ForegroundColor Green
} else {
    Write-Host "   ! PostgreSQL not found in default location" -ForegroundColor Yellow
    Write-Host "   Please ensure PostgreSQL is installed and running" -ForegroundColor Yellow
}

# الانتهاء
Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "  Installation completed!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your database credentials" -ForegroundColor White
Write-Host "2. Create database: CREATE DATABASE quran_schools;" -ForegroundColor White
Write-Host "3. Run migrations: npx prisma migrate dev" -ForegroundColor White
Write-Host "4. Generate Prisma Client: npx prisma generate" -ForegroundColor White
Write-Host "5. Start server: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see INSTALL_WINDOWS.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "بالتوفيق! Good luck! 🚀" -ForegroundColor Green
