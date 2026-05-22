import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { SearchProvider } from './context/SearchContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Spinner from './components/ui/Spinner'

// Code splitting — lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'))
const DetailPage = lazy(() => import('./pages/DetailPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))

const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <Spinner size="lg" />
  </div>
)

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <SearchProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Ruta pública — login/registro (sin Layout) */}
                  <Route path="/login" element={<AuthPage />} />

                  {/* Rutas protegidas — requieren autenticación */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
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
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </SearchProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
