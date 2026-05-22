import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../SearchBar'

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme()
  const { favorites } = useFavorites()
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            aria-label="NASA Media Explorer home"
          >
            <span className="text-2xl" aria-hidden="true">🚀</span>
            <span className="font-bold text-slate-900 dark:text-white hidden sm:block text-sm">
              NASA<span className="text-blue-500"> Explorer</span>
            </span>
          </Link>

          {/* Search bar — compact in navbar, hidden on home hero */}
          {!isHome && (
            <div className="flex-1 flex justify-center">
              <SearchBar compact />
            </div>
          )}

          {/* Spacer when on home */}
          {isHome && <div className="flex-1" />}

          {/* Nav links */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link
              to="/favorites"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Favoritos (${favorites.length})`}
            >
              <span aria-hidden="true">❤️</span>
              <span className="hidden sm:inline">Favoritos</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* User menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(p => !p)}
                  aria-label="Menú de usuario"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {/* Avatar */}
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center uppercase select-none">
                    {user.name.charAt(0)}
                  </span>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <span className="text-slate-400 text-xs" aria-hidden="true">▾</span>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <span aria-hidden="true">🚪</span>
                        Cerrar sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
