import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { SearchProvider } from './context/SearchContext'
import Layout from './components/layout/Layout'
import Spinner from './components/ui/Spinner'

// Code splitting — lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'))
const DetailPage = lazy(() => import('./pages/DetailPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <Spinner size="lg" />
  </div>
)

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <SearchProvider>
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/detail/:nasaId" element={<DetailPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Layout>
          </SearchProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
