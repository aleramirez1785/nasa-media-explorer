import { useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import ResultsGrid from '../components/ResultsGrid'
import { useSearch } from '../context/SearchContext'
import useNasaSearch from '../hooks/useNasaSearch'

const FEATURED_QUERIES = ['Apollo 11', 'Mars Rover', 'Hubble', 'Saturn', 'Nebula', 'ISS']

const HomePage = () => {
  const { hasSearched, query, mediaType, page } = useSearch()
  const { executeSearch } = useNasaSearch()

  // Re-run search if returning to home with existing state
  useEffect(() => {
    if (hasSearched && query && !document.querySelector('[data-results]')) {
      // results already in context, no need to re-fetch
    }
  }, [])

  const handleFeaturedClick = term => {
    executeSearch(term, mediaType, 1)
  }

  return (
    <div>
      {/* Hero section — only shown before first search */}
      {!hasSearched && (
        <section className="flex flex-col items-center text-center py-16 sm:py-24">
          <div className="text-6xl mb-4" aria-hidden="true">🌌</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            NASA Media Explorer
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mb-10">
            Search and explore thousands of images, videos, and audio recordings from NASA's
            archives.
          </p>

          <div className="w-full flex justify-center mb-8">
            <SearchBar autoFocus />
          </div>

          {/* Featured searches */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-slate-400 dark:text-slate-500 self-center mr-1">
              Try:
            </span>
            {FEATURED_QUERIES.map(term => (
              <button
                key={term}
                onClick={() => handleFeaturedClick(term)}
                className="px-3 py-1.5 rounded-full text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      <div data-results>
        <ResultsGrid />
      </div>
    </div>
  )
}

export default HomePage
