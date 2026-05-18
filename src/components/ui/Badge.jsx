import { getMediaTypeBadgeClass } from '../../utils/helpers'

const Badge = ({ type, className = '' }) => {
  const icons = { image: '🖼️', video: '🎬', audio: '🎵' }
  const labels = { image: 'Image', video: 'Video', audio: 'Audio' }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getMediaTypeBadgeClass(type)} ${className}`}
    >
      <span aria-hidden="true">{icons[type]}</span>
      {labels[type] || type}
    </span>
  )
}

export default Badge
