import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, Compass, Plus, User, Settings, MessageSquare, 
  Menu, X, Sparkles, ChevronRight
} from 'lucide-react'
import useStore from '../lib/store'

const navItems = [
  { to: '/', icon: Home, label: 'Home', exact: true },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/create', icon: Plus, label: 'Create' },
  { to: '/my-characters', icon: User, label: 'My Chars' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const conversations = useStore(s => s.conversations)
  const getAllCharacters = useStore(s => s.getAllCharacters)
  const navigate = useNavigate()
  const location = useLocation()

  const isChatPage = location.pathname.startsWith('/chat/')

  const allChars = getAllCharacters()
  const recentChats = Object.keys(conversations)
    .filter(id => conversations[id].length > 0)
    .slice(0, 5)
    .map(id => allChars.find(c => c.id === id))
    .filter(Boolean)

  return (
    <div className="flex h-screen bg-void overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop only */}
      <aside className={`
        fixed lg:relative z-50 h-full w-64 flex flex-col
        bg-surface border-r border-border
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ink-400 to-ink-700 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg glow-text">CharaVerse</span>
          <button 
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-muted hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${isActive 
                  ? 'bg-ink-600/30 text-bright border border-ink-500/30' 
                  : 'text-muted hover:text-white hover:bg-card'}
              `}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {/* Recent Chats */}
          {recentChats.length > 0 && (
            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Recent Chats
              </p>
              {recentChats.map(char => (
                <button
                  key={char.id}
                  onClick={() => { navigate(`/chat/${char.id}`); setMobileOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted hover:text-white hover:bg-card transition-all"
                >
                  <span className="text-lg">{char.avatar}</span>
                  <span className="truncate">{char.name}</span>
                  <ChevronRight size={14} className="ml-auto flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-border">
          <div className="glass rounded-xl p-3 text-xs text-muted">
            <p className="font-semibold text-bright/80 mb-1">✨ CharaVerse</p>
            <p>Powered by Groq · Llama 3 70B · Memory-enhanced AI</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header — hidden on chat page (has its own header) */}
        {!isChatPage && (
          <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-surface flex-shrink-0">
            <button onClick={() => setMobileOpen(true)} className="text-muted hover:text-white">
              <Menu size={22} />
            </button>
            <span className="font-display font-bold glow-text">CharaVerse</span>
          </header>
        )}

        {/* Page content */}
        <main className={`flex-1 overflow-hidden ${isChatPage ? '' : 'pb-16 lg:pb-0'}`}>
          <Outlet />
        </main>

        {/* Bottom Tab Navigation — mobile only, hidden on chat page */}
        {!isChatPage && (
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-lg border-t border-border safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2">
              {navItems.map(({ to, icon: Icon, label, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  className={({ isActive }) => `
                    flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-0
                    ${isActive ? 'text-bright' : 'text-muted'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-ink-600/40' : ''}`}>
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                      </div>
                      <span className="text-[10px] font-medium leading-none">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}
