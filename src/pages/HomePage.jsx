import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, Star, Plus, ChevronRight } from 'lucide-react'
import useStore from '../lib/store'
import CharacterCard from '../components/CharacterCard'

const categories = ['All', 'Fantasy', 'Romance', 'Sci-Fi', 'Mystery', 'Adventure', 'Anime']

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const navigate = useNavigate()
  const getAllCharacters = useStore(s => s.getAllCharacters)
  const conversations = useStore(s => s.conversations)

  const allChars = getAllCharacters()
  
  const filtered = activeCategory === 'All' 
    ? allChars 
    : allChars.filter(c => c.category === activeCategory || (c.tags || []).includes(activeCategory))

  const featured = allChars.slice(0, 3)
  const trending = [...allChars].sort((a, b) => b.messageCount - a.messageCount).slice(0, 4)
  
  const recentIds = Object.keys(conversations).filter(id => conversations[id].length > 0)
  const recentChars = recentIds.map(id => allChars.find(c => c.id === id)).filter(Boolean).slice(0, 3)

  return (
    <div className="h-full overflow-y-auto bg-animated">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-ink-600/20 border border-ink-500/30 rounded-full px-4 py-1.5 mb-4">
            <Sparkles size={14} className="text-bright" />
            <span className="text-sm text-bright font-medium">AI-Powered Characters</span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-3 leading-tight">
            Meet Your Next
            <span className="glow-text"> Favorite Character</span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto mb-6">
            Chat with AI companions, explore fantasy worlds, and create characters with stories that remember you.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/discover')} className="btn-primary flex items-center gap-2">
              <Compass size={16} /> Explore Characters
            </button>
            <button 
              onClick={() => navigate('/create')} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-muted hover:text-white hover:border-ink-500/50 transition-all text-sm font-medium"
            >
              <Plus size={16} /> Create Your Own
            </button>
          </div>
        </div>

        {/* Recent Chats */}
        {recentChars.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <span>💬</span> Continue Chatting
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentChars.map(char => (
                <CharacterCard key={char.id} character={char} size="small" />
              ))}
            </div>
          </section>
        )}

        {/* Featured */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Star size={18} className="text-yellow-400" /> Featured
            </h2>
            <button 
              onClick={() => navigate('/discover')} 
              className="text-sm text-muted hover:text-bright flex items-center gap-1 transition-colors"
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featured.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-green-400" /> Trending
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trending.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        </section>

        {/* Create CTA */}
        <div className="rounded-2xl p-8 text-center border border-ink-500/30 bg-gradient-to-br from-ink-800/20 to-transparent">
          <h2 className="font-display font-bold text-2xl text-white mb-2">
            Bring Your Character to Life
          </h2>
          <p className="text-muted mb-5 max-w-md mx-auto">
            Design a character with a unique personality, backstory, and voice. They'll remember your conversations.
          </p>
          <button onClick={() => navigate('/create')} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Create Character
          </button>
        </div>
      </div>
    </div>
  )
}

// Missing import fix
function Compass(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  )
}
