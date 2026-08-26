import { apiRequest } from './httpClient'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth'

export function register(data: RegisterRequest) {
  return apiRequest<RegisterResponse>('/auth/register', { method: 'POST', body: data })
}

export function login(data: LoginRequest) {
  return apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: data })
}
