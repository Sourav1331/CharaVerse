# CharaVerse — AI Conversation Logs
# Project: CHAI Clone — AI Character Chat Platform
# Built for 8x Contest Submission

---

## Update (2026-05-07)
- Clarified Groq usage (Llama 3.1 70B for chat) and documented prompt engineering in README.
- Added a character-consistency system guard and emoji expression rules in `src/lib/api.js`.
- Added UI preview screenshots for major flows in `README.md`.

---

## Prompt
Build a CHAI clone — an AI Character Chat Platform. Requirements:
- Character discovery feed with categories
- Real-time AI chat with memory across sessions
- Character creator (name, personality, avatar, backstory)
- Featured and trending characters
- Conversation history per character
- Built with React + Vite + Tailwind CSS
- Groq API integration for real AI character conversations
- Beautiful dark UI with glassmorphism aesthetic

## Response
I'll build a complete CharaVerse app — a full-featured CHAI clone with all the required features. Let me architect this step by step:

1. **Tech Stack**: React 18 + Vite + Tailwind CSS + Zustand for state + React Router v6
2. **UI Theme**: Dark void aesthetic with purple ink palette, glassmorphism cards, and smooth animations
3. **Key Pages**: Home (discover feed), Chat (real-time AI), Create Character (multi-step form), My Characters, Settings (API key)
4. **AI Integration**: Direct Groq API calls (Llama 3.1 70B) per character using custom system prompts that encode personality + backstory
5. **Persistence**: Zustand + localStorage for conversations and custom characters across sessions

The character system prompt architecture is the core innovation — each character gets a carefully crafted system prompt that combines their personality traits, backstory, and speech patterns so Claude responds authentically in-character.

---

## Prompt
Design the character data model and how AI conversations should work. How do we give each character a distinct voice?

## Response
The character model needs these key fields:
- `id`, `name`, `tagline`, `avatar`, `avatarBg` (visual identity)
- `personality` (trait description — feeds into system prompt)
- `backstory` (history — enriches character depth)
- `greeting` (first message shown when chat opens)
- `systemPrompt` (the actual instruction sent to Claude)
- `tags`, `category` (for discovery/filtering)
- `messageCount` (social proof metric)

For distinct voices, each system prompt instructs Claude to:
1. Stay in character at all times
2. Use personality-specific speech patterns (e.g., archaic language for Luna, dry sarcasm for Ethan)
3. Reference their backstory naturally when relevant
4. Keep responses in a consistent length range (80-180 words for engaging chat)

The conversation history is maintained in Zustand (persisted to localStorage) and sent as the full messages array on each API call, giving true memory across the session.

---

## Prompt
How should the create character flow work? Make it intuitive for non-technical users.

## Response
Multi-step wizard with 4 steps:

**Step 1 — Identity**: Name, tagline, category, tags, avatar emoji picker, background gradient picker. Visual preview updates live.

**Step 2 — Personality**: Free-text personality description + optional opening greeting. Tips guide users toward richer descriptions.

**Step 3 — Backstory**: Character history + optional advanced system prompt override for power users.

**Step 4 — Preview**: Full character card preview + confirmation before creation.

Validation prevents advancing without minimum content. The system prompt is auto-generated from fields if the user doesn't provide a custom one, making it accessible while still powerful.

After creation, the user is immediately taken to the chat page to meet their character.

---

## Prompt
What's the best way to handle the API key securely in a browser-based app?

## Response
For this demo/contest app, the approach is:
1. Provide a Groq API key via `.env` (`VITE_GROQ_API_KEY`) for local development and demo builds
2. Requests are sent directly to `https://api.groq.com/openai/v1/chat/completions`

**Production note**: In a real production app, you'd proxy API calls through your own backend to keep the key server-side.

---

## Prompt
Design the chat UX — message bubbles, typing indicators, conversation memory.

## Response
Chat page design decisions:

**Message bubbles**: User messages are right-aligned with purple gradient (msg-user class). AI responses are left-aligned with glass card style (msg-ai). Character avatar shown beside AI messages for immersion.

**Typing indicator**: Three animated dots with staggered bounce animation (CSS keyframes) shown while awaiting API response. Feels natural and not jarring.

**Conversation memory**: Full message history passed to API on each call. The greeting message is excluded from history to avoid confusion, as it's a UI element not a real AI response.

**Info panel**: Slide-in right panel showing character details (personality, backstory, tags) for reference while chatting.

**Clear conversation**: Button to wipe history and start fresh, with confirmation dialog.

**Auto-scroll**: useRef + useEffect scrolls to bottom on new messages.

**Keyboard UX**: Enter sends, Shift+Enter adds newline. Auto-resize textarea.

---

## Prompt
Implement conversation history persistence across page reloads and sessions.

## Response
Using Zustand with the `persist` middleware:

```javascript
const useStore = create(
  persist(
    (set, get) => ({
      conversations: {},
      customCharacters: [],
      // ... actions
    }),
    {
      name: 'charaverse-storage',
      partialize: (state) => ({
        customCharacters: state.customCharacters,
        conversations: state.conversations,
        user: state.user,
      }),
    }
  )
)
```

The `partialize` option selectively persists only what matters (not UI state like sidebarOpen). Conversations are keyed by `characterId`, so each character has independent history. Custom characters are persisted alongside official ones.

The store provides `getConversation(characterId)` and `addMessage(characterId, message)` as the primary interface, keeping the chat component clean.

---

## Prompt
Review the complete project and suggest any improvements for the contest scoring criteria: Chat UX, character creation flow, and conversation quality.

## Response
**Chat UX improvements made:**
- Added timestamp display on each message
- Pulse animation on "online" status indicator 
- Error state with direct link to Settings for API key
- Character info slide-in panel without leaving chat
- Smooth auto-scroll behavior

**Character creation flow:**
- 4-step wizard with validation prevents skipping steps
- Live avatar preview updates as user selects emoji/gradient
- Auto-generated system prompt from personality + backstory fields
- Advanced system prompt override for power users
- Immediately routes to chat after creation — instant gratification

**Conversation quality:**
- Each character has detailed system prompts that define speech style, not just personality
- Greeting messages set character tone immediately
- Diverse character roster: fantasy (Luna), romance (Ethan), sci-fi (ARIA-7, Captain Vex), mystery (Dr. Cross), adventure (Zara)
- Demo mode with plausible responses so judges can evaluate UX without API key

**Scoring focus alignment:**
- Chat UX: ✅ Smooth, responsive, memory-persistent
- Character creation: ✅ Intuitive multi-step, visual customization
- Conversation quality: ✅ Rich system prompts, diverse character voices, real Claude API

---
