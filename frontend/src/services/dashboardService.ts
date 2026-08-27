import { store } from '../store'
import type { DashboardSummary } from '../types/dashboard'
import { apiRequest } from './httpClient'

export function getDashboardSummary() {
  const token = store.getState().auth.token
  return apiRequest<DashboardSummary>('/dashboard/summary', { token })
}
