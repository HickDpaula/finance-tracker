export type TransactionType = 'Income' | 'Expense'

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
  categoryName: string
}

export interface TransactionFilter {
  from?: string
  to?: string
  categoryId?: string
}

export interface TransactionRequest {
  description: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
}
