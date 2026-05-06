import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Star, Share2 } from 'lucide-react'

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export default function CharacterCard({ character, size = 'default' }) {
  const navigate = useNavigate()
  const [shared, setShared] = useState(false)
  // Touch swipe tracking
  const touchStart = useRef(null)

  const handleShare = (e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/chat/${character.id}`
    navigator.clipboard.writeText(url).catch(() => {})
    setShared(true)
    setTimeout(() => setShared(false), 1500)
  }

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    // swipe left (diff > 60) → go to chat
    if (diff > 60) navigate(`/chat/${character.id}`)
    touchStart.current = null
  }

  if (size === 'small') {
    return (
      <button
        onClick={() => navigate(`/chat/${character.id}`)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex items-center gap-3 p-3 rounded-xl glass glass-hover text-left w-full active:scale-[0.98] transition-transform"
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${character.avatarBg || 'from-purple-900 to-indigo-900'} flex items-center justify-center text-2xl flex-shrink-0`}>
          {character.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white text-sm truncate">{character.name}</p>
          <p className="text-xs text-muted truncate">{character.tagline}</p>
        </div>
        <MessageSquare size={14} className="text-muted flex-shrink-0" />
      </button>
    )
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group rounded-2xl glass glass-hover overflow-hidden text-left w-full active:scale-[0.98] transition-transform"
    >
      {/* Avatar area */}
      <button
        onClick={() => navigate(`/chat/${character.id}`)}
        className="relative h-36 bg-gradient-to-br w-full block"
        style={{ background: undefined }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${character.avatarBg || 'from-purple-900 to-indigo-900'} flex items-center justify-center`}>
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {character.avatar}
          </span>
        </div>
        {character.isOfficial && (
          <div className="absolute top-2 right-2 bg-ink-500/80 backdrop-blur rounded-full px-2 py-0.5 flex items-center gap-1">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-medium">Official</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
      </button>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-display font-bold text-white text-base truncate cursor-pointer flex-1"
            onClick={() => navigate(`/chat/${character.id}`)}
          >
            {character.name}
          </h3>
          <button
            onClick={handleShare}
            className="p-1 text-muted hover:text-bright transition-colors flex-shrink-0"
            title="Share character"
          >
            {shared ? <span className="text-xs text-bright">✓</span> : <Share2 size={14} />}
          </button>
        </div>

        <p
          className="text-sm text-muted line-clamp-2 mb-3 cursor-pointer"
          onClick={() => navigate(`/chat/${character.id}`)}
        >
          {character.tagline}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(character.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-ink-800/50 text-bright/70 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted">
          <div className="flex items-center gap-1">
            <MessageSquare size={12} />
            <span>{formatCount(character.messageCount)} chats</span>
          </div>
        </div>
      </div>
    </div>
  )
}
