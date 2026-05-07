import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, Trash2, Info, Brain, Share2, X, Smile } from 'lucide-react'
import useStore from '../lib/store'
import { sendMessageToCharacter, detectMoodFromText } from '../lib/api'

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '🔥', '👏']

export default function ChatPage() {
  const { characterId } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showMemory, setShowMemory] = useState(false)
  const [error, setError] = useState(null)
  const [reactionTarget, setReactionTarget] = useState(null)
  const [shareToast, setShareToast] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const greetingAdded = useRef(false)

  // ALL state subscribed directly — no getter functions
  const character = useStore(s =>
    [...s.characters, ...s.customCharacters].find(c => c.id === characterId)
  )
  const messages = useStore(s => s.conversations[characterId] || [])
  const memories = useStore(s => s.memories[characterId] || [])
  const mood = useStore(s => {
    const saved = s.moods[characterId]
    if (saved) return saved
    const char = [...s.characters, ...s.customCharacters].find(c => c.id === characterId)
    return char?.moodDefault || '😊'
  })

  // Actions
  const addMessage = useStore(s => s.addMessage)
  const clearConversation = useStore(s => s.clearConversation)
  const setMood = useStore(s => s.setMood)
  const getMemoryContext = useStore(s => s.getMemoryContext)
  const toggleReaction = useStore(s => s.toggleReaction)

  useEffect(() => {
    if (!character) navigate('/')
  }, [character])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    greetingAdded.current = false
  }, [characterId])

  useEffect(() => {
    if (character && messages.length === 0 && !greetingAdded.current) {
      greetingAdded.current = true
      const greeting = character.greeting || `Hello! I'm ${character.name}. How can I help you today?`
      addMessage(characterId, { role: 'assistant', content: greeting })
      const initialMood = detectMoodFromText(greeting)
      setMood(characterId, initialMood || character.moodDefault || '😊')
    }
  }, [characterId, character])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isTyping) return

    setInput('')
    setError(null)
    setReactionTarget(null)

    addMessage(characterId, { role: 'user', content: text })
    setIsTyping(true)

    try {
      const currentMessages = useStore.getState().conversations[characterId] || []
      const history = currentMessages
        .filter((_, i) => i > 0)
        .map(m => ({ role: m.role, content: m.content }))

      const memCtx = getMemoryContext(characterId)
      const response = await sendMessageToCharacter(character, history, text, memCtx)
      addMessage(characterId, { role: 'assistant', content: response })

      const detectedMood = detectMoodFromText(response)
      if (detectedMood) setMood(characterId, detectedMood)
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setIsTyping(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/chat/${characterId}`
    try {
      await navigator.clipboard.writeText(url)
      setShareToast('Link copied!')
    } catch {
      setShareToast('Clipboard blocked')
    }
    setTimeout(() => setShareToast(''), 2500)
  }

  const handleReaction = (messageId, emoji) => {
    toggleReaction(characterId, messageId, emoji)
    setReactionTarget(null)
  }

  if (!character) return null

  const activePanel = showMemory ? 'memory' : showInfo ? 'info' : null

  return (
    <div className="h-screen flex flex-col bg-void">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface flex-shrink-0">
        <button onClick={() => navigate(-1)} className="text-muted hover:text-white transition-colors p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>

        {/* Avatar with mood badge */}
        <div className="relative flex-shrink-0">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${character.avatarBg || 'from-purple-900 to-indigo-900'} flex items-center justify-center text-xl`}>
            {character.avatar}
          </div>
          <div
            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center"
            style={{ fontSize: '16px', lineHeight: 1, zIndex: 10 }}
          >
            {mood}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-white text-sm truncate">{character.name}</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-muted">Online · Mood: {mood}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={handleShare} className="p-2 text-muted hover:text-white rounded-lg hover:bg-card transition-all">
            <Share2 size={17} />
          </button>
          <button
            onClick={() => { setShowMemory(!showMemory); setShowInfo(false) }}
            className={`p-2 rounded-lg transition-all ${showMemory ? 'text-bright bg-ink-800/50' : 'text-muted hover:text-white hover:bg-card'}`}
          >
            <Brain size={17} />
          </button>
          <button
            onClick={() => { setShowInfo(!showInfo); setShowMemory(false) }}
            className={`p-2 rounded-lg transition-all ${showInfo ? 'text-bright bg-ink-800/50' : 'text-muted hover:text-white hover:bg-card'}`}
          >
            <Info size={17} />
          </button>
          <button
            onClick={() => { if (confirm('Clear this conversation?')) clearConversation(characterId) }}
            className="p-2 text-muted hover:text-red-400 rounded-lg hover:bg-card transition-all"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Share toast */}
      {shareToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-ink-600 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-fade-in">
          🔗 {shareToast}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3"
            onClick={() => setReactionTarget(null)}
          >
            {messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} group relative`}
              >
                {msg.role === 'assistant' && (
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${character.avatarBg || 'from-purple-900 to-indigo-900'} flex items-center justify-center text-base flex-shrink-0 mt-1`}>
                    {character.avatar}
                  </div>
                )}
                <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed cursor-pointer ${
                      msg.role === 'user' ? 'msg-user text-white' : 'msg-ai text-gray-100'
                    }`}
                    onDoubleClick={() => setReactionTarget(reactionTarget === msg.id ? null : msg.id)}
                  >
                    {msg.content}
                  </div>

                  {msg.reactions?.length > 0 && (
                    <div className={`flex gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {[...new Set(msg.reactions)].map(emoji => (
                        <button
                          key={emoji}
                          onClick={(e) => { e.stopPropagation(); handleReaction(msg.id, emoji) }}
                          className="text-sm bg-card border border-border rounded-full px-2 py-0.5 hover:bg-ink-700 transition-colors"
                        >
                          {emoji} {msg.reactions.filter(r => r === emoji).length}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-muted px-1">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setReactionTarget(reactionTarget === msg.id ? null : msg.id) }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-white p-0.5"
                    >
                      <Smile size={13} />
                    </button>
                  </div>

                  {reactionTarget === msg.id && (
                    <div
                      className={`flex gap-1 bg-card border border-border rounded-2xl px-3 py-2 shadow-xl z-10 ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
                      onClick={e => e.stopPropagation()}
                    >
                      {REACTION_EMOJIS.map(emoji => (
                        <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-lg hover:scale-125 transition-transform">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${character.avatarBg || 'from-purple-900 to-indigo-900'} flex items-center justify-center text-base flex-shrink-0`}>
                  {character.avatar}
                </div>
                <div className="msg-ai px-4 py-3 flex items-center gap-1.5">
                  <span className="typing-dot w-2 h-2 rounded-full bg-muted" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-muted" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-muted" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="mx-4 mb-2 px-4 py-2 bg-red-900/30 border border-red-700/40 rounded-xl text-sm text-red-300 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200 ml-2">✕</button>
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-border/50">
            <div className="flex gap-3 bg-card border border-border rounded-2xl p-2 focus-within:border-ink-500 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${character.name}...`}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder:text-muted resize-none outline-none px-2 py-2 text-sm leading-relaxed max-h-32"
                onInput={e => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-ink-600 hover:bg-ink-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0 self-end"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {activePanel && (
          <div className="w-72 border-l border-border bg-surface overflow-y-auto flex-shrink-0 hidden md:block">
            {activePanel === 'info' && (
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${character.avatarBg} flex items-center justify-center text-4xl mx-auto mb-3`}>
                    {character.avatar}
                  </div>
                  <h3 className="font-display font-bold text-white text-xl">{character.name}</h3>
                  <p className="text-muted text-sm">{character.tagline}</p>
                  <p className="text-3xl mt-2">{mood}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Personality</h4>
                  <p className="text-sm text-gray-300">{character.personality}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Backstory</h4>
                  <p className="text-sm text-gray-300">{character.backstory}</p>
                </div>
              </div>
            )}

            {activePanel === 'memory' && (
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={18} className="text-bright" />
                  <h3 className="font-display font-bold text-white text-lg">Memory</h3>
                </div>
                <p className="text-muted text-xs mb-4">Things {character.name} remembers about you:</p>
                {memories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-3">🧠</p>
                    <p className="text-sm text-muted">No memories yet</p>
                    <p className="text-xs text-muted/60 mt-1">Chat more to build memories</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {memories.map((mem, i) => (
                      <div key={mem.id || i} className="bg-void rounded-xl px-3 py-2.5 border border-border/50">
                        <p className="text-sm text-gray-300">{mem.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {activePanel && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowInfo(false); setShowMemory(false) }} />
          <div className="relative bg-surface rounded-t-3xl border-t border-border max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-border">
              <h3 className="font-display font-bold text-white">
                {activePanel === 'memory' ? '🧠 Memory' : `ℹ️ ${character.name}`}
              </h3>
              <button onClick={() => { setShowInfo(false); setShowMemory(false) }} className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-card">
                <X size={18} />
              </button>
            </div>
            {activePanel === 'memory' && (
              <div className="p-5">
                {memories.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-3xl mb-2">🧠</p>
                    <p className="text-sm text-muted">No memories yet — keep chatting!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {memories.map((mem, i) => (
                      <div key={mem.id || i} className="bg-void rounded-xl px-3 py-2.5 border border-border/50">
                        <p className="text-sm text-gray-300">{mem.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activePanel === 'info' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${character.avatarBg} flex items-center justify-center text-3xl`}>
                    {character.avatar}
                  </div>
                  <div>
                    <p className="font-display font-bold text-white text-lg">{character.name}</p>
                    <p className="text-muted text-sm">{character.tagline}</p>
                    <p className="text-2xl mt-1">{mood}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Personality</h4>
                  <p className="text-sm text-gray-300">{character.personality}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
