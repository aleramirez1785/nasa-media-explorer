import { useCallback } from 'react'
import { searchMedia } from '../services/nasaApi'
import { useSearch } from '../context/SearchContext'

const PAGE_SIZE = 24

const useNasaSearch = () => {
  const {
    query,
    mediaType,
    page,
    setResults,
    setTotalHits,
    setLoading,
    setError,
    setHasSearched,
    addToHistory,
  } = useSearch()

  const executeSearch = useCallback(
    async (searchQuery, searchMediaType, searchPage) => {
      const q = searchQuery ?? query
      const mt = searchMediaType ?? mediaType
      const pg = searchPage ?? page

      if (!q.trim()) return

      setLoading(true)
      setError(null)
      setHasSearched(true)

      try {
        const data = await searchMedia({
          q,
          media_type: mt || undefined,
          page: pg,
          page_size: PAGE_SIZE,
        })

        const items = data?.collection?.items || []
        const totalHits = data?.collection?.metadata?.total_hits || 0

        setResults(items)
        setTotalHits(totalHits)
        addToHistory(q)
      } catch (err) {
        const message =
          err.response?.status === 404
            ? 'No results found for your search.'
            : err.message || 'Something went wrong. Please try again.'
        setError(message)
        setResults([])
        setTotalHits(0)
      } finally {
        setLoading(false)
      }
    },
    [query, mediaType, page, setResults, setTotalHits, setLoading, setError, setHasSearched, addToHistory]
  )

  return { executeSearch, pageSize: PAGE_SIZE }
}

export default useNasaSearch
