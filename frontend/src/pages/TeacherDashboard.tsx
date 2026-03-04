interface TeacherDashboardProps {
  user: any
  onLogout: () => void
}

export default function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <span className="logo">🕌</span>
          <div>
            <h1>بوابة المعلم</h1>
            <p>حلقاتي وطلابي</p>
          </div>
        </div>
        <div className="dashboard-header-right">
          <div className="user-info">
            <p>مرحباً،</p>
            <h3>الأستاذ {user.profile?.firstName || user.email}</h3>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-card-header">
              <h3>حلقاتي</h3>
              <span className="icon">📚</span>
            </div>
            <div className="stat-card-value">3</div>
            <div className="stat-card-footer">حلقات نشطة</div>
          </div>

          <div className="stat-card green">
            <div className="stat-card-header">
              <h3>طلابي</h3>
              <span className="icon">👥</span>
            </div>
            <div className="stat-card-value">68</div>
            <div className="stat-card-footer">طالب مسجل</div>
          </div>

          <div className="stat-card purple">
            <div className="stat-card-header">
              <h3>التسميع اليوم</h3>
              <span className="icon">📖</span>
            </div>
            <div className="stat-card-value">15</div>
            <div className="stat-card-footer">طالب متبقي</div>
          </div>

          <div className="stat-card orange">
            <div className="stat-card-header">
              <h3>الحضور</h3>
              <span className="icon">✓</span>
            </div>
            <div className="stat-card-value">92%</div>
            <div className="stat-card-footer">نسبة عالية</div>
          </div>
        </div>

        <div className="content-card">
          <h2>حلقاتي النشطة</h2>
          <div style={{display: 'grid', gap: '20px'}}>
            <div style={{background: '#f7fafc', padding: '20px', borderRadius: '10px', border: '2px solid #e2e8f0'}}>
              <h3 style={{fontSize: '20px', marginBottom: '10px', color: '#2d3748'}}>📚 حلقة النور - صباحي</h3>
              <p style={{color: '#718096', marginBottom: '15px'}}>25 طالب • الأحد-الخميس • 8:00 - 10:00 ص</p>
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="action-btn blue" style={{flex: 1}}>بدء التسميع</button>
                <button className="action-btn green" style={{flex: 1}}>تسجيل الحضور</button>
              </div>
            </div>

            <div style={{background: '#f7fafc', padding: '20px', borderRadius: '10px', border: '2px solid #e2e8f0'}}>
              <h3 style={{fontSize: '20px', marginBottom: '10px', color: '#2d3748'}}>📚 حلقة الهداية - مسائي</h3>
              <p style={{color: '#718096', marginBottom: '15px'}}>18 طالب • الأحد-الخميس • 4:00 - 6:00 م</p>
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="action-btn blue" style={{flex: 1}}>بدء التسميع</button>
                <button className="action-btn green" style={{flex: 1}}>تسجيل الحضور</button>
              </div>
            </div>

            <div style={{background: '#f7fafc', padding: '20px', borderRadius: '10px', border: '2px solid #e2e8f0'}}>
              <h3 style={{fontSize: '20px', marginBottom: '10px', color: '#2d3748'}}>📚 حلقة الفجر</h3>
              <p style={{color: '#718096', marginBottom: '15px'}}>25 طالب • يومياً • 5:30 - 7:00 ص</p>
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="action-btn blue" style={{flex: 1}}>بدء التسميع</button>
                <button className="action-btn green" style={{flex: 1}}>تسجيل الحضور</button>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2>التسميع اليوم</h2>
          <ul className="activities-list">
            <li className="activity-item">
              <div className="activity-left">
                <span className="activity-icon">👤</span>
                <span className="activity-text">محمد أحمد - سورة البقرة (1-10)</span>
              </div>
              <button className="action-btn purple" style={{padding: '8px 16px', fontSize: '14px'}}>
                بدء التسميع
              </button>
            </li>
            <li className="activity-item">
              <div className="activity-left">
                <span className="activity-icon">✅</span>
                <span className="activity-text">علي حسن - سورة آل عمران (5) - ممتاز 95%</span>
              </div>
              <span className="activity-time">تم</span>
            </li>
            <li className="activity-item">
              <div className="activity-left">
                <span className="activity-icon">👤</span>
                <span className="activity-text">فاطمة محمد - سورة النساء (1-3)</span>
              </div>
              <button className="action-btn purple" style={{padding: '8px 16px', fontSize: '14px'}}>
                بدء التسميع
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
