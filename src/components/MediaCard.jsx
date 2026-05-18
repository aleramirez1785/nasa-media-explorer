import { Link } from 'react-router-dom'
import { getPreviewImage, truncate, formatDate, buildDetailUrl } from '../utils/helpers'
import { useFavorites } from '../context/FavoritesContext'
import Badge from './ui/Badge'
import LazyImage from './LazyImage'

const MediaCard = ({ item }) => {
  const data = item.data?.[0] || {}
  const { nasa_id, title, description, date_created, media_type } = data
  const previewSrc = getPreviewImage(item)
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(nasa_id)

  const handleFavorite = e => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(item)
  }

  return (
    <Link
      to={buildDetailUrl(nasa_id)}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`View details for ${title}`}
    >
      {/* Image */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
        <LazyImage
          src={previewSrc}
          alt={title || 'NASA media'}
          className="w-full h-full object-cover"
          placeholderClass="w-full h-full"
        />

        {/* Media type badge */}
        <div className="absolute top-2 left-2">
          <Badge type={media_type} />
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          {favorited ? '❤️' : '🤍'}
        </button>

        {/* Video play overlay */}
        {media_type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl ml-1" aria-hidden="true">▶</span>
            </div>
          </div>
        )}

        {/* Audio icon overlay */}
        {media_type === 'audio' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gradient-to-t from-black/60 to-transparent">
            <span className="text-5xl" aria-hidden="true">🎵</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title || 'Untitled'}
        </h3>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
            {truncate(description, 100)}
          </p>
        )}
        {date_created && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {formatDate(date_created)}
          </p>
        )}
      </div>
    </Link>
  )
}

export default MediaCard
