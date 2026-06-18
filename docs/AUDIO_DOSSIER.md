# 📂 DOSSIER: PRIMER Audio System — Konsep, Pengembangan & Open Questions

> **Tujuan**: Briefing lengkap untuk DeepThink / Codex / konsultan audio tentang arah pengembangan sistem audio PRIMER — dari state sekarang, gap, arah desain, struggle, sampai pertanyaan terbuka.
>
> **Date**: 2026-04-23
> **Author**: AG (Dr. Anak Agung Bagus Wirayuda)
> **Target rilis**: Juni 2026 (50 mahasiswa FK UNAIR, sesi kuliah KKM)
> **Pair doc**: [`AUDIO_DESIGN.md`](./AUDIO_DESIGN.md) (decision-level 1-pager)
>
> **Cara pakai dossier ini**: paste keseluruhan ke model thinking (Claude Opus Extended Thinking, DeepSeek R1, Gemini 2.5 Deepthink, dll). Dossier ini self-contained — tidak butuh konteks tambahan dari repo.

---

## 1. Konteks Game (TL;DR untuk yang belum tahu PRIMER)

**PRIMER** = **Pri**mary Care Si**m**ulator — game edukasi kedokteran primer untuk mahasiswa FK Indonesia. Pemain berperan sebagai **dokter Puskesmas** di daerah rural (konteks awal: Bali/NTT/Papua-ish village) dengan 4 dimensi gameplay:

1. **Klinis** — anamnesis, pemeriksaan fisik, diagnosis ICD-10, resep ICD-9-CM, discharge/referral (SISRUTE)
2. **Administratif** — budget BPJS kapitasi, hiring staf, upgrade gedung (PUSTU/FOB/Polindes), akreditasi (Dasar→Madya→Utama→Paripurna)
3. **Kesehatan Masyarakat** — Posyandu, IKM, outbreak response, PIS-PK census, senam prolanis
4. **Personal/Narrative** — Rumah Dinas (rest, customize avatar, keuangan pribadi), Warung Intel (info gathering), Smartphone apps (news, chat, bank, shop)

**Stack**: React + Vite + Zustand + Tailwind, Supabase auth + persist, Vercel hosting. **Budget Rp 0** — semua free tier. **Solo developer** (dokter umum yang belajar coding).

**Timeline**: Phase 4 hardening sekarang (v0.8.5), target rilis Juni 2026 ke 50 mahasiswa konkuren. **Audio belum pernah serius disentuh** — ini pertama kali.

---

## 2. State Audio Saat Ini — Audit

### 2.1 File inti
- **`src/utils/SoundManager.js`** (401 lines) — class dengan FM synthesis (FF8 Junction style) + BGM MP3 playback
- **`public/audio/*.mp3`** — 7 track BGM
- **`src/store/slices/createNavSlice.js:35`** — volume setting hook

### 2.2 SoundManager capabilities

**Synth SFX** (FM synthesis via Web Audio API, glassy/metallic FF8 vibe):
| Method | Deskripsi | Durasi |
|---|---|---|
| `playCursor` | High-pitched blip (1200Hz + 400Hz mod) | 80ms |
| `playConfirm` = `playClick` | Glassy chime 2-tone (880Hz → 1760Hz shimmer) | 400ms |
| `playCancel` | Pitch drop zip (600Hz → 100Hz) | 150ms |
| `playNotification` | C-E-G arpeggio rising | 400ms |
| `playSuccess` | Major chord stab (C-E-G-C) | 600–800ms |
| `playError` | Disharmonic buzzer (150Hz sawtooth, non-integer FM) | 400ms |
| `playEmergency` | Siren sweep 440↔880Hz triangle | 1.2s — **DEFINED TAPI TIDAK PERNAH DIPANGGIL** |

**BGM system**:
- `<audio>` element based MP3 playback, loop: true, volume 0.3
- `playBGM(day)` → `(day - 1) % bgmTracks.length` rotation
- `playRandomBGM()` — random dengan "avoid last 3 replay" memory
- Autoplay block handling: pending BGM triggered on first user interaction
- `pauseBGM` / `resumeFromPause` / `tryResume` / `toggleMute`
- `setVolume(v)` — scales both master SFX (×0.4) & BGM

**Status header**: `[STATE]: Experimental` (line 5 — belum diangkat ke production-ready oleh author sendiri).

### 2.3 BGM track list (P0 — HARUS DIGANTI)

Semua 7 track adalah musik copyrighted Square Enix dari FF8 & Chrono Cross — **tidak boleh rilis** ke publik apalagi institusi akademik (FK UNAIR).

| File | Asal (dugaan) | Copyright holder |
|---|---|---|
| `balamb_garden.mp3` | Final Fantasy VIII — Balamb Garden | Square Enix |
| `blue_fields.mp3` | Final Fantasy VIII — Blue Fields | Square Enix |
| `fishermans_horizon.mp3` | Final Fantasy VIII — Fisherman's Horizon | Square Enix |
| `guldove_home.mp3` | Chrono Cross — Guldove Home World | Square Enix |
| `guldove_another.mp3` | Chrono Cross — Guldove Another World | Square Enix |
| `arni_home.mp3` | Chrono Cross — Arni Home World | Square Enix |
| `arni_another.mp3` | Chrono Cross — Arni Another World | Square Enix |

**Legal exposure**: UNAIR adalah institusi publik. Rilis dengan BGM bajakan = potensi takedown, reputational damage author, mahkota game jadi liability. **Non-negotiable untuk Juni 2026.**

### 2.4 Call-site coverage (existing)

~120 soundManager calls tersebar di 16 file. Yang paling banyak ter-instrument:

| File | Call count | Konteks |
|---|---|---|
| `createPublicHealthSlice.js` | 21 | Outbreak, IKM, Senam, community diagnosis |
| `createClinicalSlice.js` | 13 | Anamnesis, pemeriksaan, diagnosis, discharge |
| `hooks/usePatientEMR.js` | 8 | EMR tab transitions, save/cancel |
| `RumahDinas.jsx` | 8 | Rest actions, customize avatar, personal finance |
| `createFinanceSlice.js` | 4 | Order, receipt, monthly report |
| `createStaffSlice.js` | 3 | Hire/fire |
| `createPlayerSlice.js` | 3 | Level up, achievement |
| (lain-lain) | ~60 | UI clicks global, confirmations, etc. |

**App.jsx:184** punya global click listener untuk SEMUA interactive element → menghasilkan UI click yang pervasive (intentional, FF8 junction UI vibe).

### 2.5 Audio settings UI — TIDAK ADA

Pemain **tidak bisa**:
- Mengatur volume BGM terpisah dari SFX (hanya master)
- Mematikan hanya BGM tapi SFX tetap (atau sebaliknya)
- Memilih "focus mode" untuk sesi belajar panjang
- Melihat track yang sedang diputar
- Toggle accessibility (reduced audio)

Hanya ada `toggleMute` (all-or-nothing) dan `setVolume` (master) yang entah di mana exposed ke UI — belum dikonfirmasi ada slider di settings modal.

---

## 3. Surface Mapping — Apa yang Bisa Dibunyikan

### 3.1 Lokasi / Scene

| Lokasi | File | Vibe yang dicari | Audio status |
|---|---|---|---|
| **Title / Main Menu** | `App.jsx` landing | Hopeful, welcoming | Tidak ada |
| **Rumah Dinas** | `pages/RumahDinas.jsx` | Cozy, personal, rest | 8 SFX call tapi no BGM mapping |
| **Puskesmas Clinical (Layanan)** | `components/ClinicalPage.jsx` | Focused clinical | SFX ada, BGM random per day |
| **IGD (Emergency)** | `components/EmergencyPanel.jsx` | Tense | **Tidak ada tension audio** |
| **Wilayah (peta desa)** | `components/WilayahPage.jsx` | Adventure, rural | SFX ada, BGM random |
| **Posyandu Modal** | `components/PosyanduModal.jsx` | Community uplifting | Inherit generic |
| **Warung Intel** | `components/WarungIntel*.jsx` | Social, casual | Inherit generic |
| **Gedung (Facility Mgmt)** | `components/GedungPage.jsx` | Admin | Inherit generic |
| **Staff (SDM)** | `components/StaffPage.jsx` | Admin | Inherit generic |
| **Inventory/Logistik** | `components/InventoryPage.jsx` | Admin | Inherit generic |
| **Diklat (Training)** | `components/DiklatPage.jsx` | Study | Inherit generic |
| **Arsip (Archive)** | `components/ArsipPage.jsx` | Quiet, library | Inherit generic |
| **Kantor Desa (Sensus)** | `components/sensus/SensusPage.jsx` | Community admin | Inherit generic |
| **Smartphone Apps** | `components/Smartphone.jsx` + apps | UI-in-UI | Inherit generic |

### 3.2 Major player actions

**Clinical** (13 call sites):
- Anamnesis, Pemeriksaan, Diagnosis → `playConfirm`
- Correct/wrong diagnosis → `playSuccess` / `playError`
- Prescription sign → `playSuccess`
- Discharge, Referral → `playSuccess`/`playError`
- New patient arrival, emergency arrival → `playNotification`

**Public Health** (21 call sites):
- Community diagnosis → `playSuccess`/`playError`
- IKM event → `playSuccess`/`playError` (banyak variant)
- Senam Prolanis → `playSuccess`
- Outbreak intervention → `playSuccess`/`playConfirm`
- Outbreak detected → `playError` (harusnya `playEmergency`!)

**Management**:
- Hire staff → `playSuccess`
- Fire staff → `playConfirm`
- Order supplies → `playConfirm` → `playSuccess` saat receive
- Monthly report → `playNotification`

**Travel**:
- Enter/exit Rumah Dinas → `playClick`
- Bridge outage, wilayah transitions → **TIDAK ADA**

### 3.3 Game events / state transitions

**Day cycle**:
- Morning briefing modal → generic open
- Time tick → `playClick` per ~5-min game time
- End-of-day modal → generic open
- Day transition dengan outbreak spawn → `playError`

**Patient events**:
- New patient → `playNotification` ✅
- Emergency patient → `playNotification` (harusnya lebih urgent)
- **Patient deterioration worsening** → TIDAK ADA
- **Patient death (deterioration ≥100)** → TIDAK ADA ❌ P0

**Progression**:
- Level up → `playSuccess` / `playError` jika gagal
- Achievement → `playSuccess`
- Outbreak resolved → `playSuccess`

**Critical game state**:
- Game over (burnout/collapse) → **TIDAK ADA** ❌
- Autosave failure → **TIDAK ADA** ❌
- Runtime trap / game halt → **TIDAK ADA** ❌
- Bridge outage active → **TIDAK ADA**

### 3.4 Missing audio — PRIORITY MATRIX

#### 🔴 P0 — Harus ada sebelum rilis (safety/clarity)
1. **Patient death** audio cue (`EmergencyPanel.jsx` deterioration ≥100)
2. **Allergy/contraindication violation** (nyambung ke clinical integrity P0 risk — memory kita menandai ini sebagai safety gap kritis)
3. **Autosave failure** (player bisa kehilangan progress tanpa sadar)
4. **Runtime trap / freeze protocol** (saat ini UI freeze tanpa feedback)
5. **Game over** (narrative moment yang hilang)

#### 🟠 P1 — Enhance narrative feel
6. Pause/resume feedback
7. Outbreak escalation (beda SFX berdasarkan severity)
8. Supply delay vs. on-time arrival (saat ini sama saja)
9. Bridge outage active warning
10. Low liquidity / bankruptcy imminent

#### 🟡 P2 — Polish & immersion
11. Night cycle ambient shift (>23:00 game time)
12. Facility upgrade completion fanfare
13. Achievement progress milestone (50%, 90%)
14. Reputation threshold crossing (±50 milestones)

#### 🟢 P3 — Nice to have
15. Tooltip hover subtle ping
16. Season/weather ambient layer
17. Modal loading complete chime
18. Quest milestone audio progression

---

## 4. Proposed Direction — "Warm Acoustic + Indonesian Folk Accent"

### 4.1 Mengapa arah ini

**Constraint yang dikontak**:
1. **Audiens**: mahasiswa FK umur 19–24, sesi belajar 1–2 jam — audio harus **tidak melelahkan**, bukan chiptune yang energetic terus-menerus
2. **Setting game**: Indonesia rural (Bali/NTT/Papua-ish village, Puskesmas, Posyandu) — **identitas lokal** penting biar bukan "JRPG generic"
3. **Edukasi serius**: topik klinis (kematian pasien, outbreak) — audio harus **respectful**, bukan cartoon goofy
4. **Solo dev + Rp 0 budget**: harus bisa di-source dari royalty-free, **tidak bisa commission awal**
5. **Existing SoundManager**: FM synth UI SFX sudah solid — **jangan rombak ulang**, cukup tambah lapis

**Pilihan yang dipertimbangkan**:

| Opsi | Pro | Con | Skor |
|---|---|---|---|
| A. Lofi study + piano | Cepat, netral, banyak RF | Generic, hilang identitas PRIMER | 6/10 |
| B. Indonesian folk hybrid (acoustic base + gamelan accent) | Khas, respectful, available di RF | Butuh kurasi lebih teliti | **8/10** ✅ |
| C. Full gamelan autentik | Sangat autentik, signature | Butuh commission, 2–4 minggu, Rp 3–5jt | 7/10 — untuk V2 |
| D. Pertahankan JRPG FM style | Minimal rework, existing fit | Hilang peluang identitas lokal | 5/10 |
| E. Chiptune / 8-bit retro | Murah, viral potential | Tidak fit tone edukasi serius | 3/10 |

### 4.2 Aesthetic anchors

- **Mood referensi**: Stardew Valley (cozy), Journey (transcendent), Florence (intimate)
- **Instrumen** priority order:
  1. Piano akustik (base warmth)
  2. Strings pad mellow (sustain mood)
  3. Gitar nylon (personal scenes)
  4. Suling bambu (Indonesian accent — travel/adventure)
  5. Sape (Dayak, atmospheric) — optional
  6. Kendang ringan (rhythm sparse)
  7. Gamelan ambient (event-specific only — level up, day start)

### 4.3 BGM mapping (full table)

| Trigger | Vibe | Durasi | Ref mood |
|---|---|---|---|
| Title | Hopeful sunrise | 2m | Journey opening |
| Rumah Dinas | Cozy evening | 3m | Stardew home |
| Puskesmas (normal day) | Focused calm | 3m | Persona slice-of-life |
| Puskesmas (outbreak) | Tense undercurrent | 2m | Persona tension |
| Wilayah peta | Adventure travel | 3m | Ghibli travel |
| Warung Intel | Social lofi | 2m | Coffee shop |
| Posyandu/Senam | Uplifting folk | 2m | Community |
| Night shift | Sparse piano | 3m | Night ambient |
| Emergency active | Heartbeat drone | 1m | Short tension |
| Outbreak active | Low strings unease | 2m | Escalation |
| Game over | Somber solo piano | 1m one-shot | Reflective |
| Victory/Akreditasi | Folk fanfare | 10s stinger | One-shot |

**Total**: 10–12 track, target <20 MB bundle total (128 kbps MP3, looping efficient).

### 4.4 SFX tambahan (beyond existing FM synth)

| Nama | Trigger | Sound direction |
|---|---|---|
| `playDoorOpen` | Masuk lokasi | Short folk stinger 0.5s |
| `playDayStart` | Morning briefing | Ayam berkokok + suling |
| `playDayEnd` | EoD modal | Adzan maghrib distant sample |
| `playLevelUp` | Level/akreditasi naik | Gamelan glissando up |
| `playAllergyAlert` | **P0** allergy violation | Harsh buzz + optional voice |
| `playPatientDeath` | Deterioration ≥100 | Flatline + low drone |
| `playBridgeOutage` | Bridge putus | Wood crack + splash |
| `playAutosaveFail` | Supabase save fail | Distorted error |
| `playQuestComplete` | Quest 100% | Gentle chime up |
| `playHoverInfo` | Tooltip critical | Very subtle tick |

---

## 5. Pengembangan — Development Plan

### 5.1 Phased rollout (~4 minggu realistic effort, part-time solo)

**Phase 1 (Week 1) — Legal cleanup** 🔴 P0
- Audit & rip 7 BGM copyrighted dari repo
- Source 3 BGM pengganti esensial (Rumah, Puskesmas, Wilayah)
- Update `bgmTracks` array
- Smoke test autoplay/loop di Chrome & Firefox

**Phase 2 (Week 1–2) — Safety audio wiring** 🔴 P0
- Wire `playEmergency` ke outbreak & patient death
- Implement `playAllergyAlert` + integrate ke clinical allergy gate (dependency: allergy gate itself masih P0 pending)
- Wire `playError` ke autosave failure + `dispatchGuard.js` freeze protocol
- Audio cue untuk bridge outage

**Phase 3 (Week 2–3) — Contextual BGM**
- Refactor `playBGM(day)` → `playBGM({ location, state })`
- Tambah 4 BGM lokasi sisanya
- Implement crossfade 2-detik antar track
- Location-change hook di nav slice

**Phase 4 (Week 3–4) — Polish & SFX**
- Door-open stinger per lokasi
- Day start/end SFX
- Settings UI: 3-slider (Master/BGM/SFX) + Focus Mode toggle
- Audio accessibility: reduced motion respect, visual parallel untuk safety cue

**Phase 5 (Week 4+) — Playtest**
- Device test: desktop FK, laptop mahasiswa, low-spec Android browser
- Volume balance iteration
- Measure: audio bundle size, load time, memory usage

### 5.2 Effort estimation (jam kerja)

| Task | Jam estimasi |
|---|---|
| Sourcing + kurasi 10 BGM track | 8–12 |
| Sourcing + kurasi 10 SFX baru | 4–6 |
| Refactor playBGM ke context-aware | 4 |
| Crossfade implementation | 3 |
| Wire safety audio P0 (5 event) | 3 |
| Settings UI | 4 |
| Audio accessibility pass | 2 |
| Playtest + iteration | 6–10 |
| **Total** | **34–45 jam** |

Realistic untuk solo dev part-time: 3–4 minggu sambil kerja tugas lain.

---

## 6. Struggles & Risiko

### 6.1 Teknis

1. **Autoplay policy browser** — Chrome/Safari blok autoplay sampai user interaction. Sudah di-handle via `pendingBGMDay` + `resumeBGM` on click, tapi fragile — perlu test berbagai skenario (fresh tab, background tab, tab switch).

2. **Web Audio context suspension** — Context ter-suspend saat tab blur di beberapa browser. Existing code ada `this.context.resume().catch(() => {})` tapi silent failure; perlu monitoring.

3. **Mobile browser inconsistency** — Safari iOS sangat strict soal audio. Target awal kita desktop tapi mahasiswa mungkin akses dari Android Chrome; perlu tes.

4. **Bundle size vs. quality** — 128 kbps MP3 × 12 track ≈ 15–20 MB. Di koneksi kampus UNAIR (kadang lambat), 20 MB first load bisa > 10 detik. **Pertimbangan**: lazy-load BGM lokasi non-default, atau pakai OGG (lebih kecil 30%).

5. **BGM cross-fade** — kalau pakai HTMLAudioElement biasa, crossfade butuh 2 instance audio + GainNode. Eksisting code single `bgmAudio` — perlu refactor.

6. **Memory leak potential** — Existing `stopBGM` set `src = ''` untuk release, tapi `lastPlayedIndices` growing (sudah di-shift >3 tapi cek lagi).

7. **State `experimental`** — header SoundManager mark diri sebagai experimental. Banyak edge case belum dihandle (rapid play/stop, concurrent playBGM calls — ada `isLoading` lock tapi kurang robust).

### 6.2 Desain / UX

1. **Audio fatigue** — FF8 junction click UI berisik kalau dipakai 2 jam belajar. Mahasiswa kemungkinan mute, ironis jadi sia-sia investment.

2. **Cultural appropriation risk** — Pakai gamelan Bali untuk scene Papua tidak fit. Harus riset mana instrumen yang generic "Indonesian" (suling bambu, kendang) vs. yang region-specific (sape = Dayak, gamelan Jawa/Bali = spesifik).

3. **Tone mismatch** — Upbeat folk untuk scene kematian pasien akan terasa insensitive. Audio cue untuk critical clinical event perlu khusus, tidak sekadar reuse existing.

4. **Accessibility vs. immersion** — Pemain dengan hearing impairment perlu visual parallel untuk semua audio cue penting. Tapi kalau visual juga berisik, full sensory overload.

5. **Volume normalization** — Track dari sumber berbeda akan beda loudness. Perlu LUFS normalization (-18 LUFS target integrated) agar konsisten.

### 6.3 Legal / Licensing

1. **CC-BY requirement** — Kevin MacLeod & banyak sumber OpenGameArt wajib credit. Perlu credits screen di game + LICENSE.md update.

2. **"Royalty-free" tidak selalu free** — Pixabay free, tapi baca ToS terkini (berubah). Epidemic Sound, Artlist butuh subscription. Hindari yang butuh license per-project.

3. **Derivative work** — Kalau edit/remix track RF, cek apakah license allow (most CC-BY yes, some NC/ND no).

4. **Commercial vs. non-commercial** — PRIMER gratis, tapi distribusi ke institusi akademik masih "publik". Amankan hanya pakai CC0/CC-BY/public domain (hindari NC).

5. **AI-generated music (Suno/Udio)** — ToS commercial use berubah cepat. Saat ini unclear kalau output bisa dipakai komersial vs. non-commercial. Risk: kalau ToS retro-apply, output jadi unusable.

6. **Adzan sample** — religious sound. Butuh hati-hati — banyak mahasiswa muslim, tapi juga non-muslim (FK UNAIR multi-agama). Pertimbangan: pakai suling/gamelan netral untuk day-end cue, bukan adzan.

### 6.4 Organisasi & kapasitas

1. **Solo dev burnout** — audio bukan core skill author (dokter umum). Risk: effort 40 jam overrun jadi 80 jam karena learning curve.

2. **Feedback loop terbatas** — playtest hanya 50 mahasiswa Juni 2026. Iterasi post-launch susah.

3. **Dokumentasi drift** — memory kita sudah menandai PRIMER punya BIBLE/AGENT_CONTEXT drift (Vanilla CSS claim padahal Tailwind). Kalau audio sistem tidak didokumentasikan dengan baik, drift sama bisa berulang.

---

## 7. Open Questions untuk DeepThink

### 7.1 Tentang identitas audio

1. **Regional specificity vs. pan-Indonesian**: PRIMER punya setting rural Indonesia tapi tidak specific region. Apakah pakai pan-Indonesian palette (suling bambu + kendang ringan, hindari Bali-spesifik/Jawa-spesifik) lebih aman, ATAU bikin variant per region yang nanti ter-unlock saat campaign progression?

2. **Leitmotif untuk main characters**: PRIMER punya NPC besar (pemain sendiri sebagai dokter, staff, tokoh desa). Worth investasi leitmotif per character, atau cukup theme per lokasi?

3. **Dynamic music layers** (ala Red Dead / Hollow Knight — add/remove instrument layers based on state): terlalu ambisius untuk solo dev? Atau feasible dengan Web Audio API GainNode manipulation?

4. **Audio untuk "feel dokter"**: bagaimana musik bisa bikin pemain *merasa* seperti dokter (weight, responsibility, care)? Referensi non-game (medical drama soundtrack, Grey's Anatomy, dsb) apakah worth menjadi mood anchor?

5. **Silence as design**: apakah ada scene yang justru harus **silent** (patient death moment, game over)? Silence is audio.

### 7.2 Tentang scope & prioritas

6. **"Feel" vs. "info"**: kalau budget audio terbatas, pilih: banyak SFX info (setiap UI action punya feedback) ATAU few tapi memorable theme music (hanya 3-5 BGM tapi kuat)? Mana lebih impactful untuk edukasi?

7. **Tiered audio (reduced, standard, full)**: worth bikin 3 tier — reduced (SFX only, no BGM), standard (default), full (+ ambient layers)? Atau over-engineering untuk 50 user playtest?

8. **Localization audio** (bahasa Indonesia voice-over untuk tutorial): feasible untuk Juni 2026? Atau V2 initiative?

9. **SFX untuk informasi klinis** (misal: heartbeat rate audio yang reflect patient vital signs) — edukatif banget, tapi butuh engine lebih kompleks. Worth eksplorasi?

10. **Procedural audio** (generate BGM on-the-fly via Tone.js/Web Audio): eksperimental, tapi bisa infinite BGM tanpa file size. Feasible?

### 7.3 Tentang implementasi

11. **HTMLAudio vs. Web Audio API buffer**: existing pakai `new Audio(trackPath)`. Untuk crossfade perlu switch ke AudioBuffer + BufferSourceNode. Kapan cost-benefit refactor worth it?

12. **Format: MP3 vs. OGG vs. AAC**: MP3 universal compatibility. OGG lebih kecil tapi Safari dulu tidak support (sudah support di Safari 15+). AAC bagus tapi licensing concerns. Mana untuk 2026?

13. **CDN strategi**: audio di-host di `public/audio/` (Vercel CDN). Worth pindah ke Supabase Storage atau tetap di Vercel? (Supabase Storage free tier 1 GB.)

14. **Preload strategy**: preload semua BGM di init (fast in-game transitions tapi slow initial load), atau lazy load per lokasi (slow first visit tapi fast initial)?

15. **Service Worker caching**: worth set up SW untuk cache audio offline? PRIMER sudah offline-first, jadi audio juga harusnya ikut.

### 7.4 Tentang edukasi medical

16. **Audio sebagai clinical cue**: bisakah audio design reinforce learning objective? Misal: error sound spesifik untuk "allergy violation" jadi memorable pattern yang nempel di memori mahasiswa. Ada literature medical education pakai audio mnemonic?

17. **Soundscape realism vs. gamification**: Puskesmas real ada suara anak nangis, nurse call, printer. Realisme bikin immersive tapi juga distracting saat belajar. Balance?

18. **Kasus etis**: saat pasien meninggal in-game, audio design harus respectful tapi bukan trigger untuk mahasiswa yang punya trauma personal (banyak mahasiswa FK pernah lihat kematian). Bagaimana desain audio yang aware konteks ini?

19. **Audio feedback untuk critical safety** (allergy, salah dosis, kontraindikasi): seberapa "loud" dan "annoying" harus dibikin? Terlalu subtle → miss. Terlalu loud → desensitisasi. Ada UX research audio medical app?

20. **Inclusive audio untuk mahasiswa tuli**: PRIMER target 50 mahasiswa. Kemungkinan 0–1 punya hearing impairment. Apakah visual parallel untuk semua audio cue cukup, atau ada consideration lain?

### 7.5 Tentang risiko & sustainability

21. **Maintenance audio lib**: kalau nanti game diupdate, trackar rusak atau license RF berubah — bagaimana process refresh audio tanpa harus audit ulang semua?

22. **Fallback gracefully**: kalau Web Audio API tidak tersedia (older browser, accessibility tool), game harus tetap playable. Existing code ada `console.error` saja — perlu strategy lebih matang?

23. **A/B test audio**: worth setup analytics untuk compare session length / completion rate dengan vs. tanpa audio on? Atau overkill?

24. **Post-launch iteration**: setelah 50 mahasiswa play test, bagaimana struktur feedback collection untuk audio specifically (questionnaire, session recording, in-game rating)?

25. **Audio sebagai brand**: PRIMER akan jadi brand edukasi (kemungkinan lanjut ke V2, V3). Audio identity sekarang jadi foundation. Berapa banyak resource investasi sekarang vs. tunggu product-market fit?

---

## 8. Potensi — Eksplorasi Ambisius

### 8.1 Short-term potential (Phase 2, setelah P0 safety)

- **Breathing BGM** — layer tambahan yang pulse ke heart rate pasien kritis (saat di IGD)
- **Weather audio layer** — hujan/angin di wilayah saat musim hujan (ada seasonal state)
- **Crowd murmur ambient** — Posyandu & Senam scene dapat suara kerumunan pelan
- **Typing/writing SFX** untuk EMR — reinforce "ini pencatatan medis serius"
- **Drumroll** saat monthly report processing (dramatize financial outcome)

### 8.2 Mid-term potential (V0.9 — pre-release)

- **Adaptive BGM per stress level** — BGM jadi tense saat >3 patient di queue atau >2 outbreak aktif
- **Voice-over tutorial bahasa Indonesia** — panduan pertama kali main
- **Hint audio system** — subtle cue saat pemain stuck (ada elemen UI yang harusnya dicek)
- **Audio diary mode** — saat Rumah Dinas, pemain bisa "dengar" journal entry sebagai narrative
- **Dynamic mixing** — reduce BGM volume otomatis saat SFX penting main (ducking)

### 8.3 Long-term potential (V1.0+)

- **Interactive audio puzzle** — mini-game diagnosis berdasarkan suara (auscultation practice!)
  - Pemain diminta identify heart murmur, lung wheeze, bowel sound
  - Huge educational value untuk auscultation skill
  - Butuh licensed medical audio library (Thinklabs, Littmann samples — banyak yang CC)
- **Procedural village soundscape** — setiap wilayah generate ambient unik berdasarkan population density, season, time
- **Community composer collaboration** — open call mahasiswa FK atau musisi lokal contribute track
- **Spatial audio** (WebXR) — kalau nanti PRIMER expand ke VR untuk mannequin practice
- **Voice AI untuk NPC dialog** — tapi careful soal bias & edukasi medis

### 8.4 Moonshot (kalau nanti funded)

- **Orchestral commission** — komposer Indonesia (Tohpati, Dwiki Dharmawan?) untuk main theme
- **Soundtrack album release** — bandcamp, jadi marketing tool
- **Audio research paper** — publish "audio design for medical education games" ke jurnal
- **Open-source audio framework** — extract PRIMER audio system jadi library untuk game edukasi lain

---

## 9. Technical Considerations — Deep Dive

### 9.1 Web Audio API architecture current

```
masterGain (0.4)
    ↓
context.destination
```

FM synth nodes created per-call, garbage collected setelah stop. BGM pakai separate `<audio>` element, tidak routed through Web Audio graph.

### 9.2 Architecture target

```
context.destination
    ↑
masterGain
    ↑ ↑
SFXGain  BGMGain
  ↑        ↑ (crossfade)
  FM nodes BGM AudioBuffer A / B
           + AmbientLayerGain (optional)
```

Ini support:
- Independent volume per channel
- Ducking (reduce BGM saat SFX penting)
- Crossfade 2 BGM
- Ambient layer additive

### 9.3 Audio accessibility checklist

- [ ] `prefers-reduced-motion` → reduce audio intensity
- [ ] Visual parallel untuk semua critical SFX (flash + toast + sound)
- [ ] Subtitles untuk voice audio (jika ada)
- [ ] Mute toggle persistent di UI
- [ ] Tidak ada audio-only critical info (semua info juga accessible visual/text)

### 9.4 Performance budget

| Metric | Target | Rasional |
|---|---|---|
| Total audio bundle | <20 MB | Load time di 4G <3s |
| Initial preload | <5 MB | 3 BGM esensial + critical SFX |
| Memory footprint | <30 MB at runtime | Termasuk decoded buffers |
| Crossfade latency | <50ms | Perceived as smooth |
| SFX latency | <20ms | Perceived as responsive |

### 9.5 Testing matrix

| Browser / Device | Priority |
|---|---|
| Chrome desktop (latest) | P0 |
| Firefox desktop | P0 |
| Safari desktop | P1 |
| Chrome Android | P1 |
| Safari iOS | P2 |
| Edge | P2 |

---

## 10. Success Metrics — Cara mengukur audio "worth it"

### 10.1 Quantitative (playtest)

- **Session length**: rata-rata session dengan audio ON vs. OFF (target: ≥20% longer with audio)
- **Mute rate**: berapa % mahasiswa yang mute dalam 10 menit pertama (target: <20%)
- **Action completion time**: time-to-diagnose, time-to-discharge (audio feedback = faster?)
- **Error rate post-allergy-alert**: seharusnya turun setelah satu kali experience audio cue

### 10.2 Qualitative (survey post-playtest)

- Apakah audio menambah immersion? (Likert 1-5, target mean ≥4.0)
- Ada audio yang mengganggu? (free-text, target <10% complain about specific track)
- Audio mana yang paling memorable? (identify hooks yang kerja)
- Apakah audio membantu learning? (khusus safety audio — allergy alert, patient death)

### 10.3 Technical

- Audio bundle size actual vs. target
- Load time first audio (P50, P95)
- Audio-related JS errors (console log in analytics)
- Browser compat issues per-device

---

## 11. Appendix — Source of Truth Links

- **Game design bible**: `docs/GAME_DESIGN_LOG.md`
- **Architecture log**: `docs/ART_DIRECTION_BIBLE.md` (art, separate)
- **Deployment**: `docs/DEPLOYMENT_DOSSIER.md`
- **Clinical risks**: `docs/CLINICAL_LOG.md` + memory `project_primer_clinical_risks.md`
- **Existing audio code**: `src/utils/SoundManager.js` (state: experimental)
- **BGM files to replace**: `public/audio/*.mp3` (7 files, all copyrighted)

---

## 12. Meta — Request ke DeepThink

**Pertanyaan utama untuk model thinking**:

> "Saya solo dev (dokter umum) ngembangin game edukasi FK PRIMER, target rilis Juni 2026 ke 50 mahasiswa. Audio belum pernah disentuh serius — BGM existing semua bajakan Square Enix (P0 legal risk). Saya usulkan arah 'warm acoustic + Indonesian folk accent' dengan 10-12 BGM royalty-free dan 10 SFX baru, dikerjain dalam 4 minggu part-time.
>
> Pertanyaan:
> 1. Apakah arah audio ini realistic untuk solo dev part-time dengan constraint di atas?
> 2. Trade-off mana yang saya miss? Red flags apa yang belum kebahas?
> 3. Prioritas P0-P3 saya sudah tepat? Ada yang harusnya digeser?
> 4. Dari 25 open questions di section 7, mana yang paling worth investigate serius sekarang vs. defer?
> 5. Dari section 8 potential, mana yang under-rated (harusnya dipercepat) vs. over-rated (skip aja)?
> 6. Ada alternative approach yang belum kepikir sama sekali?
> 7. Untuk 'feel dokter' — apa sih yang bikin audio game medical berbeda dari audio game pada umumnya? Ada referensi/riset?
> 8. Apa framework decision-making untuk milih between 'leitmotif-heavy cinematic' vs. 'ambient minimalist' vs. 'retro gamified' — mana fit untuk edukasi serious?
>
> Kasih feedback sekeras mungkin. Saya lebih rugi kalau ketemu red flag di Juli 2026 daripada sekarang."

---

**END OF DOSSIER** — siap di-paste ke model thinking mana pun.

---

## 13. DeepThink Review & Revision (2026-04-24)

Dossier § 1–12 dikirim ke model thinking (Gemini DeepThink). Response berikut: revisi ADOPT, DEFER, dan audit finding. [`AUDIO_DESIGN.md`](./AUDIO_DESIGN.md) sudah di-revisi ke v0.2 berdasarkan ini.

### 13.1 Adopted — major scope changes

| Original (v0.1 dossier) | Revised (v0.2 design) |
|---|---|
| 10-12 BGM track palette | **3-4 ambient soundscape** (Menu, Wilayah, Puskesmas, opsional Outbreak) |
| Indonesian folk melody hybrid | **Freesound.org CC0 ambient soundscape** — zero appropriation, alpha-wave friendly |
| AudioBuffer refactor untuk crossfade | **SKIP** — RAM bomb risk (OOM crash di laptop/HP low-spec) |
| Manual Web Audio handling | **Howler.js (~9 KB, MIT)** — handle autoplay/iOS/crossfade/fade |
| Adzan maghrib sample untuk day-end | **Netral** (distant dog bark, crickets fade) — hindari religious asymmetry |
| Piano sedih untuk patient death | **Respectful Silence + 800Hz flatline 3s + total silence 3s** — shock factor edukatif |
| Generic `playAllergyAlert` | **IEC 60601-1-8 alarm pattern** — medical authority anchor |
| Global click pakai `playClick` (400ms shimmer) | **Scope down + swap ke `playCursor` (80ms)** — hapus `.cursor-pointer` catch-all |
| Autosave fail → audio cue | **Visual banner merah** — audio hanya untuk in-game clinical, bukan system state |
| Settings UI di Phase 4 polish | **P0 (parasut rilis)** — slider + mute + focus mode wajib |

### 13.2 Baru — Diegetic Clinical UI

Konsep yang tidak ada di v0.1: **SFX dunia nyata kerja dokter** menggantikan FM synth shimmer untuk action klinis:

- Paper rustle saat buka tab EMR
- Pen scratch saat tulis anamnesis/resep
- Stamp confirm saat prescription signed
- Monitor beep untuk vital signs
- Stethoscope contact saat pemeriksaan

Tujuan: *tactile feedback* — pemain merasa "keputusan medis dikunci secara legal", bukan sekadar click tombol game. Ini reinforce learning objective bahwa rekam medis = dokumen legal.

### 13.3 Baru — Ducking (Tunnel Vision Hack)

Saat EMR panel terbuka → BGM volume turun 50% otomatis. Close → restore. Simulasi psikologis fokus ekstrem dokter menelaah kasus. Implementation murah via Howler `sound.fade()`.

### 13.4 Audit — `App.jsx:172-188` global click listener

**Finding (2026-04-24)**: listener match `BUTTON`, `A`, `[role="button"]`, dan `.cursor-pointer`. Karena PRIMER fully-Tailwind dengan `.cursor-pointer` universal untuk clickable element, listener ini fires di setiap card, icon, tab, badge, chip — pervasive.

**Rekomendasi** (bukan "kill total" seperti DeepThink saran awal):
- Hapus `.cursor-pointer` match
- Swap `playClick` → `playCursor` (80ms tick, bukan 400ms shimmer)
- Keep semantic match: `BUTTON`, `A`, `[role="button"]`

**Status**: finding disampaikan, perubahan kode pending user decision.

### 13.5 DEFER ke V2 (confirmed over-engineered untuk Juni 2026)

| Feature | Alasan defer |
|---|---|
| Regional specificity (Bali/Papua variant) | Pan-Indonesian generic cukup; regional = scope creep |
| Dynamic music layers (Red Dead style) | Kompleks di JS murni, CPU cost, rentan out-of-sync |
| Voice-over tutorial bahasa Indonesia | Butuh studio/script/actor — post-launch |
| Procedural audio generation | Eksperimental; 50 mahasiswa bukan audience eksperimen |
| Adaptive BGM per stress level | Sinkronisasi tempo dengan antrean IGD = rentan bug |
| Breathing / heartbeat BGM | Kompleks, low ROI untuk playtest Juni |

### 13.6 UNDER-RATED — reservasi slot V2

**🌟 Interactive Audio Puzzle — Auskultasi**

DeepThink menandai ini sebagai **KILLER FEATURE** untuk V2. Mini-game diagnosis dengan stetoskop in-game:
- Identify heart murmur (systolic vs diastolic, regurg vs stenosis)
- Identify lung sounds (wheeze vs rhonchi vs crackles)
- Identify bowel sound (absent vs hyperactive)

Dampak potensial: PRIMER berubah dari "game manajemen Puskesmas" → **"Simulator Klinis Mutlak"**. Dosen FK akan terkagum. Source: Thinklabs, 3M Littmann sample library — banyak CC-licensed untuk pendidikan.

**Action item V2**: reservasi slot di roadmap post-Juni 2026, riset audio library legal clearance sekarang.

### 13.7 Survival Action Plan (v0.2 eksekusi)

**Sudah dieksekusi (2026-04-24)**:
- ✅ `git rm` 7 BGM bajakan Square Enix
- ✅ `bgmTracks = []` + guard di `playBGM` / `playRandomBGM`
- ✅ Audit global click listener — finding didokumentasikan

**Pending user approve**:
- ⏳ Scope down global click listener (hapus `.cursor-pointer` match + swap ke `playCursor`)
- ⏳ Install howler.js
- ⏳ Build Settings UI (3-slider + focus mode)

**Week 2 P0**:
- IEC 60601-1-8 allergy alarm
- Respectful Silence + flatline untuk patient death
- Diegetic EMR SFX

**Week 3-4**: Ducking, polish, extreme Safari iOS test.

### 13.8 Open questions yang masih relevan (dari § 7)

Kebanyakan sudah di-deprioritize oleh DeepThink. Sisa worth investigate:

- **Q16** — Audio sebagai clinical mnemonic; ada literature medical education pakai audio?
- **Q18** — Respectful audio untuk pasien meninggal — **terjawab**: silence is audio
- **Q19** — Balance allergy alarm (loud untuk register, tidak desensitize) — **IEC standard menjawab**
- **Q24** — Feedback collection post-playtest — worth in-game rating pop-up setelah sesi 1 jam

### 13.9 Red flags masih pending

1. **iOS Safari audio unlock** — paling agresif mute. Howler handle 90%, tapi perlu explicit user-gesture trigger. Test priority P0.
2. **Kampus UNAIR bandwidth** — 4G kadang lambat. Soundscape approach target <10 MB, verify di playtest device.
3. **Allergy gate itself belum ada** — audio cue allergy tidak bisa test sampai gate P0 klinis diimplementasi (dependency cross-initiative dengan `project_primer_clinical_risks.md`).
4. **Credits screen** — kalau pakai Kevin MacLeod atau CC-BY tracks, wajib credit. Belum ada Credits UI di PRIMER → tambahkan di Phase 4.

### 13.10 Kutipan DeepThink (preserved verbatim)

> "Anda membangun fondasi yang menakjubkan, Dok. Lindungi diri Anda dari *scope creep* dan *over-engineering* di wilayah Audio ini. *Ship it!*"

Internalisasi: **ship working minimum > ambitious incomplete**. Scope 3-4 track + safety audio + settings UI > 12 track + everything.

---

**END OF REVISION** — v0.2 berlaku per 2026-04-24.

---

## 14. Post-Implementation Deep Research & Next-Wave Roadmap (2026-06-18)

> Konteks: Phase 1-3 + Howler refactor + safety wiring + WebP **sudah landed** (PR #3, 15 commits). BGM demo (gamelan Jawa placeholder) sudah diverifikasi jalan live. Rilis Juni **dibatalkan → target ~September 2026** (runway ~3 bulan lebih panjang dari rencana awal). Section ini hasil deep-research 2026-06-18 untuk menjawab: "apalagi yang perlu dibuat untuk audio?"

### 14.1 Temuan research yang MENGUBAH asumsi

1. **Ambient ≠ Music (insight baru).** Riset serious-game audio ([SciTePress 2025](https://www.scitepress.org/Papers/2025/135044/135044.pdf)) memisahkan fungsi: *background music* → motivasi & cognitive processing; *ambient sound* → navigasi & regulasi emosi; *SFX* → feedback & engagement. Desain kita menggabung semua jadi "BGM". Pemisahan **music-bus** + **ambient-bus** (di bawah musik, per-lokasi: murmur warga di Puskesmas, jangkrik di wilayah) adalah extension natural dari 3-channel mixer → jadi efektif 4-channel. Murah, high-immersion, research-backed.

2. **Auskultasi punya dataset riset besar, TAPI lisensi harus dicek.** [PhysioNet/CinC 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC7199391/) (2435 rekaman jantung, 1297 pasien) + [CirCor DigiScope](https://arxiv.org/pdf/2108.00813) (murmur-labeled). Ini bukan CC0 — PhysioNet pakai lisensi sendiri (sebagian ODC-BY, sebagian credentialed-restricted). [Easy Auscultation](https://www.easyauscultation.com/) & Wellcome punya MP3 gratis tapi **proprietary**. → Killer feature feasible, tapi **legal clearance per-dataset WAJIB sebelum commit**.

3. **Feedback audio = "competence need" (validasi).** Systematic review medical serious games ([PMC11549195](https://pmc.ncbi.nlm.nih.gov/articles/PMC11549195/)): elemen tersering = storyline, points, **feedback**; "distinct and timely feedback addresses the need for competence." Pendekatan SFX-per-aksi kita tervalidasi. Bonus: review bilang "standardized sound design principles **belum** ada" → PRIMER bisa jadi studi kasus publikasi.

4. **Accessibility bukan opsional untuk konteks akademik.** WCAG 1.2.1 + game-a11y: setiap cue audio penting **wajib** punya paralel visual. Manfaat melebar — bukan cuma mahasiswa tuli (0-1 dari 50), tapi juga *auditory processing*, *language learners*, dan yang main di lab ramai tanpa headphone. Plus: death-scene perlu **content-awareness** (mahasiswa FK bisa punya trauma kematian nyata), dan flash visual harus respek `prefers-reduced-motion` — **jangan** dilabeli "epilepsy mode" (anti-pattern per [Access-Ability](https://laurakbuzz.com/2020/08/28/)).

5. **Adaptive music feasible via vertical layering ringan.** [Game Audio Co](https://www.thegameaudioco.com/making-your-game-s-music-more-dynamic-vertical-layering-vs-horizontal-resequencing): vertical layering (stem on/off, sinkron) lebih simpel dari horizontal resequencing. Howler bisa via parallel Howl + `fade()`. DeepThink dulu bilang "skip" untuk solo dev, tapi dengan runway +3 bulan, **2-stem** (base + tension) untuk Puskesmas (normal vs outbreak/emergency) jadi achievable.

### 14.2 Roadmap terprioritaskan

#### TIER 0 — Tutup gap dari yang SUDAH didesain (wajib sebelum rilis)

| # | Item | Kenapa | Effort |
|---|---|---|---|
| 0.1 | **Source 3 BGM final** + ganti placeholder gamelan Jawa → pan-Indonesian netral | Placeholder region-specific (appropriation risk); AUDIO_SOURCING sudah kurasi 3 CC0 | 4-8j (user-side) |
| 0.2 | **Location-based BGM** — refactor `playBGM(day)` → `playBGM({location, state})` | AUDIO_DESIGN Phase 3 **mendesain ini tapi belum diimplementasi**; sekarang masih day-rotation | 3-4j |
| 0.3 | **Accessibility pass** — audit semua safety cue punya paralel visual + `Reduced Audio` mode aktif + `prefers-reduced-motion` di flash | WCAG, konteks lab kampus, language learners | 4-6j |
| 0.4 | **Wire P1 missing audio** — pause/resume, bridge outage, outbreak escalation, low-funds warning | Sudah di-list di § 3.4 dossier, belum di-wire | 3-4j |

#### TIER 1 — High-value, muat di runway September

| # | Item | Kenapa | Effort |
|---|---|---|---|
| 1.1 | **Ambient-bus** (4-channel) — soundscape per-lokasi di bawah musik | Research §14.1.1; immersion besar, biaya kecil | 5-7j |
| 1.2 | **Vertical layering Puskesmas** — base + tension stem, state-driven | Research §14.1.5; "feel" dokter saat tekanan naik | 6-10j |
| 1.3 | **Content-warning + death-scene setting** — toggle intensitas, skip-able | Etika edukasi, trauma-aware | 2-3j |
| 1.4 | **SFX upgrade** — ganti FM-synth diegetic (paper/pen/stamp) → field recording CC0 | Diegetic terasa nyata; Freesound banyak | 3-5j |
| 1.5 | **Scene BGM tambahan** — Night shift, Game Over, Victory (VictoryModal sudah ada di master!), Emergency | Coverage scene yang sekarang silent | tergantung sourcing |

#### TIER 2 — V2 / pembeda (butuh runway + legal)

| # | Item | Kenapa | Effort |
|---|---|---|---|
| 2.1 | **🌟 Auskultasi mini-game** — identify murmur/wheeze/ronchi via stetoskop in-game | DeepThink killer feature; ubah PRIMER "manajemen" → "simulator klinis"; potensi publikasi | 30-60j + legal |
| 2.2 | **Voice-over tutorial Indonesia** — VO untuk onboarding hints (sudah ada di master) | Aksesibilitas + first-run UX | 10-20j |
| 2.3 | **Audio analytics** — ukur mute-rate, session-length audio on/off, post-event error-rate | Metodologi A/B + bukti efektivitas | 4-6j |

#### TIER 3 — Riset & sustainability

| # | Item | Kenapa |
|---|---|---|
| 3.1 | **Publikasi** "Audio design for medical education games — PRIMER case study" | Review bilang prinsip standar belum ada → kontribusi orisinal |
| 3.2 | **LUFS normalization script** + audio preload strategy + service-worker cache (offline-first) | Konsistensi loudness antar-sumber; offline parity |
| 3.3 | **Crossfade wiring** antar-track transisi (Howler `fade()` sudah dipakai di Respectful Silence) | Transisi mulus saat ganti lokasi |

### 14.3 Rekomendasi urutan eksekusi

**Sprint audio berikutnya (achievable, high-ROI):** 0.2 (location-based) → 0.3 (accessibility) → 0.4 (P1 wiring) → 1.1 (ambient-bus). Empat ini menutup gap arsitektur yang sudah didesain + memenuhi standar akademik, total ~15-21 jam, semuanya code-side (tidak nunggu sourcing).

**Paralel user-side:** 0.1 (source 3 BGM final) — independen, bisa dikerjakan kapan saja.

**Keputusan strategis yang butuh input AG:** apakah **2.1 Auskultasi** masuk scope September? Ini high-reward (pembeda + publikasi) tapi 30-60 jam + legal clearance. Kalau ya, mulai **legal clearance PhysioNet/CirCor SEKARANG** (proses lama) sambil fitur lain jalan.

### 14.4 Hal yang sengaja TIDAK direkomendasi (cegah scope creep)

- Horizontal resequencing music (terlalu kompleks vs vertical layering)
- Procedural/generative audio (eksperimental, 50 user bukan audience eksperimen)
- Spatial/3D audio (belum ada kebutuhan WebXR)
- Voice-AI NPC dialog (bias + risiko edukasi medis)

---

**END OF § 14** — deep-research roadmap per 2026-06-18.
