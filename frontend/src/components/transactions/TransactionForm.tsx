import { useState, type FormEvent } from 'react'
import type { Category } from '../../types/category'
import type { Transaction, TransactionRequest, TransactionType } from '../../types/transaction'
import { ApiError } from '../../services/httpClient'

interface TransactionFormProps {
  type: TransactionType
  categories: Category[]
  initial?: Transaction
  onSubmit: (data: TransactionRequest) => Promise<void>
  onClose: () => void
}

const inputClass =
  'rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#3987e5]'

export function TransactionForm({ type, categories, initial, onSubmit, onClose }: TransactionFormProps) {
  const [description, setDescription] = useState(initial?.description ?? '')
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '')
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10))
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit({ description, amount: Number(amount), type, date, categoryId })
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-white/10 bg-[#141414] p-6"
      >
        <h2 className="text-lg font-semibold text-white">
          {initial ? 'Editar' : 'Nova'} {type === 'Expense' ? 'despesa' : 'receita'}
        </h2>
        {error && <p className="text-sm text-[#e66767]">{error}</p>}
        <label className="flex flex-col gap-1 text-sm text-[#c3c2b7]">
          Descrição
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#c3c2b7]">
          Valor
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#c3c2b7]">
          Data
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#c3c2b7]">
          Categoria
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className={inputClass}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-sm text-[#898781]">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !categoryId}
            className="rounded-md bg-[#3987e5] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
