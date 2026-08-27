import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TransactionFilters } from '../components/transactions/TransactionFilters'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { TransactionsTable } from '../components/transactions/TransactionsTable'
import { fetchCategoriesThunk, selectCategories } from '../store/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../services/transactionService'
import type { Transaction, TransactionFilter, TransactionType } from '../types/transaction'

interface TransactionsPageProps {
  type: TransactionType
  title: string
}

export function TransactionsPage({ type, title }: TransactionsPageProps) {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)

  const [filter, setFilter] = useState<TransactionFilter>({})
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    dispatch(fetchCategoriesThunk())
  }, [dispatch])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const all = await getTransactions(filter)
        if (!cancelled) {
          setTransactions(all.filter((t) => t.type === type))
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setError('Não foi possível carregar os lançamentos.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [filter, type, refreshKey])

  function openCreateForm() {
    setEditingTransaction(undefined)
    setIsFormOpen(true)
  }

  function openEditForm(transaction: Transaction) {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  async function handleDelete(transaction: Transaction) {
    if (!window.confirm(`Excluir "${transaction.description}"?`)) {
      return
    }
    await deleteTransaction(transaction.id)
    setRefreshKey((key) => key + 1)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <button
          type="button"
          onClick={openCreateForm}
          disabled={categories.length === 0}
          className="flex items-center gap-2 rounded-md bg-[#3987e5] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} />
          Novo lançamento
        </button>
      </div>

      {categories.length === 0 && (
        <p className="mt-2 text-sm text-[#898781]">Crie uma categoria antes de lançar {title.toLowerCase()}.</p>
      )}

      <div className="mt-6 rounded-lg border border-white/10 bg-[#141414] p-5">
        <TransactionFilters categories={categories} filter={filter} onChange={setFilter} />

        <div className="mt-5">
          {isLoading ? (
            <p className="text-sm text-[#898781]">Carregando...</p>
          ) : error ? (
            <p className="text-sm text-[#e66767]">{error}</p>
          ) : (
            <TransactionsTable transactions={transactions} onEdit={openEditForm} onDelete={handleDelete} />
          )}
        </div>
      </div>

      {isFormOpen && (
        <TransactionForm
          type={type}
          categories={categories}
          initial={editingTransaction}
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (data) => {
            if (editingTransaction) {
              await updateTransaction(editingTransaction.id, data)
            } else {
              await createTransaction(data)
            }
            setRefreshKey((key) => key + 1)
          }}
        />
      )}
    </div>
  )
}
