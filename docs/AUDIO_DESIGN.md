# 🎵 PRIMER — Audio Design (1-Pager)

> **Tujuan**: Definisi identitas audio PRIMER — apa yang dibunyikan, kapan, dan kenapa.
> **Status**: v0.2 (2026-04-24) — revisi pasca DeepThink review
> **Author**: AG (Commander)
> **Pair doc**: [`AUDIO_DOSSIER.md`](./AUDIO_DOSSIER.md) § 13 (DeepThink revision notes)

---

## 🎯 Konsep Inti

**"Clinical Soundscape + Diegetic UI"** — hybrid antara ambient environment, diegetic workplace SFX, dan medically-authentic alarm.

| Lapisan | Pendekatan | Fungsi |
|---|---|---|
| **BGM** | 3-4 ambient soundscape (bukan melodi) | Mood tanpa audio fatigue |
| **Critical alerts** | FM synth pattern IEC 60601-1-8 | Medical authority anchor |
| **Clinical UI (EMR)** | Diegetic SFX (paper, pen, stamp) | Tactile "rekam medis legal" |
| **Navigation SFX** | FM synth existing, scoped down | Responsif tanpa pervasive |

**Perubahan dari v0.1**: scope dipangkas drastis karena (a) timeline 4 minggu tidak realistic untuk 10-12 track, (b) `AudioBuffer` refactor = RAM bomb risk, (c) soundscape CC0 > melody folk (lebih aman, zero appropriation risk).

---

## 🎼 BGM Palette — Minimal & Ambient

**3-4 ambient soundscape track** (BUKAN melodi folk cari-susah). Sumber: Freesound.org CC0.

| Trigger | Vibe | Komponen suara | Durasi loop |
|---|---|---|---|
| **Main Menu / Title** | Welcoming, morning village | Suling distant + ayam berkokok + angin sepoi | 2m |
| **Wilayah (peta)** | Rural adventure | Angin, jangkrik siang, burung, langkah pelan | 3m |
| **Puskesmas** | Clinical focus | Kipas angin dengung, murmur warga pelan, jam tik | 3m |
| **Outbreak / tense** *(opsional)* | Unease undercurrent | Kipas + low drone + detak jantung pelan | 2m |

**Kenapa soundscape vs melody**:
- File kecil (ambient = less dynamic range, ~1-2 MB per track)
- Zero cultural appropriation risk (suara alam/ambient bukan spesifik region)
- Alpha-wave friendly → fokus, bukan distract
- Freesound.org CC0 sangat banyak tersedia
- Loop seamless lebih mudah pada ambient drone

**Lokasi lain** (Rumah Dinas, Warung Intel, Posyandu, Gedung, SDM, Inventory, Diklat, Arsip, Sensus, Smartphone) → **silent by default**, hanya SFX interaksi. Kurangi audio fatigue sesi belajar panjang.

---

## 🔔 SFX Catalog

### Kategori 1 — Clinical Authority (IEC 60601-1-8 aligned)

Pattern mengikuti standar alarm medis internasional. Otak mahasiswa FK auto-asosiasi dengan ICU/IGD nyata.

| Method | Trigger | Pattern |
|---|---|---|
| `playCriticalAlarm` | Allergy violation, kontraindikasi | High-priority IEC: 5-pulse burst × 2 (tee-tee-tee-tee-tee --- tee-tee) di 1000 Hz sine |
| `playMediumAlarm` | Wrong ICD, deterioration worsening | Medium IEC: 3-pulse burst di 800 Hz |
| `playEmergency` *(refactor existing)* | Outbreak spawn, emergency arrival | Single sweep 440↔880Hz (existing sudah OK) |

Reference: [IEC 60601-1-8 melodic alarm tones](https://en.wikipedia.org/wiki/IEC_60601-1-8).

### Kategori 2 — Diegetic Clinical UI

SFX "dunia nyata kerja dokter". Mengganti/melengkapi FM synth untuk action klinis.

| Method | Trigger | Sound direction |
|---|---|---|
| `playPaperRustle` | Open EMR tab, flip history | Lembaran kertas folio 0.3s |
| `playPenScratch` | Tulis anamnesis / resep / catatan | Bolpoin menulis cepat 0.3s |
| `playStampConfirm` | Prescription signed, discharge final | "Thunk" stempel basah |
| `playStethoscope` | Mulai pemeriksaan fisik | Soft plastic/fabric contact |
| `playMonitorBeep` | Vital signs in EMR | Slow 60 BPM ping (ECG style) |

### Kategori 3 — The Respectful Silence (Patient Death)

**BUKAN musik sedih piano.** Pakai flatline + sunyi total.

```
Trigger: patient.deterioration >= 100
├─ t=0s   : fade BGM → 0 dalam 1s (quick duck)
├─ t=1s   : playFlatline (sine 800Hz konstan, 3 detik)
├─ t=4s   : TOTAL SILENCE 3 detik (game pause visual + UI freeze)
├─ t=7s   : resume BGM at 30% untuk transition
```

Keheningan memberi *shock factor* dan *gravitas* edukasi. Mahasiswa merasakan berat kematian, bukan sekadar "game over screen".

### Kategori 4 — Existing FM Synth (keep, scoped)

| Method | Status |
|---|---|
| `playCursor`, `playConfirm`, `playCancel`, `playNotification`, `playSuccess`, `playError` | KEEP, cocok untuk UI non-critical |
| `playClick` (alias `playConfirm` 400ms shimmer) | **REPLACE di global listener dengan `playCursor` (80ms)** — lihat § Global Click Scope |

### Kategori 5 — Environmental Stingers

| Method | Trigger |
|---|---|
| `playDoorOpen` | Masuk lokasi baru — short 0.5s stinger |
| `playDayStart` | Morning briefing — ayam berkokok + suling 2s |
| `playDayEnd` | EoD modal — crickets fade-in + distant dog bark *(netral, non-religious)* |
| `playLevelUp` | Level/akreditasi naik — subtle gamelan glissando |
| `playBridgeOutage` | Jembatan putus — wood crack + splash |

---

## 🎚️ System Improvements

### 1. Settings UI — P0 (Parasut Rilis)

Slider + toggle di Settings modal:
- **Master Volume** (0-100%)
- **BGM Volume** (0-100%) — terpisah dari SFX
- **SFX Volume** (0-100%)
- Toggle **Mute All** (persistent, save ke localStorage)
- Toggle **Focus Mode** — mute BGM saja, SFX tetap (sesi belajar panjang)
- Toggle **Reduced Audio** — accessibility, matikan ambient & non-essential

### 2. Global Click Listener Scope ([App.jsx:172-188](../src/App.jsx))

**Audit finding (2026-04-24)**: listener saat ini match `BUTTON`, `A`, `[role="button"]`, dan `.cursor-pointer`. Karena PRIMER fully-Tailwind dengan `.cursor-pointer` universal di clickable element, listener fires di setiap card, icon, tab — pervasive → audio fatigue.

**Fix minimal** (bukan "kill total"):
- Hapus `.cursor-pointer` match (terlalu broad)
- Swap `soundManager.playClick()` → `soundManager.playCursor()` (80ms tick, bukan 400ms shimmer chord)
- Keep semantic match: `BUTTON`, `A`, `[role="button"]`

Hasil: click feedback untuk real CTA tetap, bukan setiap element hoverable.

### 3. Ducking — Tunnel Vision Hack

Saat EMR panel open → BGM volume turun 50% otomatis. Saat close → restore.
Simulasi psikologis "dokter fokus ekstrem saat telaah kasus". Implementasi murah via Howler `sound.fade()`.

### 4. Visual-first Error Handling

Untuk **non-urgent system errors** (autosave fail, network drop, runtime trap):
- **JANGAN pakai audio** — mahasiswa bisa mengira pasien meninggal
- **Pakai banner merah raksasa** di atas layar + icon persistent

Audio hanya untuk in-game clinical/gameplay state, bukan system-level error.

---

## 📦 Sourcing Plan

### Strategi utama: **Soundscape CC0, bukan melody**

- **Freesound.org** — CC0 ambient: suara desa, kipas angin, kertas, bolpoin, stempel, flatline ECG
- Normalisasi semua track di Audacity: target **-18 LUFS integrated**
- Format **`.ogg` primary** (gapless loop, smaller) + `.mp3` fallback (untuk Safari lama)
- Lazy-load per lokasi (jangan preload semua di init)

### Fallback sumber (melodic stinger kalau perlu)
- Pixabay Music (CC0)
- YouTube Audio Library (royalty-free, no attribution)
- Kevin MacLeod / Incompetech (CC-BY, wajib credit → butuh Credits screen)

### Red flags (hindari)
- Rip YouTube tanpa verify creator license
- Suno / Udio (ToS commercial berubah-ubah)
- Gamelan Bali/Jawa spesifik untuk scene non-region (appropriation risk)
- Adzan sample (religious asymmetry — pakai netral: jangkrik, dog bark distant)

---

## 🛠️ Technical Stack Decision

### Howler.js — ADOPT

Install [howler.js](https://howlerjs.com/) (~9 KB, MIT licensed, offline-friendly).

**Kenapa**:
- Handle autoplay policy, Web Audio context suspension, iOS audio unlock otomatis
- `sound.fade()` untuk crossfade & ducking → ~1 jam implementation vs 1-2 minggu manual
- Sprite support kalau nanti perlu SFX batch loading

**Trade-off**: +1 dependency di project zero-dep offline-first. Mitigasi: MIT license aman, bundled (no CDN), cacheable via existing service worker.

### JANGAN refactor ke AudioBuffer

`AudioBuffer` decode file utuh ke RAM (uncompressed PCM) → file 15 MB = ~100+ MB RAM.
Laptop mahasiswa / HP low-spec = **OOM freeze/crash**.

Stay dengan `<audio>` element (atau Howler wrapper) yang stream-decode.

---

## 🗓️ 4-Week Survival Plan

### 🔴 MALAM INI (sudah / siap eksekusi)
- [x] `git rm` 7 BGM copyrighted dari `public/audio/` (2026-04-24)
- [x] `bgmTracks = []` + guard di `SoundManager.js playBGM / playRandomBGM`
- [ ] Scope down `App.jsx:172-188` global click listener *(pending user approve)*

### Phase 1 — Purge & Setup (Week 1)
- [ ] `npm install howler`
- [ ] Settings UI: 3-slider (Master/BGM/SFX) + Mute + Focus Mode toggle
- [ ] Scope down global click (hapus `.cursor-pointer` + swap ke `playCursor`)
- [ ] Source **3 soundscape ambient** (Menu, Wilayah, Puskesmas) dari Freesound CC0
- [ ] Normalisasi -18 LUFS di Audacity, export `.ogg` + `.mp3` fallback

### Phase 2 — Safety Wiring P0 (Week 2)
- [ ] Implement `playCriticalAlarm` (IEC 60601-1-8 high priority pattern) via FM synth
- [ ] Wire `playCriticalAlarm` ke allergy gate *(dependency: allergy gate P0 itself)*
- [ ] Implement Respectful Silence sequence untuk patient death (deterioration ≥100)
- [ ] Diegetic EMR SFX: paper rustle, pen scratch, stamp confirm
- [ ] Visual banner (not audio) untuk autosave failure & runtime trap

### Phase 3 — Polish (Week 3)
- [ ] Ducking 50% saat EMR panel open
- [ ] Door-open stinger per lokasi utama
- [ ] Day start/end SFX (netral, non-religious)
- [ ] Level up gamelan glissando

### Phase 4 — Extreme Playtest (Week 4)
- [ ] Device test: Chrome desktop, Firefox, **Safari iOS (paling agresif!)**, Chrome Android
- [ ] Self-test: main 1 jam pakai earphone → kalau lelah/pusing, turunkan master volume default -30%
- [ ] Volume balance iteration
- [ ] Credits screen (kalau ada track CC-BY)
- [ ] Dokumentasi final

### ❌ DEFER ke V2
- Regional variant BGM (pan-Indonesian generic dulu)
- Dynamic layers / adaptive BGM
- Voice-over tutorial
- Procedural audio generation
- **🌟 Auskultasi puzzle** (killer feature V2 — reservasi slot)

---

## ✅ Success Criteria (Juni 2026)

1. ✅ **Zero copyrighted audio** di `public/audio/`
2. ✅ **3-4 ambient soundscape** royalty-free (CC0 preferred), total <10 MB
3. ✅ **Safety audio P0** lengkap: IEC allergy alarm, flatline+silence death, bridge outage
4. ✅ **Settings UI** 3-slider + Focus Mode tersedia
5. ✅ **Global click scoped** — tidak ada audio fatigue complaint di playtest
6. ✅ **Howler.js working** di Chrome, Firefox, Safari iOS
7. ✅ **Load time <3s** di koneksi kampus UNAIR (4G)
8. ✅ **Feedback playtest**: ≥70% "tidak terganggu", ≥50% "menambah immersion"

---

## 🔗 Related

- **Konteks + DeepThink review**: [`AUDIO_DOSSIER.md`](./AUDIO_DOSSIER.md) § 13
- **Existing code**: [`src/utils/SoundManager.js`](../src/utils/SoundManager.js)
- **BGM directory**: `public/audio/` *(dibersihkan 2026-04-24, pending refill)*
- **Global click listener**: [`src/App.jsx:172-188`](../src/App.jsx)
- **Clinical risk context**: memory `project_primer_clinical_risks.md`
