interface StudentDashboardProps {
  user: any
  onLogout: () => void
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <span className="logo">🕌</span>
          <div>
            <h1>بوابة الطالب</h1>
            <p>تقدمي في حفظ القرآن</p>
          </div>
        </div>
        <div className="dashboard-header-right">
          <div className="user-info">
            <p>مرحباً،</p>
            <h3>{user.profile?.firstName || user.email}</h3>
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
              <h3>الحفظ الإجمالي</h3>
              <span className="icon">📖</span>
            </div>
            <div className="stat-card-value">15</div>
            <div className="stat-card-footer">جزء محفوظ</div>
          </div>

          <div className="stat-card green">
            <div className="stat-card-header">
              <h3>التقييم العام</h3>
              <span className="icon">⭐</span>
            </div>
            <div className="stat-card-value">95%</div>
            <div className="stat-card-footer">ممتاز</div>
          </div>

          <div className="stat-card purple">
            <div className="stat-card-header">
              <h3>الحضور</h3>
              <span className="icon">✓</span>
            </div>
            <div className="stat-card-value">96%</div>
            <div className="stat-card-footer">28 من 30 يوم</div>
          </div>

          <div className="stat-card orange">
            <div className="stat-card-header">
              <h3>الترتيب</h3>
              <span className="icon">🏆</span>
            </div>
            <div className="stat-card-value">3</div>
            <div className="stat-card-footer">من 850 طالب</div>
          </div>
        </div>

        <div className="content-card">
          <h2>تقدم الحفظ</h2>
          <div style={{background: "#f7fafc", padding: "25px", borderRadius: "12px"}}>
            <div style={{marginBottom: "15px"}}>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
                <span style={{fontWeight: "bold", color: "#2d3748"}}>إجمالي الحفظ</span>
                <span style={{fontWeight: "bold", color: "#667eea"}}>50%</span>
              </div>
              <div style={{background: "#e2e8f0", borderRadius: "10px", height: "20px", overflow: "hidden"}}>
                <div style={{background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", width: "50%", height: "100%"}}></div>
              </div>
              <p style={{marginTop: "8px", fontSize: "14px", color: "#718096"}}>15 جزء من 30 جزء</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}