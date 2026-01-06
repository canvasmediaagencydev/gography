'use client'

interface ProgressBarProps {
  progress: number // 0-100
  message?: string
  showPercentage?: boolean
  variant?: 'default' | 'success' | 'error'
}

export default function ProgressBar({
  progress,
  message,
  showPercentage = true,
  variant = 'default'
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  const getColorClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-orange-500'
    }
  }

  return (
    <div className="w-full space-y-2">
      {message && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300 font-medium">{message}</span>
          {showPercentage && (
            <span className="text-gray-600 dark:text-gray-400">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${getColorClasses()}`}
          style={{ width: `${clampedProgress}%` }}
        >
          <div className="h-full w-full bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  )
}
