import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useFavorites } from '../../context/FavoritesContext'
import SearchBar from '../SearchBar'

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme()
  const { favorites } = useFavorites()
  const location = useLocation()
  const isHome = location.pathname === '/'

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
              aria-label={`Favorites (${favorites.length})`}
            >
              <span aria-hidden="true">❤️</span>
              <span className="hidden sm:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
