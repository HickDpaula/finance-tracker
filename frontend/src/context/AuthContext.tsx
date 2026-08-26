import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { decodeJwt } from '../lib/jwt'
import { login as loginRequest, register as registerRequest } from '../services/authService'
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth'

interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'financetracker.token'

function userFromToken(token: string): AuthUser {
  const payload = decodeJwt(token)
  return { id: payload.sub, email: payload.email }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [token])

  const user = useMemo(() => (token ? userFromToken(token) : null), [token])

  async function login(data: LoginRequest) {
    const response = await loginRequest(data)
    setToken(response.token)
  }

  async function register(data: RegisterRequest) {
    await registerRequest(data)
  }

  function logout() {
    setToken(null)
  }

  const value = { token, user, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
