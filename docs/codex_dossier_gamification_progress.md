# PRIMER — CODEX Dossier: Progress Eksekusi Roadmap Gamifikasi

> **Tujuan dokumen**: Memberi CODEX (AI reviewer) konteks lengkap atas keputusan gamifikasi yang sudah dieksekusi sejak review PR #2, termasuk roadmap 8-minggu DeepThink yang diadopsi (dengan satu revisi besar dari user). Dokumen ini melengkapi `deepthink_dossier_gamification.md`.
> **Periode**: 23-26 April 2026 (4 hari sprint).
> **Branch**: `claude/keen-varahamihira-35f4d8` — sudah merge PR #2, lanjut commit M1-M4.
> **Reviewer sebelumnya**: CODEX (matriks valid/misleading/false di PR #2), DeepThink (full strategy review).

---

## 1. POSITIONING: KENAPA INI ADA

User (Dr. AAB Wirayuda — pengembang tunggal PRIMER) mengakui bingung soal arah gamifikasi. Setelah audit awal saya, muncul kebutuhan untuk:
1. Mendapat second opinion dari AI reviewer (DeepThink)
2. Menjalankan rekomendasi yang masuk akal (M1-M8)
3. Sekarang: minta CODEX cross-check apa yang sudah dieksekusi vs apa yang DeepThink sarankan

CODEX sebelumnya akurat dalam koreksi PR #2 (menemukan beberapa klaim audit saya yang salah/outdated). Kami butuh validasi serupa untuk eksekusi gamifikasi: apakah arah benar, apakah ada anti-pattern yang lolos, apakah ada clinical-safety violation yang terlewat.

---

## 2. KEPUTUSAN STRATEGIS (KONTEKS DEEPTHINK + REVISI USER)

### 2.1 Model gamifikasi yang dipilih
**Hybrid: A-Lite (Residensi 60→90 hari) + Layer C (Mastery)**

DeepThink awal usul **Residensi 60 hari** karena asumsi 1 sesi lab kampus 2-jam. **User koreksi**: pemakaian PRIMER hybrid lab+rumah (cloud save resume), bukan one-shot 2-jam. Saya re-derive ke **90 hari single track + continue mode**:
- 90 hari = mirror real residency block
- ~5-6 jam playtime realistic
- TTM keluarga butuh observasi 3 bulan untuk bergerak meaningful (Prochaska 1983)
- Hard endpoint Day 91 → final score lock immutable
- Pasca-stase: pemain bisa lanjut bermain untuk hunt achievement Model C

### 2.2 Formula skor 4-dimensi (DeepThink)
Diadopsi as-is, dengan field name persis dari codebase:
```
Skor_UKP = (clinicalAccuracy/100) * 35 * Referral_Guillotine
  Referral_Guillotine = max(0, 1 - (rrns - 5) * 0.05)
  → rrns ≥ 25% = multiplier 0 (akurasi 100% pun jadi 0)

Skor_UKM = (kkSehatPercent/100) * 15 + (readinessVillageIKS/100) * 20
  − apathyEvents * 5 (BC case dengan apathyPenalty=true)

Skor_MAN = ACCREDITATION_POINTS[clinical.accreditation]
  Dasar 4 / Madya 8 / Utama 12 / Paripurna 15

Skor_RES = player.reputation * 0.15 − faintedCount * 5
```

Grade: A ≥85 PTT Teladan / B 70-84 Kompeten / C 55-69 Lulus / D <55 Belajar/Recall Dinkes.

### 2.3 Anti-min-max validated
- **Pemain Jahat** (95% akurasi tapi rrns 20% + 2 apathy + IKS rendah + Dasar + reputasi 40) → total **18.31 Grade D** ✓
- **Pemain Kompeten** (85% + rrns 4% + IKS sedang + Utama + reputasi 85) → total **78.5 Grade B** ✓
- **Pemain Teladan** (95% + rrns 3% + IKS tinggi + Paripurna + reputasi 95) → total **≥85 Grade A** ✓

Formula berhasil men-deny grade tinggi pemain yang main curang (over-refer, klik-kosong di home visit, abaikan komunitas).

---

## 3. PROGRESS PER MILESTONE (M1-M4 SELESAI)

### M1 — Skor Kinerja Terpadu + Hard Endpoint 90-Hari + Continue Mode ✅
**Commit**: `a09e98d`
**Files**: `src/utils/scoringEngine.js` (+45 tests), `src/components/StaseFinalReportModal.jsx`, `src/services/CloudSaveService.js` refactor, `src/store/slices/createMetaSlice.js` (+stase state + lockStaseFinalScore + acknowledgeStaseFinalReport actions), `src/components/MainLayout.jsx` wire useEffect.

Endpoint logic:
- `meta.stase.{ targetDay: 90, phase: 'active'|'postStase', finalScore, finalScoreLockedAt, finalScoreDay, finalReportAcknowledged }`
- Auto-detect via useEffect: `day > targetDay && phase === 'active' && finalScore == null` → `lockStaseFinalScore()` (idempotent, kalau sudah locked tidak override)
- StaseFinalReportModal render saat `phase === 'postStase' && finalScore && !finalReportAcknowledged`
- Pasca-ack: pemain di-mode `postStase`, bisa lanjut bermain, skor immutable

CloudSaveService refactor: ganti formula arbitrer `reputation*10 + level*50 + knowledge*2 + day*5` dengan `calculatePerformanceScore()`. Schema baru: `score, grade, score_ukp, score_ukm, score_management, score_resilience` siap untuk Dashboard Dosen.

### M2 — TheDirector Day-Aware Pacing + MonthlyDebriefModal ✅
**Commit**: `a054220`
**Files**: `src/game/TheDirector.js` (+getDayPhaseCapIntensity export), `src/components/MonthlyDebriefModal.jsx`, `src/store/slices/createMetaSlice.js` (+acknowledgeMonthlyDebrief), `src/store/helpers/persistenceHelpers.js` (+lastDebriefDay), `src/components/MainLayout.jsx`, `src/tests/directorPacingDayCap.test.js` (+20 tests).

Pacing kurva 90-hari:
| Fase | Day | Cap Intensitas |
|---|---:|---|
| Pekan 1-2 | 1-14 | breathing |
| Pekan 3-4 | 15-30 | normal |
| Pekan 5-6 | 31-60 | pressure |
| Pekan 7+ | 61+ | crisis |

`selectPacingProfile(stress, day)` clamp intensitas berdasarkan `getDayPhaseCapIntensity(day)`. Pemain bored di Day 5 tidak langsung dilempar ke crisis. Pemain stress tinggi tetap dapat mercy mode (cap tidak override safety mercy).

MonthlyDebriefModal: non-blocking checkpoint Day 30 & Day 60. Header + sisa hari ke endpoint, mini bar 4-dimensi skor, top 3 indikator PIS-PK paling kuat + bottom 3 paling lemah ("Prioritas Bulan Depan"). Tracked via `meta.stase.lastDebriefDay`.

**Decision skip**: ukpBridge.delayDays kompresi dari 3-7 ke 5-12 (DeepThink usul). Untuk 90-hari, scenario library existing (1-180 hari) sebagian besar realistic. Memaksakan kompresi merusak realitas medis (TB-MDR memang muncul lambat 14-30 hari, kusta/filariasis 30-180). Trade-off: beberapa fail kasus Day 80+ tidak trigger bridge sebelum endpoint — tapi pemain tetap dapat reputation penalty langsung dari outcome 'failed'.

### M3 — Selective Feature Unlocks + Onboarding Patient Bias ✅
**Commit**: `8f90b75`
**Files**: `src/utils/featureUnlocks.js` (+30 tests), `src/hooks/useFeatureUnlockWatcher.js`, `src/components/MainLayout.jsx` wire, `src/components/WilayahPage.jsx` tryEnterBuilding gate, `src/hooks/usePatientEMR.js` Prolanis enroll gate, `src/game/PatientGenerator.js` Day 1-14 bias, `src/tests/onboardingPatientBias.test.js`.

**REVISI BESAR DARI USER**: User menolak DeepThink usul "hide SISRUTE Day 1-14". Alasan: pasien gawat darurat tidak menunggu Day 15. Hide SISRUTE = forced misuse (treat 4B/4C kasus yang seharusnya rujuk) = clinical safety violation.

Kompromi yang diadopsi:
- **TIDAK di-gate**: SISRUTE, Poli Umum, EMR, Inventaris, MAIA — semua selalu tersedia Day 1.
- **Di-gate**: Posyandu Day 15, Prolanis Day 30, Outbreak Investigation UI Day 45, Akreditasi Detail Day 30.
- **Patient generator bias**: Day 1-7 = 92% SKDI 4A, Day 8-14 = 78% SKDI 4A, Day 15+ = realistic distribution. Hanya pada branch isStochastic (random patient); scripted scenarios (storyline, profile conditions, UKP bridge) tidak dioverride.

Feature gate via `tryEnterBuilding()` wrapper (Posyandu) dan `handleEnrollProlanis` check (Prolanis). Toast pedagogis dengan rationale. `useFeatureUnlockWatcher` hook emit success toast saat melewati threshold (Day 15: Posyandu! / Day 30: Prolanis & Akreditasi / Day 45: Outbreak Investigation).

**Side-fix**: `storeProphylaxis.test.js` line 478 expected 'Pressure Rising' multiplier 1.3 → updated ke 'Breathing Room' 0.7 karena Day 7 cap kicked in. Stress=16 calc tetap valid; perubahan label mencerminkan intended pacing curve, bukan regresi.

### M4 — Onboarding Hints Day 1-2 ✅
**Commit**: `819b58d` (lokal, push pending network)
**Files**: `src/components/OnboardingHints.jsx`, `src/store/slices/createMetaSlice.js` (+advanceOnboardingStep + dismissOnboarding), `src/store/helpers/persistenceHelpers.js` (+createInitialOnboardingState), `src/components/MainLayout.jsx`.

Floating non-blocking panel pojok kanan-bawah dengan 6 step:
- Day 1: welcome → anamnesis/diagnosis 4A → resep+MAIA+Pulangkan+SISRUTE catatan
- Day 2: peta wilayah → home visit intervensi → penutup (90-hari + 4-dim + monthly debrief)

State: `meta.onboarding = { enabled, currentStep, dismissed }`. Auto-hide saat day > 2 atau dismissed. Step Day 2 tidak terbuka sebelum pemain Day 1 selesai (`step.day > day` filter). Persist via Zustand localStorage.

---

## 4. SISA ROADMAP (M5-M8)

### M5 — Persistent Meta-Layer (Lifetime Badges + SKDI Tracker)
- `meta.lifetime` state yang tidak di-reset saat `resetMeta`/`startNewGame`
- Track: `totalCasesDiagnosed`, `uniqueSkdiCodes` (Set), `badges` (array)
- Badges: SKDI Mastery (X kode unik), PIS-PK Mastery (12 indikator > 80%), Outbreak Survivor (3 wabah contained), Stase Lulus (≥1× Grade C+)
- Earned saat milestone tercapai → toast + tampil di OpeningScreen / SaveSlotSelector

### M6 — Dosen Dashboard + Cloud Save Config
- `/dosen-dashboard` route (read-only) — leaderboard table dari Supabase, filtered by NIM
- Config Supabase `.env` (USER ACTION needed — saya tidak bisa setup credential)
- Schema sudah siap dari M1 refactor: `score, grade, score_ukp, …`
- Auth flow: NIM login → mahasiswa identity → leaderboard entry

### M7 — Additional Stress Profiles + Balance Validation
- 4-5 archetype tambahan: "Klinis Saja" (UKP only, abaikan UKM), "UKM Saja" (preventif full, klinik buruk), "Min-max Refer" (rujuk semua), "Pasif Apathy", "Burnout"
- Test masing-masing dapat grade yang adil sesuai performa multidimensional
- Manual playtest checklist (untuk user, bukan saya — saya tidak bisa main)

### M8 — Bundle Hygiene + Cleanup
- Konva removal (unused dependency)
- 3D postprocessing off default (vendor-3d kandidat lazy)
- size-limit config untuk budget enforcement
- Lint baseline lock (sekarang 44, target ≤44)
- 50-user concurrent test scaffold (Vercel + Supabase free tier)

---

## 5. INTEGRITAS PEDAGOGIS — ARSITEKTUR

PRIMER mengelola 4 lapis kepatuhan kurikulum FK Indonesia. Saya highlight ini agar CODEX paham mengapa beberapa keputusan terlihat "konservatif":

| Lapis | Sumber | Cara dipatuhi |
|---|---|---|
| SKDI 2012 | KKI | 144 penyakit FKTP wajib di `FKTP144Diseases.js`, validate via `correctTreatment` per case |
| PIS-PK | Permenkes 39/2016 | 12 indikator resmi di `pisPkIndicators.js`, formula IKS dari Permenkes |
| Akreditasi Puskesmas | Kemenkes | 4 tier (Dasar/Madya/Utama/Paripurna) di scoring dimensi Manajemen |
| Fornas BPJS | BPJS | Obat rasional via `MedicationDatabase`, RRNS ≤5% via Guillotine |

DeepThink red flags yang diadopsi:
- ❌ Tidak ada XP boost untuk lab order tambahan (defensive medicine)
- ❌ Tidak ada XP boost untuk antibiotic prescription (stewardship)
- ❌ Tidak ada live leaderboard saat play (race-to-top distortion)
- ❌ IKS tidak instant-green (TTM butuh waktu)
- ❌ Tidak ada Insta-Reload Day (konsekuensi harus dijalani)

Masih harus diaudit:
- Insta-Reload Day saat ini ada via save load (Zustand persist) — pemain technically bisa load dari snapshot autosave. Sengaja? Atau perlu lock?
- Live leaderboard sekarang TIDAK ada di UI mid-game (hanya post-stase di Dashboard Dosen rencana M6) — confirmation needed.

---

## 6. PERTANYAAN UNTUK CODEX

Lihat `docs/codex_prompt_gamification_review.md` untuk format deliverable. Singkatnya:
1. Apakah formula skor (§ 2.2) bebas eksploit yang belum kepikiran?
2. Apakah keputusan revisi user (tidak hide SISRUTE, ganti durasi 60→90 hari) sehat?
3. Apakah skip ukpBridge kompresi (M2) berisiko clinical-realism mengorbankan game-feel?
4. Apakah patient bias Day 1-14 (92→78% 4A) menyentuh integritas medis (mahasiswa "manja" ke realitas yang lebih keras)?
5. Onboarding hints (M4): tone OK? Atau terlalu hand-holding?
6. M5-M8 prioritas: ada yang harus diubah urutannya?
7. Bug/regresi yang terlewat di 4 commit terakhir?

---

## 7. RUJUKAN KODE UNTUK CODEX

File baru/dimodifikasi sejak review PR #2 yang relevan untuk gamifikasi:
- `src/utils/scoringEngine.js` (372 LOC, 45 tests) — formula 4-dimensi
- `src/components/StaseFinalReportModal.jsx` (171 LOC) — final report
- `src/components/MonthlyDebriefModal.jsx` (~140 LOC) — Day 30/60 checkpoint
- `src/components/OnboardingHints.jsx` (~120 LOC) — Day 1-2 hints
- `src/utils/featureUnlocks.js` (~80 LOC, 30 tests) — selective gating
- `src/hooks/useFeatureUnlockWatcher.js` (~50 LOC) — toast emitter
- `src/game/TheDirector.js` modifications — day-aware pacing cap
- `src/game/PatientGenerator.js` modifications — onboarding bias 4A
- `src/components/WilayahPage.jsx` modifications — Posyandu gate
- `src/hooks/usePatientEMR.js` modifications — Prolanis enroll gate
- `src/services/CloudSaveService.js` modifications — leaderboard formula refactor
- `src/store/slices/createMetaSlice.js` modifications — stase + onboarding state
- `src/store/helpers/persistenceHelpers.js` modifications — initial state additions

Branch: `claude/keen-varahamihira-35f4d8` (PR #2 base + M1-M4 commits di atas).
Total test suite: 582+ hijau, 3 pre-existing failures dari sebelum PR #2.
