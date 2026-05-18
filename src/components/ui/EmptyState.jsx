const EmptyState = ({ query }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-7xl mb-4" aria-hidden="true">🔭</div>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        No results found
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">
        {query
          ? `We couldn't find anything for "${query}". Try different keywords or remove filters.`
          : 'Try searching for something like "Apollo", "Mars", or "Hubble".'}
      </p>
    </div>
  )
}

export default EmptyState
