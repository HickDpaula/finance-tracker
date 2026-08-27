import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../../lib/format'
import type { Transaction } from '../../types/transaction'

interface TransactionsTableProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return <p className="text-sm text-[#898781]">Nenhum lançamento encontrado.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs text-[#898781]">
            <th className="pb-3 font-normal">Descrição</th>
            <th className="pb-3 font-normal">Categoria</th>
            <th className="pb-3 font-normal">Data</th>
            <th className="pb-3 font-normal">Valor</th>
            <th className="pb-3 font-normal" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-white/5">
              <td className="py-3 text-white">{transaction.description}</td>
              <td className="py-3 text-[#c3c2b7]">{transaction.categoryName}</td>
              <td className="py-3 text-[#c3c2b7]">{formatDate(transaction.date)}</td>
              <td className={transaction.type === 'Income' ? 'py-3 text-[#0ca30c]' : 'py-3 text-[#e66767]'}>
                {transaction.type === 'Income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(transaction)}
                    className="rounded-md p-1.5 text-[#898781] hover:bg-white/5 hover:text-white"
                    aria-label="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(transaction)}
                    className="rounded-md p-1.5 text-[#898781] hover:bg-white/5 hover:text-[#e66767]"
                    aria-label="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
