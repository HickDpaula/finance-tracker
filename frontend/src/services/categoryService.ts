import { store } from '../store'
import type { Category } from '../types/category'
import { apiRequest } from './httpClient'

export function getCategories() {
  const token = store.getState().auth.token
  return apiRequest<Category[]>('/categories', { token })
}
