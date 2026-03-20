# 
PRIMER — AI Agent Super Prompt

> This file provides context for any AI coding assistant working on this codebase.

## Identity

**PRIMER** = Primary Care Simulator. A browser-based medical education game where Indonesian medical students roleplay as a **Puskesmas doctor** in a rural Indonesian village. Built for FK UNAIR, targeting 50 concurrent users.

## Tech Stack

| Layer    | Tech                                    | Notes                     |
| -------- | --------------------------------------- | ------------------------- |
| Frontend | React 19 + Vite 7                       | SPA, lazy-loaded routes   |
| State    | Zustand + persist middleware            | localStorage + cloud sync |
| Styling  | Vanilla CSS + inline styles             | No Tailwind               |
| Backend  | Supabase (PostgreSQL + Auth + Realtime) | Free tier                 |
| Hosting  | Vercel                                  | Auto-deploy from GitHub   |
| Language | JavaScript (no TypeScript)              | JSX components            |

## Architecture Principles

1. **Offline-first**: Game MUST work without Supabase. All cloud calls check `isSupabaseConfigured` first.
2. **Graceful degradation**: If any service fails, log warning and continue — never crash the game.
3. **Zustand is source of truth**: All game state in `useGameStore.js`. Cloud save is a mirror, not primary.
4. **GameContext is the API**: Components use `useGame()` hook, never access store directly.
5. **Free tier only**: No paid services. All limits validated for 50 users.

## Project Structure

```
src/
├── components/        # React UI components
│   ├── LoginPage.jsx          # NIM authentication
│   ├── LeaderboardPanel.jsx   # Real-time rankings
│   ├── MainLayout.jsx         # Game shell with sidebar
│   ├── TimeController.jsx     # Date/time + speed controls
│   └── wilayah/               # Map & public health
├── context/
│   ├── GameContext.jsx     # Unified game state provider
│   ├── AuthContext.jsx     # Authentication state
│   └── ThemeContext.jsx    # Dark/light theme
├── store/
│   ├── useGameStore.js     # ⭐ CORE: 2400-line Zustand store
│   └── selectors.js        # Derived state selectors
├── services/
│   ├── supabaseClient.js   # Supabase singleton + offline check
│   ├── AuthService.js      # NIM→email auth wrapper
│   ├── CloudSaveService.js # Save/load + leaderboard
│   ├── LeaderboardService.js
│   ├── AnalyticsService.js # Buffered event tracking
│   ├── ContentService.js   # Dynamic CMS
│   ├── LLMService.js       # AI proxy (mock/edge function)
│   └── PersistenceService.js  # Dexie.js for medical datasets
├── hooks/
│   ├── useGameLoop.js      # Tick-based game loop
│   └── useCloudSync.js     # Auto cloud save on day change
├── data/
│   ├── CalendarEventDB.js  # Indonesian holidays + events
│   ├── ICD10.js            # ICD-10 codes (4 parts)
│   └── medications*.js     # Drug database
├── content/
│   └── cases/              # 100+ clinical case definitions
├── game/
│   └── ClinicalReasoning.js  # Diagnosis scoring engine
└── pages/                  # Route-level page components
```

## Game Domain

### Core Loop

```
Morning → See Patients → Clinical Decisions → End Day → Score → Next Day
```

### Key Entities

- **Player**: Profile (NIM, name), XP, level, skills, energy, spirit
- **Patients**: Generated from case database, diagnosed via ICD-10
- **Finance**: BPJS capitation, operational budget, procurement
- **Clinical**: Reputation, accreditation (Dasar→Paripurna), referral log
- **Public Health**: Village data (PIS-PK), outbreaks, Posyandu, Prolanis
- **Staff**: Hired healthcare workers with specializations

### Authentication

- Students login with **NIM** (student ID number) + password
- Internally maps to `{NIM}@students.primer-app.com` for Supabase Auth
- Error messages NEVER expose email format to users

## Coding Conventions

### Component Pattern

```jsx
/**
 * @reflection
 * [IDENTITY]: ComponentName
 * [PURPOSE]: What it does
 * [STATE]: Production | Experimental
 * [ANCHOR]: UNIQUE_TAG
 * [DEPENDS_ON]: dependencies
 * [LAST_UPDATE]: YYYY-MM-DD
 */
```

### State Access

```jsx
// ✅ CORRECT — use GameContext
const { day, time, player, navigate } = useGame();

// ❌ WRONG — never access store directly in components
const day = useGameStore(s => s.world.day);
```

### Service Pattern

```javascript
// All services check online status first
if (!isSupabaseConfigured) {
    return { data: null, error: 'Offline mode' };
}
```

## Security Rules

1. **Never expose `service_role` key** in client code — only `anon` key
2. **RLS is mandatory** on all Supabase tables — already configured
3. **API keys go in `.env`** which is gitignored
4. **Error translation** in LoginPage prevents Supabase internals from leaking
5. **No eval()**, no `dangerouslySetInnerHTML` with user input

## Database Schema

5 tables in Supabase, all with RLS:

- `profiles` — linked to auth.users, auto-created on signup
- `game_saves` — multi-slot cloud saves per user
- `leaderboard` — rankings (score, day, reputation, accreditation)
- `analytics` — event tracking for research/triangulation
- `content` — dynamic CMS for cases and announcements

## Known Issues & Active Work

- LLM proxy via Edge Function not yet deployed (using mock mode)
- Bug audit pending (user reported various gameplay bugs)
- Tutorial/onboarding not implemented yet
- Victory condition undefined
