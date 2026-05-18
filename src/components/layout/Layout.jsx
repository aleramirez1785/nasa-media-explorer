import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-700 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>
          Data provided by{' '}
          <a
            href="https://images.nasa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            NASA Images API
          </a>{' '}
          · Built with React + Vite
        </p>
      </footer>
    </div>
  )
}

export default Layout
