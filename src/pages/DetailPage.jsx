import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { searchMedia } from '../services/nasaApi'
import useAssetDetail from '../hooks/useAssetDetail'
import { useFavorites } from '../context/FavoritesContext'
import { formatDate, getMediaTypeBadgeClass } from '../utils/helpers'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import Button from '../components/ui/Button'

const DetailPage = () => {
  const { nasaId } = useParams()
  const navigate = useNavigate()
  const decodedId = decodeURIComponent(nasaId)

  const [item, setItem] = useState(null)
  const [itemLoading, setItemLoading] = useState(true)
  const [itemError, setItemError] = useState(null)

  const { assets, loading: assetsLoading, error: assetsError } = useAssetDetail(decodedId)
  const { isFavorite, toggleFavorite } = useFavorites()

  // Fetch item metadata via search
  useEffect(() => {
    let cancelled = false
    setItemLoading(true)
    setItemError(null)

    searchMedia({ q: decodedId, page_size: 10 })
      .then(data => {
        if (cancelled) return
        const items = data?.collection?.items || []
        const found = items.find(i => i.data?.[0]?.nasa_id === decodedId)
        if (found) {
          setItem(found)
        } else if (items.length > 0) {
          setItem(items[0])
        } else {
          setItemError('Item not found.')
        }
      })
      .catch(err => {
        if (!cancelled) setItemError(err.message || 'Failed to load item.')
      })
      .finally(() => {
        if (!cancelled) setItemLoading(false)
      })

    return () => { cancelled = true }
  }, [decodedId])

  if (itemLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner size="lg" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading…</p>
      </div>
    )
  }

  if (itemError) {
    return <ErrorMessage message={itemError} onRetry={() => navigate(-1)} />
  }

  if (!item) return null

  const data = item.data?.[0] || {}
  const {
    title,
    description,
    date_created,
    media_type,
    keywords = [],
    center,
    photographer,
    location,
  } = data

  const favorited = isFavorite(decodedId)

  // Find best media asset
  const imageAsset = assets.find(a => a.href?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
  const videoAsset = assets.find(a => a.href?.match(/\.(mp4|mov|webm)$/i))
  const audioAsset = assets.find(a => a.href?.match(/\.(mp3|wav|ogg|m4a)$/i))
  const previewAsset = assets.find(a => a.href?.includes('~thumb') || a.href?.includes('preview'))

  const previewSrc = item.links?.find(l => l.rel === 'preview')?.href

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} icon="←">
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Media column */}
        <div className="lg:col-span-3">
          {/* Image */}
          {(media_type === 'image' || !media_type) && (imageAsset || previewSrc) && (
            <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-lg">
              <img
                src={imageAsset?.href || previewSrc}
                alt={title || 'NASA media'}
                className="w-full h-auto object-contain max-h-[70vh]"
                loading="lazy"
              />
            </div>
          )}

          {/* Video */}
          {media_type === 'video' && videoAsset && (
            <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
              <video
                controls
                className="w-full max-h-[70vh]"
                poster={previewSrc}
                aria-label={title}
              >
                <source src={videoAsset.href} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Audio */}
          {media_type === 'audio' && audioAsset && (
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 shadow-lg flex flex-col items-center gap-6">
              {previewSrc && (
                <img
                  src={previewSrc}
                  alt={title}
                  className="w-32 h-32 rounded-full object-cover shadow-xl"
                />
              )}
              <div className="text-5xl" aria-hidden="true">🎵</div>
              <audio controls className="w-full" aria-label={title}>
                <source src={audioAsset.href} />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}

          {/* Loading assets */}
          {assetsLoading && (
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 aspect-video flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}

          {/* Asset error fallback */}
          {assetsError && previewSrc && (
            <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-lg">
              <img src={previewSrc} alt={title} className="w-full h-auto object-contain" />
            </div>
          )}

          {/* Download links */}
          {assets.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Available files
              </h3>
              <div className="flex flex-wrap gap-2">
                {assets.slice(0, 6).map((asset, i) => {
                  const ext = asset.href?.split('.').pop()?.split('?')[0]?.toUpperCase()
                  return (
                    <a
                      key={i}
                      href={asset.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors"
                    >
                      ↓ {ext || 'File'}
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Badge + Favorite */}
          <div className="flex items-start justify-between gap-3">
            <Badge type={media_type} />
            <button
              onClick={() => toggleFavorite(item)}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {favorited ? '❤️' : '🤍'}
              <span className="text-slate-600 dark:text-slate-300">
                {favorited ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {title || 'Untitled'}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {description}
            </p>
          )}

          {/* Metadata */}
          <dl className="space-y-3 text-sm">
            {date_created && (
              <div>
                <dt className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
                  Date
                </dt>
                <dd className="text-slate-700 dark:text-slate-200">{formatDate(date_created)}</dd>
              </div>
            )}
            {center && (
              <div>
                <dt className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
                  NASA Center
                </dt>
                <dd className="text-slate-700 dark:text-slate-200">{center}</dd>
              </div>
            )}
            {photographer && (
              <div>
                <dt className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
                  Photographer
                </dt>
                <dd className="text-slate-700 dark:text-slate-200">{photographer}</dd>
              </div>
            )}
            {location && (
              <div>
                <dt className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
                  Location
                </dt>
                <dd className="text-slate-700 dark:text-slate-200">{location}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
                NASA ID
              </dt>
              <dd className="text-slate-700 dark:text-slate-200 font-mono text-xs break-all">
                {decodedId}
              </dd>
            </div>
          </dl>

          {/* Keywords */}
          {keywords.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {keywords.slice(0, 15).map(kw => (
                  <Link
                    key={kw}
                    to={`/?q=${encodeURIComponent(kw)}`}
                    className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailPage
