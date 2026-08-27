import { logout, selectUser } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export function DashboardPage() {
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <p>Logado como {user?.email}</p>
      <button
        type="button"
        onClick={() => dispatch(logout())}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm"
      >
        Sair
      </button>
    </div>
  )
}
