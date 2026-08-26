import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function DashboardPlaceholder() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <p>Logado como {user?.email}</p>
      <button
        type="button"
        onClick={logout}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm"
      >
        Sair
      </button>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPlaceholder />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
