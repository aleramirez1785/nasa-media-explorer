import { createContext, useContext, useState, useCallback } from 'react'
import { localStorageGet, localStorageSet } from '../utils/helpers'

const FavoritesContext = createContext(null)

const STORAGE_KEY = 'nasa-favorites'

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => localStorageGet(STORAGE_KEY, []))

  const addFavorite = useCallback(item => {
    setFavorites(prev => {
      const nasaId = item.data?.[0]?.nasa_id
      if (!nasaId || prev.some(f => f.data?.[0]?.nasa_id === nasaId)) return prev
      const next = [item, ...prev]
      localStorageSet(STORAGE_KEY, next)
      return next
    })
  }, [])

  const removeFavorite = useCallback(nasaId => {
    setFavorites(prev => {
      const next = prev.filter(f => f.data?.[0]?.nasa_id !== nasaId)
      localStorageSet(STORAGE_KEY, next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    nasaId => favorites.some(f => f.data?.[0]?.nasa_id === nasaId),
    [favorites]
  )

  const toggleFavorite = useCallback(
    item => {
      const nasaId = item.data?.[0]?.nasa_id
      if (isFavorite(nasaId)) {
        removeFavorite(nasaId)
      } else {
        addFavorite(item)
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  )

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
