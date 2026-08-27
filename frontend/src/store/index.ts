import { configureStore } from '@reduxjs/toolkit'
import authReducer, { STORAGE_KEY } from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

let previousToken = store.getState().auth.token
store.subscribe(() => {
  const token = store.getState().auth.token
  if (token === previousToken) {
    return
  }
  previousToken = token
  if (token) {
    localStorage.setItem(STORAGE_KEY, token)
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
