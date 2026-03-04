interface AdminDashboardProps {
  user: any
  onLogout: () => void
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <span className="logo">🕌</span>
          <div>
            <h1>لوحة التحكم الرئيسية</h1>
            <p>جمعية البر لتحفيظ القرآن الكريم</p>
          </div>
        </div>
        <div className="dashboard-header-right">
          <div className="user-info">
            <p>مرحباً،</p>
            <h3>{user.profile?.firstName || user.email}</h3>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            🔓 تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* الإحصائيات الرئيسية */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-card-header">
              <h3>إجمالي الطلاب</h3>
              <span className="icon">👥</span>
            </div>
            <div className="stat-card-value">850</div>
            <div className="stat-card-footer">📈 +12 هذا الشهر</div>
          </div>

          <div className="stat-card green">
            <div className="stat-card-header">
              <h3>المعلمون</h3>
              <span className="icon">👨‍🏫</span>
            </div>
            <div className="stat-card-value">45</div>
            <div className="stat-card-footer">✅ جميعهم نشطون</div>
          </div>

          <div className="stat-card purple">
            <div className="stat-card-header">
              <h3>الحلقات النشطة</h3>
              <span className="icon">📚</span>
            </div>
            <div className="stat-card-value">32</div>
            <div className="stat-card-footer">🏢 في 5 فروع</div>
          </div>

          <div className="stat-card orange">
            <div className="stat-card-header">
              <h3>الحضور اليوم</h3>
              <span className="icon">✓</span>
            </div>
            <div className="stat-card-value">85%</div>
            <div className="stat-card-footer">👥 722 طالب حاضر</div>
          </div>
        </div>

        {/* إحصائيات إضافية */}
        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-card-header">
              <h3>تسميعات اليوم</h3>
              <span className="icon">📖</span>
            </div>
            <div className="stat-card-value">124</div>
            <div className="stat-card-footer">✅ 98 مكتمل</div>
          </div>

          <div className="stat-card blue">
            <div className="stat-card-header">
              <h3>متوسط التقييم</h3>
              <span className="icon">⭐</span>
            </div>
            <div className="stat-card-value">92%</div>
            <div className="stat-card-footer">🏆 ممتاز</div>
          </div>

          <div className="stat-card orange">
            <div className="stat-card-header">
              <h3>الشهادات الصادرة</h3>
              <span className="icon">📜</span>
            </div>
            <div className="stat-card-value">48</div>
            <div className="stat-card-footer">📅 هذا الشهر</div>
          </div>

          <div className="stat-card purple">
            <div className="stat-card-header">
              <h3>الإنجازات</h3>
              <span className="icon">🎯</span>
            </div>
            <div className="stat-card-value">156</div>
            <div className="stat-card-footer">✨ جزء محفوظ</div>
          </div>
        </div>

        {/* الإجراءات السريعة */}
        <div className="content-card">
          <h2>الإجراءات السريعة</h2>
          <div className="quick-actions">
            <button className="action-btn">
              ➕ إضافة طالب جديد
            </button>
            <button className="action-btn">
              👨‍🏫 إضافة معلم
            </button>
            <button className="action-btn">
              📚 إنشاء حلقة جديدة
            </button>
            <button className="action-btn">
              📝 إنشاء اختبار
            </button>
            <button className="action-btn">
              📊 تقارير مفصلة
            </button>
            <button className="action-btn">
              🔔 إرسال إشعار جماعي
            </button>
            <button className="action-btn">
              📜 إصدار شهادة
            </button>
            <button className="action-btn">
              ⚙️ إعدادات النظام
            </button>
          </div>
        </div>

        {/* آخر الأنشطة */}
        <div className="content-card">
          <h2>آخر الأنشطة</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <strong>تم تسجيل حضور حلقة النور</strong>
                <p>25 طالب حاضر من أصل 28 طالب</p>
              </div>
              <div className="activity-time">منذ 5 دقائق</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <strong>تقييم جديد من الشيخ خالد</strong>
                <p>تسميع سورة البقرة - أحمد محمد - 95%</p>
              </div>
              <div className="activity-time">منذ 15 دقيقة</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <strong>طالب جديد انضم للنظام</strong>
                <p>محمد عبدالله - حلقة الهداية</p>
              </div>
              <div className="activity-time">منذ 30 دقيقة</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">📜</div>
              <div className="activity-content">
                <strong>شهادة جديدة تم إصدارها</strong>
                <p>شهادة إتمام جزء عم - فاطمة أحمد</p>
              </div>
              <div className="activity-time">منذ ساعة</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">🎯</div>
              <div className="activity-content">
                <strong>إنجاز جديد</strong>
                <p>إبراهيم خالد أتم حفظ سورة الكهف</p>
              </div>
              <div className="activity-time">منذ ساعتين</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <strong>تقرير شهري جاهز</strong>
                <p>تقرير شهر صفر 1446 - 850 طالب</p>
              </div>
              <div className="activity-time">منذ 3 ساعات</div>
            </div>
          </div>
        </div>

        {/* أفضل الطلاب */}
        <div className="content-card">
          <h2>أفضل 5 طلاب هذا الشهر</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🥇</div>
              <div className="activity-content">
                <strong>محمد عبدالله</strong>
                <p>15 جزء محفوظ - تقييم 98%</p>
              </div>
              <div className="activity-time">حلقة النور</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">🥈</div>
              <div className="activity-content">
                <strong>فاطمة أحمد</strong>
                <p>12 جزء محفوظ - تقييم 96%</p>
              </div>
              <div className="activity-time">حلقة الهداية</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">🥉</div>
              <div className="activity-content">
                <strong>إبراهيم خالد</strong>
                <p>10 أجزاء محفوظة - تقييم 95%</p>
              </div>
              <div className="activity-time">حلقة الفجر</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">⭐</div>
              <div className="activity-content">
                <strong>عائشة محمود</strong>
                <p>9 أجزاء محفوظة - تقييم 94%</p>
              </div>
              <div className="activity-time">حلقة النور</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">⭐</div>
              <div className="activity-content">
                <strong>يوسف إبراهيم</strong>
                <p>8 أجزاء محفوظة - تقييم 93%</p>
              </div>
              <div className="activity-time">حلقة الفجر</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
