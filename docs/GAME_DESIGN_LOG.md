# 🎮 PRIMER Game Design Log

> Catatan keputusan desain gameplay. Format: `[YYYY-MM-DD HH:mm]` per entry.

---

### 2026-03-27 05:17 — Village Population Scaling Decision

**Konteks**: 30 KK (~115 warga) habis dalam 4 hari game. Kasus poli cepat repetitif.

**Keputusan**:
- Target: **200 KK (~800 jiwa)**, 4-5 RW dengan pocket dioramas
- 70-80% pasien dari warga inti, 20-30% outsiders (garbage-collected)
- Kapitasi header tampilkan "34.520 jiwa" sebagai ilusi skala (Frostpunk trick)
- RW unlock sebagai campaign progression

**Sumber**: Deepthink Village Scaling (3 rounds), `deepthink_village_triage.md`

---

### 2026-03-27 05:38 — DEADLINE TARGET HARI INI

**Target**: Selesaikan pipeline penuh dalam 1 hari:

```
1. Store Slicing CP2       ← extract action slices (navSlice → clinicalSlice)
     ↓
2. Patient Factory         ← konsolidasi single canonical generator
     ↓
3. Village Expansion       ← 30 KK → 200 KK (~800 jiwa), 4-5 RW, pocket dioramas
     ↓
4. Living Village          ← villageLedger feedback loop dari discharge
```

**Tambahan**: Perbaiki dashboard/panel Poliklinik EMR:
- UX harus intuitif sebagai simulasi EMR untuk mahasiswa FK
- **Mobile responsiveness** — saat ini sama sekali tidak mobile-friendly
- Harus representatif dan enak dipakai

**Pengingat angka**: Target populasi = **200 KK (~800 jiwa)**

---

### 2026-03-27 05:50 — VISI EKSPANSI & EXHIBITION SHOWCASE

**Catatan demografi**: 800 jiwa/desa WAJAR — desa kecil Indonesia biasanya 1.000-3.000 jiwa. 800 cocok untuk desa pelosok. Puskesmas cover beberapa desa → outsiders = warga desa tetangga.

**Halaman Sensus**: Perlu diperbaharui seiring village expansion (200 KK). Pagination, filter per RW, profil keluarga.

**Map 2D Blueprint (BARU)**:
- Buat versi **2D blueprint/denah** side-by-side dengan 3D diorama
- Alasan: kalau 3D tidak dibuka → load/render ringan, pemain bisa fokus strategic gameplay
- 2D mode = peta top-down ala SimCity/blueprint, interaktif
- 3D mode = diorama immersive (opsional, bisa toggle)

**Level-Based Map Expansion**:
- Seiring level naik → unlock RW baru → keluarga baru dikunjungi
- Lebih banyak wilayah = budget kapitasi makin besar
- Pemasukan Puskesmas bertambah seiring ekspansi
- Gameplay loop: Level Up → Unlock RW → More Families → More Kapitasi → Better Upgrades

**UKM Exhibition Showcase** 🎯:
- **Tujuan**: Showcase community medicine di Indonesia untuk civitas kampus luar
- **Audience**: FKK ITS ingin pamer di kegiatan akademik/pameran
- **Gameplay section UKM**: Lengkap dengan visual, fitur, dan tech yang memukau
- **Standar**: Inovatif secara gameplay, UI/UX, dan visual art design
- **Harus**: Lengkap, memukau, dan layak pamer sebagai "mini exhibition"
- Fitur UKM yang bisa ditambahkan di map yang meluas:
  - Posyandu, Posbindu, Poskesdes, STBM, IKM, Jentik, Fogging
  - Kerjasama lintas sektor (Camat, PKK, Kader)
  - Data epidemiologi per RW
  - Program promosi kesehatan

**Status**: Target masa depan (setelah pipeline hari ini selesai)

---

### 2026-03-31 10:00 — Blueprint Peta Desa v2.0: Arsitektur Lengkap + Art Direction Gap

**Konteks**: Sesi panjang blueprinting peta wilayah Desa Sukamaju. 9 round DeepThink (R1–R9) ditriangulasi terhadap codebase aktual.

**Keputusan FINAL (Blueprint v2.0 — 12 sections, ~1.400 baris)**:
1. Grid 160×120, hybrid settlement algorithm, 5 sektor, 8 RW, dual-mode 2D/3D
2. 200 KK scaling via "Ekspansi Pendataan PIS-PK"
3. 47 building types (39 existing + 8 baru)
4. 12 pertanyaan strategis RESOLVED (Q1–Q12)
5. Desa Wisata + Travel Medicine (17 kasus, VAR, Pasar Hewan)
6. 8 megatren epidemiologi triage (3 MVP, 4 DLC, 1 redundan)
7. 6 UX hacks (Karma Traceback, KBK BPJS, Tourist EMR, 2AM Shift, Champion)
8. 7 AI guardrails (dependency ban, tiles trap, persist limit, data contracts, failsafes, Manhattan, zero-emoji)
9. 38 items roadmap across 6 phases
10. Visual Design System: palette, canvas rendering, markers, touch, seasonal, animations, HUD, typography, 5 visual directives
11. Asset art direction: Tropical Micro-Diorama style, pedestal hack, dual rendering mode

**Keputusan BELUM FINAL (harus disambung)**:
- **Art direction peta 2D — 3 opsi terbuka**:
  - A: Canvas-Drawn Everything (terrain + bangunan 1 canvas, bentuk geometris) ← REKOMENDASI
  - B: Pixel Art Sprite Sheet (unified RPG style)
  - C: Abstract Board Game (peta diagram, bukan ilustrasi)
- **24 PNG isometrik yang sudah ada**: DIEVALUASI → inkonsisten (3-4 style), terlalu besar, perspektif clash dengan top-down terrain. Kandidat BIKIN ULANG atau ubah pendekatan.
- Section XII.K di blueprint PERLU DIREVISI setelah art direction dipilih

**Sumber**: DeepThink R1–R9, codebase audit (map-utils.js, Map2D*.jsx, useGameStore.js, constants.js, assets.js, src/assets/buildings/)
**Artifact**: `blueprint_peta_desa.md` v2.0 di brain conversation artifacts

---

### 2026-03-31 13:00 — Blueprint v2.2: Data Crosscheck + Vibecoding Guardrails

**Konteks**: Crosscheck data sensus di VillageRegistry terhadap blueprint. Triage DT R11 vibecoding wisdoms.

**Keputusan FINAL (masuk blueprint)**:
1. **RW distribusi terdokumentasi**: 200 KK across 8+1 RW, distribusi per sektor terpetakan
2. **RW 09 = Bug**: 2 KK orphan di RW 09 tidak ada threshold unlock → harus merge ke RW 08
3. **Low-Middle node color**: `#94a3b8` (slate) ditambahkan → 53 KK (26.5%) sebelumnya tanpa warna
4. **Guardrail #8**: 60FPS React Shield — `React.memo`, `useMemo`, `will-change: transform`
5. **Guardrail #9**: HMR Static Seed — `_seed = 12345` selama development
6. **XII.L Z-Index Manifest**: 10 layer dari Canvas(z:10) sampai HUD(z:200)
7. **House Placement Contract**: `family.rw` → Sektor → coordinate bounds di planologi

**Tips Vibecoding DT R11 (TIDAK masuk blueprint, tips untuk user)**:
- Wisdom 1: Initialization prompt — load blueprint as passive context first, no coding
- Wisdom 2: Micro-bite execution — chunk per Phase, per file, per component
- Wisdom 3 → Guardrail #8 (sudah masuk blueprint)
- Wisdom 4 → Guardrail #9 (sudah masuk blueprint)
- Wisdom 5 → XII.L Z-Index (sudah masuk blueprint)

**Sumber**: Codebase audit (VillageRegistry.js, village_families*.js, village_data_expanded.js), DT R11
**Artifact**: `blueprint_peta_desa.md` v2.2

---

### 2026-03-31 13:15 — Blueprint v2.3: Geospatial SDoH Engine (DT R12)

**Konteks**: DT R12 memvalidasi bahwa koordinat rumah di peta bukan sekadar visual, melainkan "Death Risk Calculator" berdasarkan Spatial Epidemiology literatur global.

**3 Hukum Geospasial diadopsi**:
1. **Spatial Segregation**: Economy-based placement bias (kaya=pusat, miskin=pinggiran)
2. **Hazard Proximity**: Distance-to-hazard multipliers (sungai=diare×3, hutan=malaria×3)
3. **Distance Decay**: Distance-to-Puskesmas affects IKS drift (>40 sel = 2× faster) dan severity-on-arrival (+2 stages)

**Codebase impact**:
- `map-utils.js`: Placement algorithm harus baca `FAMILY_SDOH.economy`
- `PatientGenerator.js`: Manhattan distance ke hazard features → disease probability modifier
- `publicHealthHelpers.js`: `applyFamilyIndicatorDrift()` perlu paramater `distanceToPuskesmas`

**Referensi ilmiah**: "Your ZIP code is a better predictor of your health than your genetic code" (Dr. Tony Iton, Harvard T.H. Chan)

**Artifact**: `blueprint_peta_desa.md` v2.3

---
