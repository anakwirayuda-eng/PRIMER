# PRIMER — Deployment Dossier & Cloud Security

## 🎮 What is PRIMER?

**PRIMER** (Primary Care Simulator) is a medical education game for Indonesian medical students. Players act as a **Puskesmas doctor** (primary care physician) managing:

- **Clinical**: Diagnose patients, prescribe medications (ICD-10/ICD-9-CM coded)
- **Administrative**: Budget (BPJS capitation), staff hiring, facility upgrades
- **Public Health**: Posyandu, immunization outreach, outbreak response, PIS-PK census
- **Progression**: Accreditation levels (Dasar → Madya → Utama → Paripurna)

**Target Audience**: 50 concurrent FK UNAIR medical students, June 2026
**Tech Stack**: React + Vite + Zustand (frontend), Supabase (backend), Vercel (hosting)
**Budget**: Rp 0 — entirely free tier

---

## 🏗️ Architecture

```
[Student Browser]           [Vercel CDN]           [Supabase (Tokyo)]
     React App  ───────────► Static Files      ◄── Auth + Postgres DB
     Zustand Store            (auto-deploy)         Edge Functions
     localStorage persist     from GitHub            Realtime WS
```

**Offline-first**: Game works 100% without internet. Cloud features (save, leaderboard, analytics) activate only when Supabase is configured.

---

## 🔒 Security Protections

### Already Implemented
| Layer | Protection | Status |
|---|---|---|
| **Auth** | NIM→pseudo-email conversion (students never see email) | ✅ |
| **Database** | Row Level Security on ALL 5 tables | ✅ |
| **RLS: profiles** | Users can only read/update their own profile | ✅ |
| **RLS: game_saves** | Users can only CRUD their own saves | ✅ |
| **RLS: leaderboard** | Everyone reads, only owner writes own entry | ✅ |
| **RLS: analytics** | Users insert own events, only dosen reads all | ✅ |
| **RLS: content** | Read-only for all authenticated users | ✅ |
| **API Keys** | `.env` gitignored, anon key is safe (RLS protects data) | ✅ |
| **Client** | `supabaseClient.js` uses anon key only (no service_role on client) | ✅ |
| **Offline** | Graceful degradation — no crash if Supabase unreachable | ✅ |

### Free Tier Limits (50 students)
| Resource | Limit | Our Usage (est.) | Headroom |
|---|---|---|---|
| DB size | 500 MB | ~50 MB | 10× |
| Auth users | 50K MAU | 50 | 1000× |
| API requests | 500K/month | ~30K | 16× |
| Realtime connections | 200 concurrent | 50 | 4× |
| Edge Functions | 500K invocations | ~5K | 100× |
| Vercel bandwidth | 100 GB/month | ~5 GB | 20× |

### Recommended Before Launch
| # | Action | Priority | Why |
|---|---|---|---|
| 1 | Supabase: Disable "Confirm email" | 🔴 Critical | NIM uses fake emails |
| 2 | Supabase: Enable Rate Limiting in Auth | 🟡 Medium | Prevent brute-force |
| 3 | Vercel: Add password-protect or preview URLs | 🟢 Low | Only for internal testing |
| 4 | Add CORS whitelist in Supabase | 🟢 Low | Restrict API to your domain |

---

## 📁 Key Files Reference

### Backend Services (`src/services/`)
| File | Purpose |
|---|---|
| `supabaseClient.js` | Singleton + offline detection |
| `AuthService.js` | NIM→email auth, signup/signin/signout |
| `CloudSaveService.js` | Multi-slot save/load + leaderboard sync |
| `LeaderboardService.js` | Realtime ranking subscription |
| `AnalyticsService.js` | Buffered event tracking |
| `ContentService.js` | Dynamic CMS with cache |
| `LLMService.js` | Edge Function proxy + local fallback |

### Frontend Integration
| File | Purpose |
|---|---|
| `context/AuthContext.jsx` | Global auth state provider |
| `components/LoginPage.jsx` | NIM login UI |
| `components/LeaderboardPanel.jsx` | Live leaderboard overlay |
| `hooks/useCloudSync.js` | Auto cloud save on day transitions |

### Infrastructure
| File | Purpose |
|---|---|
| `supabase/migrations/001_initial_schema.sql` | 5 tables + RLS + triggers |
| `.env` | Supabase URL + anon key (gitignored) |
| `.env.example` | Template for new developers |

---

## 🚀 Deployment Steps

### 1. Supabase (done)
- [x] Project created: `primer-game` (Tokyo)
- [x] SQL migration executed
- [x] .env configured
- [ ] Confirm email disabled
- [ ] Test registration

### 2. Git (next)
```bash
git add -A
git commit -m "feat: Supabase backend integration (auth, cloud save, leaderboard, analytics)"
git push origin main
```

### 3. Vercel
1. Go to [vercel.com](https://vercel.com) → Import Git Repository
2. Select `anakwirayuda-eng/PRIMER`
3. Framework Preset: **Vite**
4. Environment Variables:
   - `VITE_SUPABASE_URL` = `https://cfabsllhezioylgiwjak.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (your anon key)
5. Click Deploy → get live URL

### 4. Post-Deploy
- Add Vercel URL to Supabase → Authentication → URL Configuration → Site URL
- Test registration on live URL
- Share link with students
