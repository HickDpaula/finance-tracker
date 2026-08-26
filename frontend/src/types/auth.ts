export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  id: string
  name: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
}

export interface AuthUser {
  id: string
  email: string
}
