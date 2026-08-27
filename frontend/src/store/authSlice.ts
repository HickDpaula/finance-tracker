import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { decodeJwt } from '../lib/jwt'
import { login, register } from '../services/authService'
import { ApiError } from '../services/httpClient'
import type { AuthUser, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth'
import type { RootState } from './index'

export const STORAGE_KEY = 'financetracker.token'

interface AuthState {
  token: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem(STORAGE_KEY),
}

export const loginThunk = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      return await login(data)
    } catch (err) {
      return rejectWithValue(err instanceof ApiError ? err.message : 'Não foi possível entrar.')
    }
  },
)

export const registerThunk = createAsyncThunk<RegisterResponse, RegisterRequest, { rejectValue: string }>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      return await register(data)
    } catch (err) {
      return rejectWithValue(err instanceof ApiError ? err.message : 'Não foi possível criar a conta.')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.token = action.payload.token
    })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

export const selectToken = (state: RootState) => state.auth.token

function userFromToken(token: string): AuthUser {
  const payload = decodeJwt(token)
  return { id: payload.sub, email: payload.email }
}

export const selectUser = createSelector(selectToken, (token): AuthUser | null =>
  token ? userFromToken(token) : null,
)
