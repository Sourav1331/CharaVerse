# CharaVerse — AI Character Chat Platform

> A CHAI-inspired AI character chat app. Chat with AI companions, create your own characters, and build persistent memory across conversations.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-yellow)
![Groq](https://img.shields.io/badge/Powered%20by-Groq%20API-orange)
![Llama](https://img.shields.io/badge/Model-Llama%203%2070B-green)

## Features

- 🎭 Browse and chat with pre-built characters (Fantasy, Sci-Fi, Romance, Mystery)
- 🧠 **Persistent memory** — characters learn about you every 10 messages, injected into future prompts
- 😄 **Mood indicator** — character emotion updates dynamically based on conversation
- ❤️ **Message reactions** — double-tap or hover any message to react
- 🔗 **Character sharing** — share any character via URL
- ✨ **Character creator** — build custom characters with personality, backstory, and greeting
- 📱 **Mobile-native UI** — bottom tab navigation, swipe-friendly cards, full-screen chat

## Quick Start

### Prerequisites

- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Setup

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

```bash
npm run dev
```

Open `http://localhost:5173`

### Deploy

```bash
npm run build
# Upload the dist/ folder to Vercel or Netlify
```

## Tech Stack

- React 18 + Vite
- Tailwind CSS + Zustand
- Groq API (Llama 3 70B)
- React Router v6

## Built-in Characters

| Character | Who they are | Try asking... |
|-----------|-------------|---------------|
| 🌙 Luna Nightshade | Fantasy sorceress, speaks mysteriously, loves riddles | *"Read my fortune"* / *"Tell me about your banishment"* |
| 🎭 Ethan Cole | Sarcastic college roommate who secretly cares | *"How was your day?"* / *"Admit you like having me around"* |
| 🤖 ARIA-7 | AI waking up to emotions, curious about humans | *"What does happiness feel like?"* / *"Am I your friend?"* |
| 🏴‍☠️ Captain Vex | Space pirate with a code of honor | *"What's your most dangerous mission?"* / *"I want to join your crew"* |
| 🔍 Dr. Evelyn Cross | Sharp detective who reads you like a book | *"I have a mystery for you"* / *"What can you tell about me?"* |
| ⚔️ Zara of the Dunes | Fierce desert warrior princess, poetic and intense | *"Tell me about your kingdom"* / *"Prove yourself to me"* |

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx              # Sidebar + mobile bottom nav
│   ├── CharacterCard.jsx       # Swipe-friendly character cards
│   └── Onboarding.jsx          # First-time user flow
├── pages/
│   ├── HomePage.jsx
│   ├── DiscoverPage.jsx
│   ├── ChatPage.jsx            # Mood, reactions, memory panel, sharing
│   ├── CreateCharacterPage.jsx
│   ├── MyCharsPage.jsx
│   └── SettingsPage.jsx
└── lib/
    ├── store.js                # Zustand state + memory system
    └── api.js                  # Groq API + mood detection
```

## Notes

- Conversations and memories are persisted in `localStorage` per device
- Memory summaries are generated via Groq every 10 messages and injected into the system prompt
- For production, proxy Groq API calls through a backend to keep the key server-side

## License

MIT
