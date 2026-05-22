import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm'

const AuthPage = () => {
  const { login, register } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'
  const [tab, setTab] = useState(location.state?.tab || 'login')

  // ── form state ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const switchTab = t => {
    setTab(t)
    setForm({ name: '', email: '', password: '', confirm: '' })
    setError('')
  }

  // ── validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.email.trim()) return 'El correo es requerido.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Correo inválido.'
    if (!form.password) return 'La contraseña es requerida.'
    if (tab === 'register') {
      if (!form.name.trim()) return 'El nombre es requerido.'
      if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
      if (form.password !== form.confirm) return 'Las contraseñas no coinciden.'
    }
    return null
  }

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)

    setLoading(true)
    setError('')

    try {
      if (tab === 'login') {
        await login({ email: form.email, password: form.password })
      } else {
        await register({ name: form.name, email: form.email, password: form.password })
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">🚀</span>
          <span className="font-bold text-sm hidden sm:block">
            NASA<span className="text-blue-500"> Explorer</span>
          </span>
        </Link>
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3" aria-hidden="true">🌌</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {tab === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {tab === 'login'
                ? 'Inicia sesión para explorar el universo'
                : 'Regístrate y empieza a explorar'}
            </p>
          </div>

          {/* Card container */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {['login', 'register'].map(t => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors focus:outline-none ${
                    tab === t
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
              {/* Name — only on register */}
              {tab === 'register' && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                    autoFocus={tab === 'register'}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={handleChange}
                  className={INPUT_CLASS}
                  autoFocus={tab === 'login'}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                    value={form.password}
                    onChange={handleChange}
                    className={`${INPUT_CLASS} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Confirm password — only on register */}
              {tab === 'register' && (
                <div>
                  <label
                    htmlFor="confirm"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
                  >
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirm"
                    name="confirm"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repite tu contraseña"
                    value={form.confirm}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                </div>
              )}

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
                >
                  <span aria-hidden="true">⚠️</span>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {tab === 'login' ? 'Entrando…' : 'Creando cuenta…'}
                  </>
                ) : tab === 'login' ? (
                  'Iniciar sesión'
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </form>
          </div>

          {/* Switch tab hint */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            {tab === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => switchTab('register')}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Regístrate gratis
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => switchTab('login')}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
