import { useState, useEffect } from 'react'
import { getAsset } from '../services/nasaApi'

const useAssetDetail = nasaId => {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!nasaId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    getAsset(nasaId)
      .then(data => {
        if (!cancelled) {
          setAssets(data?.collection?.items || [])
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || 'Failed to load asset.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [nasaId])

  return { assets, loading, error }
}

export default useAssetDetail
