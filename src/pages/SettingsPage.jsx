import React, { useState } from 'react'
import { Save, CheckCircle, User, Info } from 'lucide-react'
import useStore from '../lib/store'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const user = useStore(s => s.user)
  const setUser = useStore(s => s.setUser)
  const conversations = useStore(s => s.conversations)
  const [userName, setUserName] = useState(user.name)

  const saveUser = () => {
    setUser({ name: userName })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const totalMessages = Object.values(conversations).reduce((acc, msgs) => acc + msgs.length, 0)
  const totalChars = Object.keys(conversations).filter(id => conversations[id].length > 0).length

  return (
    <div className="h-full overflow-y-auto bg-animated">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display font-black text-3xl text-white mb-2">Settings</h1>
        <p className="text-muted mb-8">Configure your CharaVerse experience</p>

        {/* Profile */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-ink-700/50 flex items-center justify-center">
              <User size={18} className="text-bright" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">Profile</h2>
              <p className="text-muted text-sm">How characters see you</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted mb-1">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-void border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-ink-500"
            />
          </div>
          <button onClick={saveUser} className="btn-primary flex items-center gap-2">
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>

        {/* Stats */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-ink-700/50 flex items-center justify-center">
              <Info size={18} className="text-bright" />
            </div>
            <h2 className="font-display font-bold text-white text-lg">Your Activity</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-void rounded-xl p-4 text-center">
              <p className="text-3xl font-display font-bold text-bright">{totalChars}</p>
              <p className="text-muted text-sm mt-1">Characters chatted</p>
            </div>
            <div className="bg-void rounded-xl p-4 text-center">
              <p className="text-3xl font-display font-bold text-bright">{totalMessages}</p>
              <p className="text-muted text-sm mt-1">Total messages</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-white text-lg mb-3">About CharaVerse</h2>
          <p className="text-muted text-sm leading-relaxed mb-3">
            CharaVerse is an AI character chat platform powered by Groq (Llama 3 70B). Chat with pre-built characters or create your own with custom personalities and backstories. All conversations are stored locally in your browser.
          </p>
          <div className="flex flex-wrap gap-2">
            {['React', 'Vite', 'Tailwind CSS', 'Zustand', 'Groq API', 'Llama 3 70B'].map(tech => (
              <span key={tech} className="text-xs bg-ink-800/50 text-bright/70 px-2 py-0.5 rounded-full">{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
