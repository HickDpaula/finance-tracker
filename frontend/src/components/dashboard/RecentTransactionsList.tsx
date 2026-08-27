import { formatCurrency, formatDate } from '../../lib/format'
import type { Transaction } from '../../types/transaction'

interface RecentTransactionsListProps {
  transactions: Transaction[]
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  if (transactions.length === 0) {
    return <p className="text-sm text-[#898781]">Nenhuma transação registrada ainda.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {transactions.map((transaction) => (
        <li
          key={transaction.id}
          className="flex items-center justify-between rounded-md bg-white/5 px-4 py-3"
        >
          <div>
            <p className="text-sm text-white">{transaction.description}</p>
            <p className="text-xs text-[#898781]">{transaction.categoryName}</p>
          </div>
          <div className="text-right">
            <p className={transaction.type === 'Income' ? 'text-sm text-[#0ca30c]' : 'text-sm text-[#e66767]'}>
              {transaction.type === 'Income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </p>
            <p className="text-xs text-[#898781]">{formatDate(transaction.date)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
