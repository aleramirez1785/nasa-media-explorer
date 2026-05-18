import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../context/SearchContext'
import useDebounce from '../hooks/useDebounce'
import useNasaSearch from '../hooks/useNasaSearch'

const SearchBar = ({ autoFocus = false, compact = false }) => {
  const navigate = useNavigate()
  const { query, setQuery, mediaType, setMediaType, setPage, searchHistory, removeFromHistory } =
    useSearch()
  const { executeSearch } = useNasaSearch()

  const [inputValue, setInputValue] = useState(query)
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const debouncedValue = useDebounce(inputValue, 450)

  // Sync external query changes (e.g. from history click)
  useEffect(() => {
    setInputValue(query)
  }, [query])

  // Auto-search on debounced input change
  useEffect(() => {
    if (debouncedValue.trim() && debouncedValue !== query) {
      setQuery(debouncedValue)
      setPage(1)
      executeSearch(debouncedValue, mediaType, 1)
      navigate('/')
    }
  }, [debouncedValue]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close history dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    const q = inputValue.trim()
    if (!q) return
    setQuery(q)
    setPage(1)
    setShowHistory(false)
    executeSearch(q, mediaType, 1)
    navigate('/')
  }

  const handleHistoryClick = term => {
    setInputValue(term)
    setQuery(term)
    setPage(1)
    setShowHistory(false)
    executeSearch(term, mediaType, 1)
    navigate('/')
  }

  const handleClear = () => {
    setInputValue('')
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative w-full ${compact ? 'max-w-xl' : 'max-w-2xl'}`}>
      <form onSubmit={handleSubmit} role="search">
        <div className="flex gap-2">
          {/* Search input */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true">
              🔍
            </span>
            <input
              ref={inputRef}
              type="search"
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value)
                setShowHistory(e.target.value === '' && searchHistory.length > 0)
              }}
              onFocus={() => {
                if (!inputValue && searchHistory.length > 0) setShowHistory(true)
              }}
              placeholder="Search NASA images, videos, audio…"
              autoFocus={autoFocus}
              aria-label="Search NASA media"
              className={`w-full pl-10 pr-10 ${compact ? 'py-2 text-sm' : 'py-3'} rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow`}
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Media type filter */}
          <select
            value={mediaType}
            onChange={e => {
              setMediaType(e.target.value)
              if (query.trim()) {
                setPage(1)
                executeSearch(query, e.target.value, 1)
              }
            }}
            aria-label="Filter by media type"
            className={`${compact ? 'py-2 text-sm' : 'py-3'} px-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
          >
            <option value="">All types</option>
            <option value="image">🖼️ Images</option>
            <option value="video">🎬 Videos</option>
            <option value="audio">🎵 Audio</option>
          </select>

          {/* Search button */}
          <button
            type="submit"
            className={`${compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'} bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 whitespace-nowrap`}
          >
            Search
          </button>
        </div>
      </form>

      {/* Search history dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Recent searches
            </span>
          </div>
          <ul role="listbox" aria-label="Search history">
            {searchHistory.map(term => (
              <li key={term} className="flex items-center group">
                <button
                  type="button"
                  onClick={() => handleHistoryClick(term)}
                  className="flex-1 flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition-colors"
                >
                  <span className="text-slate-400" aria-hidden="true">🕐</span>
                  {term}
                </button>
                <button
                  type="button"
                  onClick={() => removeFromHistory(term)}
                  aria-label={`Remove "${term}" from history`}
                  className="px-3 py-2.5 text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchBar
