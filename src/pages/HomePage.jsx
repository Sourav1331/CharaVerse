import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Star, Plus, ChevronRight, Compass, Flame, MessageCircleHeart } from 'lucide-react'
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
  const totalChats = allChars.reduce((sum, char) => sum + (char.messageCount || 0), 0)

  return (
    <div className="h-full overflow-y-auto bg-animated">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative text-center mb-12 overflow-hidden rounded-3xl border border-border/70 p-8 md:p-10 bg-gradient-to-br from-card/90 via-surface/80 to-card/90"
        >
          <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-ink-500/25 blur-3xl hero-float" />

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
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="chip"><Flame size={13} /> {trending.length} Trending Picks</span>
            <span className="chip"><MessageCircleHeart size={13} /> {totalChats.toLocaleString()} Total Chats</span>
            <span className="chip"><Sparkles size={13} /> {allChars.length} Characters</span>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/discover')} className="btn-primary flex items-center gap-2 pulse-on-hover">
              <Compass size={16} /> Explore Characters
            </button>
            <button 
              onClick={() => navigate('/create')} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-muted hover:text-white hover:border-ink-500/50 transition-all text-sm font-medium"
            >
              <Plus size={16} /> Create Your Own
            </button>
          </div>
        </motion.div>

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
