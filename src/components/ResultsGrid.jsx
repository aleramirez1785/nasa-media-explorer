import MediaCard from './MediaCard'
import Spinner from './ui/Spinner'
import ErrorMessage from './ui/ErrorMessage'
import EmptyState from './ui/EmptyState'
import Pagination from './Pagination'
import { useSearch } from '../context/SearchContext'
import useNasaSearch from '../hooks/useNasaSearch'

const ResultsGrid = () => {
  const { results, loading, error, hasSearched, query, totalHits, page, setPage } = useSearch()
  const { executeSearch, pageSize } = useNasaSearch()

  const totalPages = Math.ceil(totalHits / pageSize)

  const handlePageChange = newPage => {
    setPage(newPage)
    executeSearch(query, undefined, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRetry = () => {
    executeSearch(query, undefined, page)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner size="lg" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Searching the cosmos…</p>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />
  }

  if (hasSearched && results.length === 0) {
    return <EmptyState query={query} />
  }

  if (!hasSearched) {
    return null
  }

  return (
    <section aria-label="Search results">
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {totalHits.toLocaleString()}
          </span>{' '}
          results for{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">"{query}"</span>
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Page {page} of {totalPages}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {results.map(item => {
          const nasaId = item.data?.[0]?.nasa_id
          return <MediaCard key={nasaId || Math.random()} item={item} />
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </section>
  )
}

export default ResultsGrid
