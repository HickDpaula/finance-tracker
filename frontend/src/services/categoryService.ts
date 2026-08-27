import { store } from '../store'
import type { Category, CategoryRequest } from '../types/category'
import { apiRequest } from './httpClient'

export function getCategories() {
  const token = store.getState().auth.token
  return apiRequest<Category[]>('/categories', { token })
}

export function createCategory(data: CategoryRequest) {
  const token = store.getState().auth.token
  return apiRequest<Category>('/categories', { method: 'POST', body: data, token })
}

export function updateCategory(id: string, data: CategoryRequest) {
  const token = store.getState().auth.token
  return apiRequest<Category>(`/categories/${id}`, { method: 'PUT', body: data, token })
}

export function deleteCategory(id: string) {
  const token = store.getState().auth.token
  return apiRequest<void>(`/categories/${id}`, { method: 'DELETE', token })
}
