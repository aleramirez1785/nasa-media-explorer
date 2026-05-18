import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-8xl mb-4" aria-hidden="true">🛸</div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">
        Lost in Space
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
        The page you're looking for has drifted into a black hole. Let's get you back on course.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Return to Earth
        </Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
