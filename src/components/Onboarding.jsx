import React, { useState } from 'react'
import { Sparkles, MessageSquare, Brain, Wand2, ChevronRight } from 'lucide-react'
import useStore from '../lib/store'

const steps = [
  {
    emoji: '✨',
    title: 'Welcome to CharaVerse',
    subtitle: 'Your AI companion platform',
    description: 'Chat with unique AI characters — each with their own personality, backstory, and story that evolves as you talk.',
    cta: 'Get Started'
  },
  {
    emoji: '🧠',
    title: 'They Remember You',
    subtitle: 'Persistent memory system',
    description: 'Characters automatically learn things about you as you chat — your name, preferences, and experiences. Every conversation gets more personal.',
    cta: 'Nice!'
  },
  {
    emoji: '🎭',
    title: 'Create Your Own',
    subtitle: 'Unlimited characters',
    description: 'Design a character with a unique personality and backstory. Share them via a link so others can chat too.',
    cta: "Let's Go!"
  }
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const setUser = useStore(s => s.setUser)
  const setOnboardingComplete = useStore(s => s.setOnboardingComplete)

  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      if (name.trim()) setUser({ name: name.trim() })
      setOnboardingComplete()
    } else {
      setStep(s => s + 1)
    }
  }

  const current = steps[step]

  return (
    <div className="fixed inset-0 z-[100] bg-void flex items-center justify-center p-6 bg-animated">
      <div className="max-w-sm w-full">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-bright' : i < step ? 'w-4 bg-ink-500' : 'w-4 bg-border'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-6xl mb-6">{current.emoji}</div>

          <div className="inline-flex items-center gap-1.5 bg-ink-600/20 border border-ink-500/30 rounded-full px-3 py-1 mb-4">
            <span className="text-xs text-bright/70 font-medium">{current.subtitle}</span>
          </div>

          <h1 className="font-display font-black text-2xl text-white mb-3">
            {current.title}
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-8">
            {current.description}
          </p>

          {/* Name input on last step */}
          {isLast && (
            <div className="mb-6">
              <input
                type="text"
                placeholder="What's your name? (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-void border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-ink-500 text-sm text-center"
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                autoFocus
              />
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            {current.cta}
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={() => setOnboardingComplete()}
            className="w-full mt-4 text-muted text-sm hover:text-white transition-colors"
          >
            Skip intro
          </button>
        )}
      </div>
    </div>
  )
}
