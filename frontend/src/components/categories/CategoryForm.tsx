import { useState, type FormEvent } from 'react'
import type { Category } from '../../types/category'

interface CategoryFormProps {
  initial?: Category
  onSubmit: (name: string) => Promise<void>
  onClose: () => void
}

export function CategoryForm({ initial, onSubmit, onClose }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit(name)
      onClose()
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Não foi possível salvar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-white/10 bg-[#141414] p-6"
      >
        <h2 className="text-lg font-semibold text-white">{initial ? 'Editar' : 'Nova'} categoria</h2>
        {error && <p className="text-sm text-[#e66767]">{error}</p>}
        <label className="flex flex-col gap-1 text-sm text-[#c3c2b7]">
          Nome
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#3987e5]"
          />
        </label>
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-sm text-[#898781]">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-[#3987e5] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
