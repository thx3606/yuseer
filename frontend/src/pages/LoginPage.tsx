import { useState } from 'react'

interface LoginPageProps {
  onLogin: (user: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const quickLogin = async (userEmail: string, userPassword: string = '123456') => {
    setEmail(userEmail)
    setPassword(userPassword)
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      })

      const data = await response.json()
      console.log('Login response:', data)

      if (data.success && data.data && data.data.user) {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        onLogin(data.data.user)
      } else {
        setError(data.message || 'فشل تسجيل الدخول')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('Login response:', data)

      if (data.success && data.data && data.data.user) {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        onLogin(data.data.user)
      } else {
        setError(data.message || 'فشل تسجيل الدخول')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* الخلفية المتحركة */}
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-box">
        {/* العنوان الرئيسي */}
        <div className="login-header">
          <div className="logo-container">
            <svg className="mosque-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 8L24 16V20H40V16L32 8Z" fill="currentColor"/>
              <rect x="20" y="20" width="24" height="28" rx="2" fill="currentColor"/>
              <circle cx="32" cy="12" r="2" fill="currentColor"/>
              <rect x="28" y="24" width="8" height="12" rx="1" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <h1 className="main-title">نظام إدارة مدارس التحفيظ</h1>
          <p className="sub-title">منصة متكاملة لإدارة حلقات القرآن الكريم والمتون العلمية</p>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="error-message animate-shake">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm3.5 1.5v1l6.5 4 6.5-4v-1l-6.5 4-6.5-4z"/>
              </svg>
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@albirr.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a5 5 0 00-5 5v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm3 8V7a3 3 0 10-6 0v3h6z"/>
              </svg>
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <span>دخول</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 11-2 0V4H5v12h10v-2a1 1 0 112 0v3a1 1 0 01-1 1H4a1 1 0 01-1-1V3z"/>
                  <path d="M11 10a1 1 0 011-1h4.586l-1.293-1.293a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L16.586 11H12a1 1 0 01-1-1z"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* خط فاصل */}
        <div className="divider">
          <span>أو دخول سريع للتجربة</span>
        </div>

        {/* أزرار الدخول السريع */}
        <div className="quick-login">
          <button
            className="quick-login-btn admin-btn"
            onClick={() => quickLogin('admin@albirr.com')}
            disabled={loading}
          >
            <div className="btn-icon">👑</div>
            <div className="btn-content">
              <div className="btn-title">مدير النظام</div>
              <div className="btn-subtitle">صلاحيات كاملة</div>
            </div>
            <svg className="btn-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"/>
            </svg>
          </button>

          <button
            className="quick-login-btn teacher-btn"
            onClick={() => quickLogin('teacher@albirr.com')}
            disabled={loading}
          >
            <div className="btn-icon">👨‍🏫</div>
            <div className="btn-content">
              <div className="btn-title">معلم حلقة</div>
              <div className="btn-subtitle">إدارة الطلاب والتسميع</div>
            </div>
            <svg className="btn-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"/>
            </svg>
          </button>

          <button
            className="quick-login-btn student-btn"
            onClick={() => quickLogin('student@albirr.com')}
            disabled={loading}
          >
            <div className="btn-icon">👨‍🎓</div>
            <div className="btn-content">
              <div className="btn-title">طالب / ولي أمر</div>
              <div className="btn-subtitle">متابعة التقدم والإنجاز</div>
            </div>
            <svg className="btn-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"/>
            </svg>
          </button>
        </div>

        {/* تذييل */}
        <div className="login-footer">
          <p>🕌 بُني بـ ❤️ لخدمة كتاب الله الكريم</p>
          <p className="version">الإصدار 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
