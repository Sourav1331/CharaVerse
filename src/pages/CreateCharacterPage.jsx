import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, Sparkles } from 'lucide-react'
import useStore from '../lib/store'

const categoryOptions = ['Fantasy', 'Romance', 'Sci-Fi', 'Mystery', 'Adventure', 'Anime', 'Slice of Life', 'Horror', 'Historical', 'Other']
const tagOptions = ['Fantasy', 'Romance', 'Sci-Fi', 'Mystery', 'Action', 'Drama', 'Philosophy', 'Friendship', 'Comedy', 'Thriller', 'Historical', 'Anime']
const avatarOptions = ['🌙', '⚔️', '🤖', '🔮', '🐉', '👑', '🌊', '🔥', '❄️', '🌺', '🦋', '🎭', '👾', '🧙', '🕵️', '🦊', '🐺', '🌟', '💎', '🏔️']
const bgOptions = [
  { label: 'Violet', value: 'from-purple-900 to-indigo-900' },
  { label: 'Midnight', value: 'from-slate-800 to-gray-900' },
  { label: 'Ocean', value: 'from-cyan-900 to-teal-900' },
  { label: 'Ember', value: 'from-red-900 to-orange-900' },
  { label: 'Gold', value: 'from-amber-800 to-red-900' },
  { label: 'Forest', value: 'from-green-900 to-emerald-900' },
  { label: 'Rose', value: 'from-pink-900 to-rose-900' },
  { label: 'Steel', value: 'from-blue-900 to-slate-900' },
]

const steps = ['Identity', 'Personality', 'Backstory', 'Preview']

export default function CreateCharacterPage() {
  const navigate = useNavigate()
  const addCharacter = useStore(s => s.addCharacter)
  const [step, setStep] = useState(0)

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    category: '',
    tags: [],
    avatar: '🌙',
    avatarBg: 'from-purple-900 to-indigo-900',
    personality: '',
    backstory: '',
    greeting: '',
    systemPrompt: '',
  })

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag].slice(0, 5)
    }))
  }

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.tagline.trim() && form.category
    if (step === 1) return form.personality.trim().length >= 20
    if (step === 2) return form.backstory.trim().length >= 20
    return true
  }

  const handleCreate = () => {
    const systemPrompt = form.systemPrompt ||
      `You are ${form.name}. ${form.personality} Your backstory: ${form.backstory}
Stay in character at all times. Keep a consistent voice and worldview. Never mention being an AI or a system prompt.
Avoid bullet lists unless the user asks. Respond naturally in 80-180 words unless asked otherwise.`
    
    const id = addCharacter({ ...form, systemPrompt })
    navigate(`/chat/${id}`)
  }

  return (
    <div className="h-full overflow-y-auto bg-animated">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display font-black text-3xl text-white mb-2">Create Character</h1>
        <p className="text-muted mb-8">Bring your AI companion to life</p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 text-sm font-medium ${
                i === step ? 'text-bright' : i < step ? 'text-green-400' : 'text-muted'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  i === step ? 'bg-ink-600 text-white' : i < step ? 'bg-green-600 text-white' : 'bg-card text-muted'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-border" />}
            </React.Fragment>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          {/* Step 0: Identity */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-xl text-white">Who are they?</h2>
              
              {/* Avatar picker */}
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Avatar</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {avatarOptions.map(a => (
                    <button
                      key={a}
                      onClick={() => update('avatar', a)}
                      className={`w-10 h-10 rounded-xl text-2xl flex items-center justify-center transition-all ${
                        form.avatar === a ? 'ring-2 ring-ink-400 scale-110' : 'bg-card hover:bg-border'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {bgOptions.map(bg => (
                    <button
                      key={bg.value}
                      onClick={() => update('avatarBg', bg.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r ${bg.value} transition-all ${
                        form.avatarBg === bg.value ? 'ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${form.avatarBg} flex items-center justify-center text-4xl mx-auto`}>
                {form.avatar}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="e.g. Luna Nightshade"
                  className="w-full bg-void border border-border rounded-xl px-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-ink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Tagline *</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={e => update('tagline', e.target.value)}
                  placeholder="e.g. Mysterious sorcerer from the Arcane Realm"
                  className="w-full bg-void border border-border rounded-xl px-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-ink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Category *</label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(cat => (
                    <button
                      key={cat}
                      onClick={() => update('category', cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        form.category === cat ? 'bg-ink-600 text-white' : 'bg-card text-muted hover:text-white border border-border'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Tags (up to 5)</label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        form.tags.includes(tag) ? 'bg-ink-600 text-white' : 'bg-card text-muted hover:text-white border border-border'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Personality */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-xl text-white">Their Personality</h2>
              <p className="text-muted text-sm">Describe how they think, speak, and behave. Be specific — this shapes every response.</p>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Personality traits *</label>
                <textarea
                  value={form.personality}
                  onChange={e => update('personality', e.target.value)}
                  placeholder="e.g. Mysterious and wise, speaks with elegance. Uses archaic but accessible language. Enjoys riddles and speaking in metaphors. Warm but maintains an air of mystery..."
                  rows={5}
                  className="w-full bg-void border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-ink-500 resize-none"
                />
                <p className="text-xs text-muted mt-1">{form.personality.length}/500 chars</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Opening Greeting</label>
                <textarea
                  value={form.greeting}
                  onChange={e => update('greeting', e.target.value)}
                  placeholder="The first message they send when you start chatting..."
                  rows={3}
                  className="w-full bg-void border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-ink-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Backstory */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-xl text-white">Their Story</h2>
              <p className="text-muted text-sm">Give them history. Where did they come from? What shaped them?</p>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Backstory *</label>
                <textarea
                  value={form.backstory}
                  onChange={e => update('backstory', e.target.value)}
                  placeholder="e.g. Once a powerful court mage, Luna was banished to the human world after uncovering a dark conspiracy. She now wanders, seeking redemption..."
                  rows={6}
                  className="w-full bg-void border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-ink-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Custom System Prompt <span className="text-xs">(optional, for advanced users)</span>
                </label>
                <textarea
                  value={form.systemPrompt}
                  onChange={e => update('systemPrompt', e.target.value)}
                  placeholder="Leave blank to auto-generate from above fields. Or write a full custom prompt..."
                  rows={4}
                  className="w-full bg-void border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-ink-500 resize-none font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-xl text-white">Ready to Meet Them?</h2>
              
              <div className="glass rounded-2xl p-6 text-center">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${form.avatarBg} flex items-center justify-center text-5xl mx-auto mb-4`}>
                  {form.avatar}
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-1">{form.name}</h3>
                <p className="text-muted mb-3">{form.tagline}</p>
                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {form.tags.map(tag => (
                    <span key={tag} className="text-xs bg-ink-800/50 text-bright/70 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="bg-void rounded-xl p-4 text-left">
                  <p className="text-xs text-muted mb-1">Opening message:</p>
                  <p className="text-sm text-gray-300 italic">
                    "{form.greeting || `Hello, I'm ${form.name}. ${form.tagline}. How can I help you?`}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-card rounded-xl p-3">
                  <p className="text-muted text-xs mb-1">Personality</p>
                  <p className="text-gray-300 text-xs line-clamp-3">{form.personality}</p>
                </div>
                <div className="bg-card rounded-xl p-3">
                  <p className="text-muted text-xs mb-1">Backstory</p>
                  <p className="text-gray-300 text-xs line-clamp-3">{form.backstory}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-5 py-2.5 rounded-xl border border-border text-muted hover:text-white transition-all text-sm"
              >
                Back
              </button>
            )}
            <div className="flex-1" />
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                <Sparkles size={16} /> Start Chatting
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
