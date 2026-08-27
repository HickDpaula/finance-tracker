import { FolderOpen, LayoutDashboard, LogOut, Receipt, TrendingUp } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { logout, selectUser } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/expenses', label: 'Expenses', icon: Receipt, end: false },
  { to: '/income', label: 'Income', icon: TrendingUp, end: false },
  { to: '/categories', label: 'Categories', icon: FolderOpen, end: false },
]

export function Sidebar() {
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-[#141414] p-4">
      <div className="px-2 pb-6">
        <p className="text-lg font-semibold text-white">Expense Tracker</p>
        <p className="text-sm text-[#898781]">Manage your finances</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                isActive ? 'bg-[#3987e5]/15 text-[#3987e5]' : 'text-[#c3c2b7] hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 pt-3">
        <p className="truncate px-2 text-xs text-[#898781]">{user?.email}</p>
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[#c3c2b7] hover:bg-white/5"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
