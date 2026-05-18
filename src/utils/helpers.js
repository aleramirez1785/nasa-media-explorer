/**
 * Debounce a function call
 * @param {Function} fn
 * @param {number} delay - ms
 */
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Extract the best preview image from a NASA collection item
 * @param {Object} item - NASA API collection item
 * @returns {string} image URL
 */
export const getPreviewImage = item => {
  const links = item.links || []
  const preview = links.find(l => l.rel === 'preview' && l.href)
  if (preview) return preview.href

  // fallback: look for thumb in links
  const thumb = links.find(l => l.href && l.href.includes('thumb'))
  if (thumb) return thumb.href

  return '/nasa-placeholder.svg'
}

/**
 * Truncate text to a max length
 * @param {string} text
 * @param {number} max
 */
export const truncate = (text, max = 120) => {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

/**
 * Format an ISO date string to a readable format
 * @param {string} dateStr
 */
export const formatDate = dateStr => {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/**
 * Get media type icon label
 * @param {string} mediaType
 */
export const getMediaTypeLabel = mediaType => {
  const map = { image: '🖼️ Image', video: '🎬 Video', audio: '🎵 Audio' }
  return map[mediaType] || mediaType
}

/**
 * Get media type badge color classes
 * @param {string} mediaType
 */
export const getMediaTypeBadgeClass = mediaType => {
  const map = {
    image: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    video: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    audio: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }
  return map[mediaType] || 'bg-gray-100 text-gray-800'
}

/**
 * Build a shareable URL for a detail page
 * @param {string} nasaId
 */
export const buildDetailUrl = nasaId => `/detail/${encodeURIComponent(nasaId)}`

/**
 * Safely parse JSON from localStorage
 * @param {string} key
 * @param {*} fallback
 */
export const localStorageGet = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/**
 * Safely set JSON in localStorage
 * @param {string} key
 * @param {*} value
 */
export const localStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota exceeded or private mode
  }
}
