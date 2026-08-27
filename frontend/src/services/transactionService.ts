import { store } from '../store'
import type { Transaction, TransactionFilter, TransactionRequest } from '../types/transaction'
import { apiRequest } from './httpClient'

export function getTransactions(filter: TransactionFilter = {}) {
  const params = new URLSearchParams()
  if (filter.from) params.set('from', filter.from)
  if (filter.to) params.set('to', filter.to)
  if (filter.categoryId) params.set('categoryId', filter.categoryId)

  const query = params.toString()
  const token = store.getState().auth.token

  return apiRequest<Transaction[]>(`/transactions${query ? `?${query}` : ''}`, { token })
}

export function createTransaction(data: TransactionRequest) {
  const token = store.getState().auth.token
  return apiRequest<Transaction>('/transactions', { method: 'POST', body: data, token })
}

export function updateTransaction(id: string, data: TransactionRequest) {
  const token = store.getState().auth.token
  return apiRequest<Transaction>(`/transactions/${id}`, { method: 'PUT', body: data, token })
}

export function deleteTransaction(id: string) {
  const token = store.getState().auth.token
  return apiRequest<void>(`/transactions/${id}`, { method: 'DELETE', token })
}
