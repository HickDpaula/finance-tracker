import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../services/httpClient'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await register({ name, email, password })
      navigate('/login')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar a conta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <label className="flex flex-col gap-1 text-sm">
          Nome
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-600"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-600"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-600"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 py-2.5 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Criando...' : 'Criar conta'}
        </button>
        <p className="text-sm">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
