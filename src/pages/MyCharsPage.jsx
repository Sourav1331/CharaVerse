import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import useStore from '../lib/store'

export default function MyCharsPage() {
  const navigate = useNavigate()
  const customCharacters = useStore(s => s.customCharacters)
  const conversations = useStore(s => s.conversations)
  const clearConversation = useStore(s => s.clearConversation)
  const deleteCharacter = useStore(s => s.deleteCharacter) // ✅ pull deleteCharacter

  const allChars = useStore(s => s.getAllCharacters)()
  const activeConvos = Object.keys(conversations)
    .filter(id => conversations[id].length > 0)
    .map(id => ({ char: allChars.find(c => c.id === id), count: conversations[id].length }))
    .filter(x => x.char)

  const handleDelete = (char) => {
    if (confirm(`Delete "${char.name}"? This will also clear their conversation and memories.`)) {
      deleteCharacter(char.id)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-animated">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-black text-3xl text-white mb-1">My Characters</h1>
            <p className="text-muted">Characters you've created</p>
          </div>
          <button onClick={() => navigate('/create')} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Create New
          </button>
        </div>

        {/* Custom Characters */}
        {customCharacters.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <span className="text-5xl block mb-3">✨</span>
            <h2 className="font-display font-bold text-xl text-white mb-2">No characters yet</h2>
            <p className="text-muted mb-5">Create your first AI companion</p>
            <button onClick={() => navigate('/create')} className="btn-primary">
              Create Character
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-10">
            {customCharacters.map(char => (
              <div key={char.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${char.avatarBg || 'from-purple-900 to-indigo-900'} flex items-center justify-center text-3xl flex-shrink-0`}>
                  {char.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-white">{char.name}</h3>
                  <p className="text-muted text-sm truncate">{char.tagline}</p>
                  <div className="flex gap-1.5 mt-1">
                    {(char.tags || []).slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-ink-800/50 text-bright/60 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/chat/${char.id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink-700/50 hover:bg-ink-600/70 text-white text-sm transition-all"
                  >
                    <MessageSquare size={14} /> Chat
                  </button>
                  {/* ✅ Delete button now actually works */}
                  <button
                    onClick={() => handleDelete(char)}
                    className="p-2 text-muted hover:text-red-400 rounded-xl hover:bg-card transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conversation History */}
        {activeConvos.length > 0 && (
          <>
            <h2 className="font-display font-bold text-xl text-white mb-4">Conversation History</h2>
            <div className="space-y-3">
              {activeConvos.map(({ char, count }) => (
                <div key={char.id} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${char.avatarBg || 'from-purple-900 to-indigo-900'} flex items-center justify-center text-xl flex-shrink-0`}>
                    {char.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm">{char.name}</h4>
                    <p className="text-muted text-xs">{count} messages</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/chat/${char.id}`)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-ink-700/50 text-white hover:bg-ink-600 transition-all"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => { if (confirm('Clear this conversation?')) clearConversation(char.id) }}
                      className="p-1.5 text-muted hover:text-red-400 rounded-lg hover:bg-card transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}