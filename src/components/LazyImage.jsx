import { useState } from 'react'
import useIntersectionObserver from '../hooks/useIntersectionObserver'

const LazyImage = ({ src, alt, className = '', placeholderClass = '' }) => {
  const [ref, isVisible] = useIntersectionObserver()
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div ref={ref} className={`relative overflow-hidden ${placeholderClass}`}>
      {/* Skeleton placeholder */}
      {!loaded && !errored && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
      )}

      {/* Error fallback */}
      {errored && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
          <span className="text-4xl" aria-hidden="true">🌌</span>
        </div>
      )}

      {/* Actual image — only rendered when visible */}
      {isVisible && !errored && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          loading="lazy"
        />
      )}
    </div>
  )
}

export default LazyImage
