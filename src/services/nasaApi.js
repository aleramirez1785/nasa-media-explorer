import axios from 'axios'

const BASE_URL = import.meta.env.VITE_NASA_API_BASE_URL || 'https://images-api.nasa.gov'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

/**
 * Search NASA media assets
 * @param {Object} params
 * @param {string} params.q - Search query
 * @param {string} [params.media_type] - 'image' | 'video' | 'audio'
 * @param {number} [params.page] - Page number (default 1)
 * @param {number} [params.page_size] - Results per page (max 100)
 * @param {string} [params.year_start] - Filter by start year
 * @param {string} [params.year_end] - Filter by end year
 */
export const searchMedia = async ({ q, media_type, page = 1, page_size = 24, year_start, year_end }) => {
  const params = { q, page, page_size }
  if (media_type) params.media_type = media_type
  if (year_start) params.year_start = year_start
  if (year_end) params.year_end = year_end

  const response = await api.get('/search', { params })
  return response.data
}

/**
 * Get asset manifest for a NASA ID
 * @param {string} nasaId
 */
export const getAsset = async nasaId => {
  const response = await api.get(`/asset/${encodeURIComponent(nasaId)}`)
  return response.data
}

/**
 * Get metadata for a NASA ID
 * @param {string} nasaId
 */
export const getMetadata = async nasaId => {
  const response = await api.get(`/metadata/${encodeURIComponent(nasaId)}`)
  return response.data
}

/**
 * Get captions for a NASA ID (video only)
 * @param {string} nasaId
 */
export const getCaptions = async nasaId => {
  const response = await api.get(`/captions/${encodeURIComponent(nasaId)}`)
  return response.data
}

export default api
