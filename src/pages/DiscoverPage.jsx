import React, { useState } from 'react'
import { Search } from 'lucide-react'
import useStore from '../lib/store'
import CharacterCard from '../components/CharacterCard'

const categories = ['All', 'Fantasy', 'Romance', 'Sci-Fi', 'Mystery', 'Adventure', 'Anime', 'Slice of Life']

export default function DiscoverPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const getAllCharacters = useStore(s => s.getAllCharacters)

  const allChars = getAllCharacters()

  const filtered = allChars.filter(char => {
    const matchesSearch = !search || 
      char.name.toLowerCase().includes(search.toLowerCase()) ||
      char.tagline.toLowerCase().includes(search.toLowerCase()) ||
      (char.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
    
    const matchesCategory = activeCategory === 'All' ||
      char.category === activeCategory ||
      (char.tags || []).includes(activeCategory)
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full overflow-y-auto bg-animated">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display font-black text-3xl text-white mb-2">Discover Characters</h1>
        <p className="text-muted mb-6">Find your perfect AI companion</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search characters, genres, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-ink-500 transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-ink-600 text-white'
                  : 'bg-card text-muted hover:text-white border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-muted mb-4">{filtered.length} characters found</p>
        
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-display font-bold text-white text-xl mb-2">No characters found</p>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
