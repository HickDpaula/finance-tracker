import { Percent, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CategoryBreakdownChart } from '../components/dashboard/CategoryBreakdownChart'
import { RecentTransactionsList } from '../components/dashboard/RecentTransactionsList'
import { StatTile } from '../components/dashboard/StatTile'
import { formatCurrency } from '../lib/format'
import { getDashboardSummary } from '../services/dashboardService'
import { getTransactions } from '../services/transactionService'
import type { DashboardSummary } from '../types/dashboard'
import type { Transaction } from '../types/transaction'

const RECENT_TRANSACTIONS_LIMIT = 5

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [summaryResponse, transactionsResponse] = await Promise.all([
          getDashboardSummary(),
          getTransactions(),
        ])
        if (!cancelled) {
          setSummary(summaryResponse)
          setTransactions(transactionsResponse)
        }
      } catch {
        if (!cancelled) {
          setError('Não foi possível carregar o dashboard.')
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
  }, [])

  if (isLoading) {
    return <p className="text-sm text-[#898781]">Carregando...</p>
  }

  if (error || !summary) {
    return <p className="text-sm text-[#e66767]">{error ?? 'Não foi possível carregar o dashboard.'}</p>
  }

  const savingsRate = summary.totalIncome > 0 ? (summary.balance / summary.totalIncome) * 100 : 0
  const expenses = transactions.filter((t) => t.type === 'Expense')
  const recentTransactions = transactions.slice(0, RECENT_TRANSACTIONS_LIMIT)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Financial Dashboard</h1>
      <p className="mt-1 text-sm text-[#898781]">Overview for All Time</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={TrendingUp}
          accentColor="#0ca30c"
          accentBg="#0ca30c33"
        />
        <StatTile
          label="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={TrendingDown}
          accentColor="#e66767"
          accentBg="#e6676733"
        />
        <StatTile
          label="Net Savings"
          value={formatCurrency(summary.balance)}
          icon={Wallet}
          accentColor="#3987e5"
          accentBg="#3987e533"
        />
        <StatTile
          label="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          icon={Percent}
          accentColor="#c98500"
          accentBg="#c9850033"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-[#141414] p-5">
          <h2 className="text-base font-semibold text-white">Spending by Category</h2>
          <div className="mt-4">
            <CategoryBreakdownChart expenses={expenses} />
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#141414] p-5">
          <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
          <div className="mt-4">
            <RecentTransactionsList transactions={recentTransactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
