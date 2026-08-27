import { store } from '../store'
import type { Transaction, TransactionFilter } from '../types/transaction'
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
