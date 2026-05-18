import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref and a boolean indicating if the element is visible
 * Used for lazy loading images
 */
const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '100px', ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

export default useIntersectionObserver
