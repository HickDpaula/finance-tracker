import type { Category } from '../../types/category'
import type { TransactionFilter } from '../../types/transaction'

interface TransactionFiltersProps {
  categories: Category[]
  filter: TransactionFilter
  onChange: (filter: TransactionFilter) => void
}

const inputClass =
  'rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#3987e5]'

export function TransactionFilters({ categories, filter, onChange }: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-xs text-[#898781]">
        De
        <input
          type="date"
          value={filter.from ?? ''}
          onChange={(e) => onChange({ ...filter, from: e.target.value || undefined })}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[#898781]">
        Até
        <input
          type="date"
          value={filter.to ?? ''}
          onChange={(e) => onChange({ ...filter, to: e.target.value || undefined })}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[#898781]">
        Categoria
        <select
          value={filter.categoryId ?? ''}
          onChange={(e) => onChange({ ...filter, categoryId: e.target.value || undefined })}
          className={inputClass}
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      {(filter.from || filter.to || filter.categoryId) && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="rounded-md px-3 py-2 text-sm text-[#898781] hover:text-white"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
