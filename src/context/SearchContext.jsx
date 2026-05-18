import { createContext, useContext, useState, useCallback } from 'react'
import { localStorageGet, localStorageSet } from '../utils/helpers'

const SearchContext = createContext(null)

const HISTORY_KEY = 'nasa-search-history'
const MAX_HISTORY = 10

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [page, setPage] = useState(1)
  const [results, setResults] = useState([])
  const [totalHits, setTotalHits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchHistory, setSearchHistory] = useState(() => localStorageGet(HISTORY_KEY, []))

  const addToHistory = useCallback(term => {
    if (!term.trim()) return
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== term)
      const next = [term, ...filtered].slice(0, MAX_HISTORY)
      localStorageSet(HISTORY_KEY, next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorageSet(HISTORY_KEY, [])
  }, [])

  const removeFromHistory = useCallback(term => {
    setSearchHistory(prev => {
      const next = prev.filter(h => h !== term)
      localStorageSet(HISTORY_KEY, next)
      return next
    })
  }, [])

  const resetSearch = useCallback(() => {
    setResults([])
    setTotalHits(0)
    setPage(1)
    setError(null)
    setHasSearched(false)
  }, [])

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        mediaType,
        setMediaType,
        page,
        setPage,
        results,
        setResults,
        totalHits,
        setTotalHits,
        loading,
        setLoading,
        error,
        setError,
        hasSearched,
        setHasSearched,
        searchHistory,
        addToHistory,
        clearHistory,
        removeFromHistory,
        resetSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}
