import { formatCurrency } from '../../lib/format'
import { categoricalPalette, otherColor } from '../../lib/chartPalette'
import type { Transaction } from '../../types/transaction'

interface Segment {
  name: string
  amount: number
  color: string
}

const MAX_SEGMENTS = categoricalPalette.length

function buildSegments(expenses: Transaction[]): Segment[] {
  const totalsByCategory = new Map<string, number>()
  for (const expense of expenses) {
    totalsByCategory.set(expense.categoryName, (totalsByCategory.get(expense.categoryName) ?? 0) + expense.amount)
  }

  const sorted = [...totalsByCategory.entries()].sort((a, b) => b[1] - a[1])
  const top: Segment[] = sorted.slice(0, MAX_SEGMENTS).map(([name, amount], index) => ({
    name,
    amount,
    color: categoricalPalette[index],
  }))

  const rest = sorted.slice(MAX_SEGMENTS)
  if (rest.length > 0) {
    const otherAmount = rest.reduce((sum, [, amount]) => sum + amount, 0)
    top.push({ name: 'Outras', amount: otherAmount, color: otherColor })
  }

  return top
}

interface CategoryBreakdownChartProps {
  expenses: Transaction[]
}

export function CategoryBreakdownChart({ expenses }: CategoryBreakdownChartProps) {
  const segments = buildSegments(expenses)
  const total = segments.reduce((sum, s) => sum + s.amount, 0)

  if (segments.length === 0) {
    return <p className="text-sm text-[#898781]">Nenhuma despesa registrada ainda.</p>
  }

  return (
    <div>
      <div className="flex h-6 gap-0.5">
        {segments.map((segment, index) => (
          <div
            key={segment.name}
            title={`${segment.name}: ${formatCurrency(segment.amount)} (${((segment.amount / total) * 100).toFixed(1)}%)`}
            className={index === segments.length - 1 ? 'h-full rounded-r-[4px]' : 'h-full'}
            style={{
              width: `${(segment.amount / total) * 100}%`,
              backgroundColor: segment.color,
            }}
          />
        ))}
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {segments.map((segment) => (
          <li key={segment.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-[#c3c2b7]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.name}
            </span>
            <span className="text-white">
              {formatCurrency(segment.amount)}{' '}
              <span className="text-[#898781]">({((segment.amount / total) * 100).toFixed(1)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
