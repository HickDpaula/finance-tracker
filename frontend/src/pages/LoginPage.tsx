import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { loginThunk } from '../store/authSlice'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await dispatch(loginThunk({ email, password })).unwrap()
      navigate('/')
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Não foi possível entrar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0d0d0d] p-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-white/10 bg-[#141414] p-8"
      >
        <h1 className="text-2xl font-semibold">Entrar</h1>
        {error && <p className="text-sm text-[#e66767]">{error}</p>}
        <label className="flex flex-col gap-1 text-sm text-[#c3c2b7]">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2 text-base text-white outline-none focus:border-[#3987e5]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#c3c2b7]">
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2 text-base text-white outline-none focus:border-[#3987e5]"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#3987e5] py-2.5 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-sm text-[#898781]">
          Não tem conta?{' '}
          <Link to="/register" className="text-[#3987e5] underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  )
}
