import Button from './Button'

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="text-6xl mb-4" aria-hidden="true">🚀💥</div>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        Houston, we have a problem
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </div>
  )
}

export default ErrorMessage
