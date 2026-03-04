import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<string>('login')

  const handleLogin = (user: any) => {
    setCurrentUser(user)
    // توجيه حسب الدور
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'MANAGER') {
      setCurrentPage('admin')
    } else if (user.role === 'TEACHER') {
      setCurrentPage('teacher')
    } else if (user.role === 'STUDENT' || user.role === 'GUARDIAN') {
      setCurrentPage('student')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentPage('login')
  }

  return (
    <div className="app">
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'admin' && <AdminDashboard user={currentUser} onLogout={handleLogout} />}
      {currentPage === 'teacher' && <TeacherDashboard user={currentUser} onLogout={handleLogout} />}
      {currentPage === 'student' && <StudentDashboard user={currentUser} onLogout={handleLogout} />}
    </div>
  )
}

export default App
