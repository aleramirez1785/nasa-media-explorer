import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import MediaCard from '../components/MediaCard'
import Button from '../components/ui/Button'

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            ❤️ Favorites
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {favorites.length} saved item{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
        {favorites.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (window.confirm('Clear all favorites?')) {
                favorites.forEach(f => removeFavorite(f.data?.[0]?.nasa_id))
              }
            }}
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Empty state */}
      {favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-7xl mb-4" aria-hidden="true">🤍</div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            No favorites yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Start exploring and save your favorite NASA media by clicking the heart icon on any
            card.
          </p>
          <Link to="/">
            <Button variant="primary">Explore NASA Media</Button>
          </Link>
        </div>
      )}

      {/* Grid */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favorites.map(item => {
            const nasaId = item.data?.[0]?.nasa_id
            return <MediaCard key={nasaId} item={item} />
          })}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
