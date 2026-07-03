# Blueprint Definitif: Peta Wilayah Desa Sukamaju
*Hasil Triangulasi Dossier v2.0 × DeepThink R1–R12 × Codebase Audit*
*Status: RUNTIME-AUDITED v2.4 — Topologi Final, Implementasi Gameplay Parsial*

---

> [!IMPORTANT]
> Dokumen ini sudah diselaraskan ulang dengan runtime aktif per **9 April 2026**.
> - Audit gap runtime: [`blueprint_runtime_gap_audit_2026-04-04.md`](./blueprint_runtime_gap_audit_2026-04-04.md)
> - Source of truth sprint/phase: [`wilayah_execution_plan_2026-04.md`](./wilayah_execution_plan_2026-04.md)
> - Dossier keputusan 3D: [`pocket_diorama_deepthink_dossier_2026-04-09.md`](./pocket_diorama_deepthink_dossier_2026-04-09.md)
> - Prinsip kerja saat ini: **2D blueprint = source of truth gameplay**, **3D diorama = layer inspector / reward / empathy / exhibition**, **bukan target parity operasional default**.

## I. TRIAGE & VALIDASI DEEPTHINK

Saya telah mencocokkan setiap rekomendasi DeepThink dengan state aktual codebase. Berikut verdiknya:

### ✅ Diadopsi Utuh (High-Confidence)

| # | Rekomendasi | Alasan Adopsi |
|---|-------------|---------------|
| 1 | **Hybrid Settlement Algorithm** (Linear + Gaussian + Poisson) | Crop-circle pattern di `map-utils.js:174-178` (`Math.cos(angle)*dist`) terkonfirmasi. Harus diganti. |
| 2 | **Jarak = Biaya Energi** + Kendaraan Progression | Menambah kedalaman strategi. Sesuai dengan resource `energy` di `GameCore.js`. |
| 3 | **Framing Unlock = "Ekspansi Pendataan PIS-PK"** | Secara naratif genius dan realistis. Pasien dari RW terkunci tetap datang ke UGD tapi tanpa data SDOH. |
| 4 | **Staf = Defense, Dokter = Offense** | Sesuai dengan buff pasif staf yang sudah ada di `calculateGlobalBuffs()`. |
| 5 | **Event signal di peta** (ikon/alert spasial) | `outbreakPulse`, alert visual, dan cue bangunan sudah hidup. Anchor `🚨` generik untuk semua IKM event masih bertahap. |
| 6 | **Upgrade Visual Fasilitas** (post-scenario) | Menambah `dopamine payoff` UKM. Bisa diimplementasikan via `facilityLevel` property. |
| 7 | **Detective overlays berbasis layer** | Runtime berkembang menjadi overlay operasional multi-layer (`general`, `pispk`, `surveillance`, `psn`, `phbs`, `perilaku`) dengan prinsip yang tetap ringan di DOM. |
| 8 | **Semantic Zoom praktis** (overview ↔ detail) | Runtime memakai threshold zoom nyata di `Map2DBlueprint.jsx`, tetapi implementasi final saat ini masih 2 tahap, bukan heatmap 3 tahap penuh. |

### ⚠️ Diadopsi dengan Modifikasi

| # | Rekomendasi DT | Modifikasi Saya | Alasan |
|---|----------------|-----------------|--------|
| 9 | **Bendera Kuning 🟨 + Zona Duka selama 3 hari** | Ya, TAPI: Bukan BC "otomatis gagal". Kunjungan rumah masih bisa dilakukan, tetapi **difficulty multiplier COM-B naik 2×** dan dialog NPC menjadi agresif/sinis. | Jika kunjungan *auto-fail*, pemain kehilangan agensi dan bisa terjebak *death spiral* yang tidak bisa diselamatkan. |
| 10 | **Pocket Diorama (3D hanya 1 RW)** | Diturunkan statusnya: **2D tetap source of truth**, sementara 3D runtime sekarang masih berupa **full-village diorama opsional**. Jika pocket RW-only dikejar nanti, bentuk yang paling sehat adalah **inspector/reward mode**, bukan layar taktis baru. | Menjaga scope Sprint 1-3 tetap realistis, mencegah jebakan parity 3D, dan tetap menyisakan ruang showcase. |
| 11 | **Pustu/Polindes sebagai FOB (rest point)** | Ya, tetapi **memerlukan upgrade dulu** oleh pemain (investasi dana). Default = bangunan kosong. Setelah upgrade + staf ditugaskan → baru bisa jadi rest point. | Mencegah healing gratis yang terlalu mudah. |

### ❌ Ditolak / Ditangguhkan

| # | Rekomendasi DT | Alasan Penolakan |
|---|----------------|------------------|
| 12 | **Lazy Evaluation untuk IKS Drift** | ⚠️ **Sudah diimplementasikan secara berbeda dan lebih baik.** Codebase sudah punya `applyFamilyIndicatorDrift()` di `publicHealthHelpers.js` yang berjalan per-keluarga dengan probabilitas 5% (`chanceFromSeed(seed, 0.05)`). Artinya hanya ~10 dari 200 KK yang bermutasi per hari, bukan semua 200. Ini sudah cukup efisien dan tidak perlu Lazy Eval. Sistem JIT yang disarankan DT justru bisa menyebabkan *discontinuity* (IKS "melompat" saat diklik). |

---

## II. RESOLUSI 12 PERTANYAAN STRATEGIS

### 🗺️ Layout & Navigasi

#### Q1: Pola Permukiman — RESOLVED ✅
**Keputusan**: **Hybrid per-sektor**, bukan uniform.

| Sektor | Pola | Algoritma | Alasan Naratif |
|--------|------|-----------|----------------|
| **Pusat** | Clustered (padat) | Gaussian Distribution dari `(80, 60)` | Desa Indonesia: padat di pusat, renggang di pinggiran |
| **Utara** (Jalan Raya) | Linear | Distance-to-Line snap + offset noise | Warung/toko selalu *mengawal* jalan raya utama |
| **Timur** (Sungai) | Linear (meliuk) | Bezier + Distance-to-Curve | Permukiman bantaran sungai = ikut aliran |
| **Barat** (Hutan) | Scattered | Poisson Disk Sampling (min radius 5 sel) | Petani terisolasi, harus jalan jauh = risiko kesehatan |
| **Selatan** (Sawah) | Scattered + Clustered kecil | Poisson + mini-clusters (2-4 rumah) | Kelompok tani kecil di antara petak sawah |

#### Q2: Jarak = Biaya Energi — RESOLVED ✅
**Keputusan**: **Ya, dengan mitigasi progression.**

```
Base Energy Cost = homeVisitCost (dari constants.js) 
Distance Multiplier = 1.0 + (manhattanDistance / gridDiagonal) * TERRAIN_PENALTY

TERRAIN_PENALTY per sektor:
  Pusat  → 0.0  (no penalty)
  Utara  → 0.3  (jalan aspal, mudah)
  Timur  → 0.5  (tanah berlumpur dekat sungai)
  Barat  → 0.8  (hutan, jalan setapak)
  Selatan → 0.6  (pematang sawah)

Vehicle Mitigation (progression unlock):
  Jalan Kaki    → penalty 100% (default)
  Sepeda Onthel → penalty 60%  (unlock: Hari 20)
  Motor Dinas   → penalty 20%  (unlock: Hari 50 + Balance ≥ 2jt)
  Puskel (mobil) → penalty 0%  (unlock: Hari 80 + Balance ≥ 5jt)
```

#### Q3: Fog of War 3D — DECISION LOCKED, IMPLEMENTATION PARTIAL 🟡
**Keputusan saat ini**: **2D Blueprint = layar komando utama; 3D = mode inspector / reward / exhibition opsional.**

- Runtime aktif **belum** memakai pocket diorama 1 RW.
- `WilayahDiorama.jsx` saat ini masih menampilkan **desa penuh** sebagai layer presentasi.
- Semua informasi gameplay kritis (unlock RW, outbreak, intel, champion, service rings, travel friction) **harus tetap terbaca dan playable di 2D**.
- `3D` **tidak** memikul UI operasional seperti wabah, jentik, atau PIS-PK sebagai target default.
- Jika pocket diorama per-RW dikejar, targetnya adalah **turntable inspector / sidebar scene / exhibition mode**, bukan parity taktis penuh.

### 🔄 Unlock RW

#### Q4: Framing Unlock — PARTIALLY RESOLVED 🟡
**Keputusan**: **"Ekspansi Pendataan PIS-PK"**

- RW 01-02: data lengkap sejak awal (30 KK).
- RW 03-08: "Blank Spot Data" — pasien dari RW ini **tetap muncul di UGD/Poli**, namun:
  - EMR mereka tidak punya data SDoH/IKS
  - Behavior Change Case tidak bisa dijalankan (tidak ada baseline)
  - Di runtime saat ini, rumah/keluarga terkunci terutama dibaca lewat status `isLocked`, marker abu-abu, dan interaksi yang dinonaktifkan
- Presentasi area abu-abu besar + label "📋 Belum Terdata" masih **provisional**, belum menjadi overlay final
- Pemain mendanai "Operasi Sensus Kader" (biaya + waktu) → RW ter-*unlock*

### 🏗️ Fasilitas

#### Q5: Penempatan Faskes Satelit — RESOLVED ✅  
**Keputusan**: Pustu di **Barat** (dekat hutan), Polindes di **Selatan** (dekat sawah). Keduanya berfungsi sebagai **Forward Operating Base (FOB)** yang harus di-upgrade dan di-staf-kan sebelum aktif.

**Upgrade Path**:
1. `Level 0` — Gedung kosong, tidak berfungsi
2. `Level 1` — Staf ditugaskan → bisa jadi transit point (pemulihan energi kecil +10)
3. `Level 2` — Investasi dana → layanan ANC/KIA/pengobatan dasar tersedia

#### Q6: Upgrade Visual Fasilitas — PARTIALLY RESOLVED 🟡
**Keputusan**: **Ya, sebagai dopamine payoff UKM**, tetapi runtime baru sampai ke layer **progress/readiness**. Set sprite/visual payoff penuh masih target sprint lanjutan.

| Fasilitas | Trigger Sukses | Visual Upgrade | Buff AoE |
|-----------|----------------|----------------|----------|
| MCK | Skenario STBM berhasil | `mck_basic` → `mck_keramik` | `jamban: true` untuk seluruh RT |
| PAMSIMAS | Skenario Air Bersih berhasil | `pamsimas_rusak` → `pamsimas_aktif` | `air: true` untuk seluruh RW |
| Posyandu | 3× kunjungan sukses berturut | `posyandu_sederhana` → `posyandu_mandiri` | XP bonus +50% di Posyandu scene |
| SDN | Skenario Cuci Tangan berhasil | Poster baru di dinding virtual | `jentik: true` untuk area sekolah |

### 🎮 Gameplay Loop

#### Q7: Cadence Harian — RESOLVED ✅
**Keputusan**: **Time-Tradeoff Dilemma** (bukan slot wajib).

```
Peta Waktu Harian:
07:00-08:00  Morning Briefing (auto: Director evaluates, IKM events spawn)
08:00-13:00  PAGI → Poli / UGD (revenue window — UKP)
13:00-16:00  SORE → Kunjungan Desa / Inspeksi (investment window — UKM)
16:00-17:00  Admin / Pelaporan
17:00+       Waktu Pribadi (Rumah Dinas, tidur)

Kalender UKM (fixed schedule):
  Senin    → Hari Poli penuh (tidak ada UKM)
  Selasa   → Posyandu RW ganjil (01, 03, 05, 07)
  Rabu     → Kunjungan Rumah / Inspeksi bebas
  Kamis    → Posyandu RW genap (02, 04, 06, 08)
  Jumat    → Prolanis / Posbindu Lansia
  Sabtu    → Setengah hari + Weekend Activity
  Minggu   → Libur (tapi bisa emergency call)
```

> [!IMPORTANT]
> **Core Tension**: Jika pemain serakah menambang pasien di Poli seharian dan *skip* jadwal Posyandu, IKS RW terkait anjlok → outbreak risk naik → Director meningkatkan pressure. *"Anda mengobati satu pasien hari ini, tapi menciptakan sepuluh pasien besok."*

#### Q8: Staf Pasif vs Dokter Aktif — RESOLVED ✅
**Keputusan**: **Defense/Offense Paradigm.**

```
STAF (Defense) = Mencegah Decay
  → Indikator PIS-PK yang sudah HIJAU tetap hijau
  → Drift rate ditekan dari 5% → 1% untuk indikator yang di-cover staf
  → TIDAK BISA mengubah indikator MERAH → HIJAU

DOKTER (Offense) = Menciptakan Kemajuan
  → Kunjungan Rumah langsung: MERAH → HIJAU
  → Behavior Change Case: perubahan perilaku permanen
  → Building Scene completion: AoE buff ke seluruh RT/RW
```

#### Q9: Event Spawning at Map — PARTIALLY RESOLVED 🟡
**Keputusan**: **Anchor di lokasi + notifikasi ganda**, tetapi implementasi runtime saat ini belum merata.

1. Cue visual outbreak/surveillance di peta 2D **sudah hidup**.
2. HUD/briefing dan panel `Wilayah` sudah memberi notifikasi sekunder yang cukup jelas.
3. Anchor `🚨` generik di atas atap bangunan untuk semua IKM/community event masih **belum final**.
4. Loop desain tetap dipertahankan: pemain diarahkan **navigasi ke lokasi** untuk menyelesaikan masalah komunitas.

#### Q10: Death & Consequence — PROVISIONAL 🟠
**Keputusan desain**: **"Bendera Kuning" + Zona Distrust** tetap dipertahankan sebagai intent, tetapi **belum hidup penuh di runtime peta**.

- Hukuman mortalitas dan konsekuensi sistemik sudah punya pondasi di gameplay klinis/komunitas.
- Marker duka rumah, radius distrust tetangga, dan loop recovery via kunjungan rumah masih **belum menjadi feedback spasial final**.
- Prinsip yang tetap final: **tidak boleh ada death spiral yang tidak bisa dipulihkan pemain**.

### 📊 Data & Visualisasi

#### Q11: Detective Mode — RESOLVED ✅ (Reframed)
**Keputusan runtime**: **operational overlays berbasis layer**, bukan lagi hanya 3 lensa konseptual.

| Layer | Tombol | Visual dominan | Data Source |
|-------|--------|----------------|-------------|
| 🧭 **General** | `[1]` | Peta normal + cue dasar lokasi | `mapData.buildings` |
| 🏠 **PIS-PK** | `[2]` | Ring hijau/kuning/merah berdasarkan skor keluarga | `family.iksScore` |
| 🦠 **Surveilans** | `[3]` | Pulse merah + rumah/faskes dengan kasus aktif | `surveillanceStatus`, `outbreaks[]` |
| 🐛 **Jentik / PSN** | `[4]` | Ring merah/hijau berdasarkan `hasJentik` | `building.hasJentik` |
| ❤️ **PHBS** | `[5]` | Ring hijau/kuning/merah berdasar `phbsScore` | `family.phbsScore` |
| 👥 **Perilaku** | `[6]` | Ring risiko perilaku tinggi/sedang | `family.behaviorRisk` |

Layer aktif tetap **1 pada satu waktu**. Catatan penting: 2D tetap layar komando paling lengkap; 3D boleh punya cue pendukung, tetapi **tidak lagi diposisikan sebagai target parity operasional penuh**.

#### Q12: Semantic Zoom — FINALIZED PRACTICAL ✅
**Keputusan runtime**: **threshold-based rendering 3 tahap praktis**.

| Zoom Level | Render Mode | Detail |
|------------|-------------|--------|
| `< 0.6` (overview) | **Selective markers** | Fasilitas utama + rumah kritis/rentan + target intel/champion tetap terlihat. Bridge detail disederhanakan. |
| `0.6 – < 1.15` (operational) | **Full markers** | Semua rumah dan bangunan aktif dirender, interaktivitas penuh, cue operasional tetap terbaca. |
| `>= 1.15` (detail) | **Close detail** | Marker penuh + label lokal/event otomatis untuk pembacaan dekat. |

**Implementation Pattern** (sinkron dengan runtime aktif):
> [!TIP]
> Semantic zoom tetap berjalan **dalam satu komponen** `Map2DBlueprint.jsx`, tetapi kini dikunci sebagai 3 level praktis:
> ```jsx
> const level = getSemanticZoomLevel(zoom);
> const isOverview = level === 'overview';
> const isDetail = level === 'detail';
>
> if (!isOverview) return mapData.buildings;
>
> return mapData.buildings.filter((b) => {
>   const isFacility = !b.familyId;
>   const isCritical = b.hasCase || (b.familyData?.iksScore ?? 1) < 0.5;
>   const isVulnerable = ['Low', 'Very Low'].includes(b.familyData?.economy);
>   const isIntelTarget = intelTargetMap.has(b.familyId);
>   const isChampion = championFamilyIdSet.has(b.familyId);
>   return isFacility || isCritical || isVulnerable || isIntelTarget || isChampion;
> });
> ```
> Detail otomatis seperti label event IKM baru tampil di level `detail`, bukan sejak zoom operasional.

### Data Crosscheck: RW ↔ Keluarga ↔ Sektor (Audit Codebase 2026-03-31)

> [!IMPORTANT]
> Hasil crosscheck `VillageRegistry.js` + `village_families.js` + `village_families_expanded.js` terhadap blueprint planologi.

#### Distribusi 200 KK per RW (Aktual Codebase)

| RW | KK Count | Sektor Blueprint | Unlock Threshold | Catatan |
|----|----------|-----------------|------------------|---------|
| 01 | 22 | **PUSAT** (Hub) | Day 0, Rep 0 | Starter area. Overweight — OK karena hub |
| 02 | 8 | **TIMUR** (Sungai) | Day 0, Rep 0 | Low count — sesuai (daerah sungai, jarang) |
| 03 | 28 | **UTARA** (Hutan) | Day 15, Rep 30 | First unlock |
| 04 | 28 | **UTARA** (Hutan) | Day 30, Rep 40 | |
| 05 | 28 | **BARAT** (Pedalaman) | Day 45, Rep 50 | |
| 06 | 28 | **BARAT** (Pedalaman) | Day 60, Rep 55 | |
| 07 | 28 | **SELATAN** (Sawah) | Day 75, Rep 60 | |
| 08 | 30 | **SELATAN** (Sawah) | Day 90, Rep 65 | Endgame. Sudah termasuk `kk_199` dan `kk_200` |

> [!NOTE]
> Catatan bug lama **RW 09 orphan** sudah stale. Runtime aktif sekarang menempatkan `kk_199` dan `kk_200` di **RW 08**, sehingga distribusi aktif kembali konsisten ke RW `01`–`08`.

#### Distribusi Ekonomi SDoH (Aktual Codebase)

| Economy Level | Count | % | Peta LED Node Color | CSS Class |
|--------------|-------|---|--------------------|-----------|
| High | 29 | 14.5% | `#38bdf8` (sky blue) | `--high` |
| Middle | 89 | 44.5% | `#a3a3a3` (neutral gray) | `--middle` |
| Low-Middle | 53 | 26.5% | `#94a3b8` (slate) | `--lowmid` |
| Low | 23 | 11.5% | `#fbbf24` (amber) | `--low` |
| Very Low | 6 | 3.0% | `#f87171` (red) | `--verylow` |

#### House Placement Contract
- **Procedural generation** (`map-utils.js`) WAJIB menempatkan rumah di **sektor yang benar** berdasarkan RW assignment di data keluarga.
- Mapping rule: `family.rw` → Sektor (lihat tabel di atas) → coordinate bounds di planologi.
- **Static seed** (`_seed = 12345`) WAJIB digunakan selama development agar layout konsisten saat HMR/hot-reload Vite.

#### 3 Hukum Geospasial SDoH (dari DT R12)

> [!IMPORTANT]
> **"Your ZIP code is a better predictor of your health than your genetic code."** — Dr. Tony Iton.
> Koordinat `(x, y)` rumah di peta = **Mesin Kalkulator Risiko Kematian**. Bukan sekadar titik visual.

##### Hukum 1: Spatial Segregation (Gentrifikasi Algoritmik)
**Implementasi**: `map-utils.js` → `generateVillageMap()`

Saat menyebar 200 rumah, **WAJIB** baca `FAMILY_SDOH[familyId].economy`:

| Economy | Placement Bias | Proximity To |
|---------|---------------|--------------|
| `High` / `Middle` | **Dekat jalan raya & Puskesmas** | Sektor PUSAT, jalan aspal |
| `Low-Middle` | **Tengah-tengah** | Antara jalan dan pinggiran |
| `Low` | **Pinggiran** | Dekat sungai / tepi hutan |
| `Very Low` | **Ujung terpencil** | Bantaran Sungai Cikapas / tepi Hutan Lindung |

**Efek visual**: Saat Detective Mode SDoH dinyalakan → terlihat "kawasan kumuh" terbentuk natural di pinggiran peta. Visualisasi ketidakadilan sosial yang indah sekaligus tragis.

##### Hukum 2: Hazard Proximity (Radius Kutukan Alam)
**Implementasi**: `PatientGenerator.js` → disease probability modifier

Hitung Manhattan Distance rumah ke Hazard feature di peta:

| Jarak ke Feature | Multiplier | Penyakit Terdampak |
|-----------------|------------|-------------------|
| `< 6 sel` dari **Sungai Cikapas** | **×3.0** | Diare, Tifoid, Leptospirosis |
| `< 8 sel` dari **Hutan Lindung** | **×3.0** | Malaria, Keracunan Pestisida |
| `< 5 sel` dari **Pasar Hewan** | **×2.5** | Avian Influenza, Brucellosis |
| `< 4 sel` dari **Dukun Beranak** | **×2.0** | Komplikasi persalinan (rujukan terlambat) |

**Efek gameplay**: *"Pantas saja RT 06 diare melulu — rumah mereka mepet bantaran sungai! Edukasi cuci tangan tidak mempan melawan geografi!"*

##### Hukum 3: Distance Decay (Hukum Kematian Karena Jarak)
**Implementasi**: `publicHealthHelpers.js` → `applyFamilyIndicatorDrift()` + `PatientGenerator.js` → severity modifier

Hitung Manhattan Distance rumah ke Puskesmas `(100, 30)`:

| Jarak | Efek Preventif (UKM) | Efek Kuratif (UKP) |
|-------|---------------------|-------------------|
| `< 20 sel` | IKS drift = normal (1×) | Severity = normal |
| `20–40 sel` | IKS drift **×1.5** | Severity +1 stage (mild → moderate) |
| `> 40 sel` | IKS drift **×2.0** | Severity +2 stages (DHF → DSS Kritis) |

**Mitigation**: Upgrade Pustu/Polindes (FOB) di pinggiran → radius mereka menjadi "faskes terdekat" baru → mengurangi distance penalty.

**Efek gameplay**: Pemain dipaksa strategis mengalokasikan dana upgrade FOB di pinggiran desa untuk memotong jarak pelayanan.

## III. PLANOLOGI DESA SUKAMAJU (Grid 160×120)

### A. Peta Master — Koordinat Seluruh Bangunan

> [!IMPORTANT]
> Grid `160×120` sel. Titik `(0,0)` = pojok kiri atas. `(159,119)` = pojok kanan bawah.
> Terrain: Hutan di Barat (`x < 15`), Sungai Cikapas di Timur (`x > 145`), Sawah di Selatan (`y > 90`).

```
    0         20        40        60        80       100       120       140     159
  0 ┌─────────┬─────────┬──HUTAN──┬─────────┬─────────┬─────────┬─────────┬──SUN─┐
    │🌲🌲🌲🌲🌲│ TPU    │🌲🌲🌲🌲🌲│ TOGA   │ R.Dinas │         │ Sumur  │🌊🌊🌊│
 10 │🌲🌲🌲🌲🌲│        │ PESANTRN│        │         │         │        │🌊🌊🌊│
    │🌲HUTANL│        │🕌       │        │         │         │        │🌊🌊🌊│
    │🌲🌲🌲🌲🌲│        │ RW 01  │ RW 01  │  RW 01  │  RW 01  │        │🌊🌊🌊│
    │         │ Gapura │---------│ RW 03  │         │  RW 03  │        │🌊🌊🌊│
 25 │═══JALAN═══RAYA════TRANS═══DESA═══════════════SUKAMAJU══════════════│JEMBT │
    │         │  POS   │ SDN    │         │P.KADER │ PKESMAS │ MASJID │ 🌉  │🌊│
    │ RW 03  │ RONDA  │ TK     │B.DESA  │ DASHAT │ 🏥     │ IKS   │     │🌊│
 35 │         │  B     │        │K.DESA  │ ALUN²  │        │ LAPNGN│     │🌊│
    │         │        │        │        │        │HOMESTAY│       │ RW 02│🌊│
    │ RW 05  │        │        │ PASAR  │MCK PSR │ ☕WK   │       │PAMSI│🌊│
 45 │         │        │        │ APOTEK │        │ WARUNG │  KB   │BANK │🌊│
    │ PUSTU  │        │        │ TOKO K │        │B.SAMPAH│ POST  │SMPH │🌊│
    │ 🏥(FOB)│        │        │        │POS RONDA│        │POLIND │     │🌊│
 55 │         │        │        │ RW 05  │  U/S   │        │ 🏥FOB│     │🌊│
    │         │        │        │        │        │        │       │     │🌊│
    │RW 05   │POS     │        │        │WATERFL │ RW 04  │ RW 04│     │🌊│
 65 │        │RONDA   │ RW 07  │ RW 07  │  🏞️   │ RW 06  │ RW 06│     │🌊│
    │        │  T     │        │PKRONDA │ AIR    │        │      │WISATA│🌊│
    │        │        │        │  S     │ TERJUN │        │      │DERMG │🌊│
 75 │        │        │        │        │        │        │      │  ⚓  │🌊│
    ├────────┴────────┼────────┴────────┼────────┴────────┼──────┴──────┤🌊│
    │🌾🌾🌾🌾🌾🌾🌾🌾🌾│ SAWAH BERUNDAK│🌾🌾🌾🌾🌾🌾🌾🌾│ 🌾🌾🌾🌾🌾│🌊│
 85 │🌾 FARM  🌾🌾🌾🌾│🌾🌾🌾🌾🌾🌾🌾🌾│🌾🌾🌾🌾🌾🌾🌾🌾│🌾🌾🌾🌾🌾🌾│🌊│
    │🌾  RW 08 🌾🌾🌾│ POS GIZI  🌾│🌾 POS UKK 🌾🌾│🌾🌾🌾🌾🌾🌾│🌊│
 95 │🌾 POLINDS 🌾🌾│🌾 DUKUN 🏚️ 🌾│🌾 RTK   🌾🌾🌾│🌾RW 08🌾🌾│🌊│
    │🌾  🏥(FOB) 🌾🌾│🌾  BERANAK  🌾│🌾🌾🌾🌾🌾🌾🌾🌾│🌾🌾🌾🌾🌾🌾│🌊│
105 │🌾🌾🌾🌾🌾🌾🌾🌾🌾│🌾POS RONDA S🌾│🌾🌾🌾🌾🌾🌾🌾🌾│🌾🌾🌾🌾🌾🌾│🌊│
    │🌾🌾🌾🌾🌾🌾🌾🌾🌾│🌾🌾🌾🌾🌾🌾🌾🌾│🌾🌾🌾🌾🌾🌾🌾🌾│🌾🌾🌾🌾🌾🌾│🌊│
119 └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────┘
```

### B. Tabel Koordinat Lengkap Seluruh Bangunan

#### Sektor PUSAT (Hub) — Radius 20 sel dari (80, 32)

| ID | Tipe | Koordinat (x,y) | Nama | Catatan |
|----|------|-----------------|------|---------|
| `puskesmas` | PUSKESMAS | (100, 30) | Puskesmas Sukamaju | Player base, sisi kanan hub |
| `rumah_dinas` | RUMAH_DINAS | (75, 8) | Rumah Dinas Dokter | Di atas, dekat hutan (tenang) |
| `balai_desa` | BALAI_DESA | (68, 32) | Balai Desa | Sisi kiri hub |
| `kantor_desa` | KANTOR_DESA | (65, 32) | Kantor Desa | Sebelah Balai Desa |
| `mosque` | MOSQUE | (115, 30) | Masjid Al-Ikhlas | Sisi kanan, dekat sungai |
| `sdn_sukamaju` | SCHOOL | (55, 28) | SDN Sukamaju 01 | Barat-pusat |
| `tk_sukamaju` | TK | (52, 33) | TK Pertiwi | Dekat SDN |
| `alun_alun` | ALUN_ALUN | (85, 36) | Alun-alun Desa | Pusat kegiatan |
| `iks_scoreboard` | IKS_SCOREBOARD | (95, 34) | Scoreboard IKS | Dekat Puskesmas |
| `dashat_utama` | DASHAT | (82, 30) | DASHAT Balita | Dekat Puskesmas |
| `pos_kader` | POSYANDU | (88, 28) | Pos Kader Pusat | Posyandu hub |
| `homestay_desa` | **HOMESTAY** | (105, 38) | Homestay Sukamaju | **🆕 Desa Wisata** |
| `warung_kopi` | **POS_RONDA** | (100, 42) | Warung Kopi Mbah | **🆕 Intelligence Hub** |

#### Sektor UTARA (Jalan Raya Trans, y ≈ 20–28) — Linear Settlement

| ID | Tipe | Koordinat (x,y) | Nama | Catatan |
|----|------|-----------------|------|---------|
| `gapura_desa` | GAPURA_DESA | (18, 25) | Gapura Masuk Desa | Pintu masuk barat |
| `pasar` | MARKET | (70, 42) | Pasar Desa Sukamaju | Pusat ekonomi |
| `apotek` | APOTEK | (70, 46) | Apotek Sehat | Sebelah pasar |
| `toko_kelontong` | TOKO_KELONTONG | (72, 48) | Toko Kelontong Pak Joko | — |
| `mck_pasar` | MCK | (75, 42) | MCK Pasar | Sanitasi pasar |
| `warung_utama` | WARUNG | (105, 44) | Warung Bu Warung | Kuliner desa |
| `kb_post` | KB_POST | (120, 44) | Pos KB Desa | — |

#### Sektor BARAT (Hutan Lindung, x < 40) — Scattered/Poisson

| ID | Tipe | Koordinat (x,y) | Nama | Catatan |
|----|------|-----------------|------|---------|
| `hutan_lindung` | HUTAN_LINDUNG | (5, 8) | Hutan Lindung Sukamaju | Zona malaria |
| `pesantren` | **PESANTREN** | (30, 12) | Ponpes Al-Hikam | **🆕 Hazard Hub** |
| `tpu_desa` | TPU | (20, 5) | TPU Desa Sukamaju | Jauh dari pusat |
| `toga_rt01` | TOGA | (55, 8) | Kebun TOGA Lestari | Herbal garden |
| `pustu_utama` | PUSTU | (28, 50) | Pustu Sukamaju | **FOB Level 0** |
| `pos_ronda_barat` | **POS_RONDA** | (32, 60) | Pos Ronda Barat | **🆕 Intel** |

#### Sektor TIMUR (Sungai Cikapas, x > 120) — Distance-to-Curve

| ID | Tipe | Koordinat (x,y) | Nama | Catatan |
|----|------|-----------------|------|---------|
| `sungai_cikapas` | SUNGAI_CIKAPAS | (152, 40) | Sungai Cikapas | Landmark alam |
| `jembatan_gantung` | JEMBATAN | (148, 25) | Jembatan Gantung | **Seasonal hazard** |
| `pamsimas` | PAMSIMAS | (135, 42) | PAMSIMAS Tirta Jaya | Sumber air |
| `bank_sampah` | BANK_SAMPAH | (135, 48) | Bank Sampah Berkah | — |
| `well_rt02` | WELL | (130, 8) | Sumur Resapan | — |
| `waterfall` | WATERFALL | (90, 62) | Air Terjun Cikapas | **🆕 Wisata alam** |
| `dermaga_wisata` | **DERMAGA** | (145, 72) | Dermaga Wisata | **🆕 Entry point turis sungai** |
| `pos_ronda_timur` | **POS_RONDA** | (130, 55) | Pos Ronda Timur | **🆕 Intel** |

#### Sektor SELATAN (Sawah Berundak, y > 80) — Scattered + Mini-cluster

| ID | Tipe | Koordinat (x,y) | Nama | Catatan |
|----|------|-----------------|------|---------|
| `sawah_berundak` | SAWAH_BERUNDAK | (40, 82) | Sawah Berundak Indah | Landmark wisata + pertanian |
| `farm` | FARM | (25, 88) | Lahan Tani Pak Slamet | Hazard pestisida |
| `polindes` | POLINDES | (25, 95) | Polindes Desa | **FOB Level 0** |
| `rtk_utama` | RTK | (90, 95) | RTK (Rumah Tunggu Kelahiran) | Dekat Polindes |
| `pos_gizi` | POS_GIZI | (60, 90) | Pos Gizi Bunda | — |
| `pos_ukk` | POS_UKK | (90, 88) | Pos UKK Tani Makmur | K3 petani |
| `padepokan_dukun` | **PADEPOKAN_DUKUN** | (60, 95) | Padepokan Mak Sinem | **🆕 Hazard Hub, rival Polindes** |
| `pos_ronda_selatan` | **POS_RONDA** | (65, 105) | Pos Ronda Selatan | **🆕 Intel** |
| `playground` | PLAYGROUND | (80, 85) | Taman Bermain Desa | — |
| `lapangan` | LAPANGAN | (110, 35) | Lapangan Sepak Bola | — |

### C. RW Cluster Center Points (untuk Hybrid Placement Algorithm)

| RW | Sektor | Center (x,y) | Jumlah KK | Pola Settlement | Fasilitas Lokal |
|----|--------|-------------|-----------|-----------------|-----------------|
| 01 | Barat-Pusat | (55, 18) | 22 | Clustered | Pesantren, Hutan |
| 02 | Timur | (135, 35) | 8 | Linear (sungai) | Pamsimas, Bank Sampah |
| 03 | Barat | (35, 30) | 28 | Scattered | Pustu |
| 04 | Timur | (125, 60) | 28 | Linear (sungai) | Dermaga Wisata |
| 05 | Barat | (35, 55) | 28 | Scattered | Pos Ronda Barat |
| 06 | Timur | (125, 65) | 28 | Linear (sungai) | Air Terjun |
| 07 | Utara-Pusat | (75, 65) | 28 | Clustered | Pos Ronda Utara/Selatan |
| 08 | Selatan | (50, 95) | 28 | Scattered + mini | Polindes, Dukun, Farm |
| 09 | Utara | (100, 15) | 2 | Special | Homestay area |

### D. Terrain Features (Garis Besar)

| Feature | Definisi Grid | Catatan |
|---------|--------------|---------|
| Hutan Lindung | `x < 15`, seluruh `y` | Perlin noise density, thinning ke timur |
| Sungai Cikapas | `x > 148` (meliuk ±3 sel) | Bezier dari (150,0) ke (152,119) |
| Jalan Raya Trans | `y = 25`, seluruh `x` | Horizontal, aspal, memotong desa |
| Jalan Desa (vertikal) | `x = 80`, `y = 5 → 115` | Vertikal utama, penghubung N-S |
| Sawah Berundak | `y > 82`, `x = 15 → 140` | Grid padi terasi, hijau kekuningan |
| Air Terjun | (90, 62) | Pecahan sungai, spot wisata alam |

---

## III-B. KONSEP "DESA WISATA SUKAMAJU" 🏞️

### Narasi Framing

> [!IMPORTANT]
> Desa Sukamaju bukan desa "biasa". Ia adalah **Desa Wisata** yang ditetapkan oleh Kemenparekraf berdasarkan kekayaan alam (Air Terjun Cikapas, Sawah Berundak, Hutan Lindung) dan budaya lokal (Pesantren Salaf, Padepokan Dukun, kerajinan TOGA). Ini bukan desa "ideal steril" — ini desa nyata dengan segala kekacauan sosiokultural, yang kebetulan punya potensi wisata sehingga menarik pelancong domestik dan mancanegara.

### Mengapa Desa Wisata?

1. **Realisme Indonesia**: Ribuan desa di Indonesia sudah berstatus Desa Wisata. Konteks ini sangat familiar dan bisa diterima audiens lokal maupun internasional.
2. **Diversifikasi Pasien**: Bukan hanya warga lokal yang berobat. **Wisatawan** (domestik + asing) juga datang ke Puskesmas saat sakit.
3. **Travel Medicine**: Niche klinis yang sangat relevan dan jarang disimulasikan di game medis manapun.
4. **Pamer ke Global**: Peta yang "indah" dan "hidup" karena memang dirancang sebagai destinasi wisata.
5. **Ekonomi Desa**: Pendapatan wisata = dana tambahan yang bisa digunakan pemain untuk upgrade fasilitas.

### Building Types Baru untuk Desa Wisata

| Building Type | ID | Lokasi | Fungsi Gameplay |
|---------------|----|--------|-----------------|
| **Homestay Desa** | `homestay` | (105, 38) Pusat | Tempat menginap turis. Sumber pasien wisatawan. |
| **Dermaga Wisata** | `dermaga_wisata` | (145, 72) Timur | Entry point turis via sungai. Seasonal (tutup saat banjir). |
| **Gardu Pandang** | `gardu_pandang` | (90, 65) dekat Air Terjun | Spot foto wisata. Risiko trauma jatuh (selfie accident). |
| **Pusat Informasi Wisata** | `info_wisata` | (20, 25) dekat Gapura | Pemain bisa lihat jadwal turis yg datang & forecast demand. |
| **Pasar Hewan Komunal** | `pasar_hewan` | (35, 90) Selatan, dekat Farm | **🆕 One Health Hub** — zoonosis dari peternakan tradisional. |

**Total Building Types**: 42 + 5 wisata/one-health = **47 tipe bangunan.**

### Travel Medicine Cases (Integrasi PatientGenerator)

Saat Desa Wisata aktif, `PatientGenerator.js` mendapat pool pasien tambahan bertipe `source: 'tourist'`:

| Kasus Travel Medicine | ICD-10 | Kategori | Trigger |
|-----------------------|--------|----------|---------|
| Traveler's Diarrhea | A09 | Digestive | Turis makan di Warung/Pasar |
| Dengue Fever (non-immune) | A90 | Infection | Turis non-endemis, musim hujan |
| Malaria Falciparum | B50 | Infection | Turis ke Hutan / trekking |
| Cedera Trekking | S93 | Trauma | Turis di Air Terjun / Sawah |
| Heat Exhaustion | T67 | Environmental | Turis kemarau, dehidrasi |
| Envenomation (ular/lebah) | T63 | Environmental | Turis di Hutan Lindung |
| Selfie Accident (jatuh) | W17 | Trauma | Turis di Gardu Pandang |
| Allergic Reaction (makanan lokal) | T78 | Immune | Turis makan jamu/kuliner lokal |
| Scabies / Skin Infection | B86/L08 | Dermatology | Turis berenang di sungai |
| Rabies Exposure (gigitan anjing) | Z20.3 | Infection | Turis di pedesaan |
| Motion Sickness | T75.3 | Neurology | Turis naik perahu ke Dermaga |
| Altitude/Exhaustion Syncope | R55 | Cardiovascular | Turis naik Sawah Berundak |
| **Gigitan Kera (Rabies/Herpes B)** | **W55 + Z20.3** | **Zoonosis** | **Turis di Wana Wisata Air Terjun** |
| **Leptospirosis** | **A27** | **Zoonosis** | **Berenang di air terjun pasca-hujan** |
| **Cutaneous Anthrax** | **A22.0** | **Zoonosis** | **Warga kontak daging sapi mati mendadak** |
| **Avian Influenza (suspect H5N1)** | **J09** | **Zoonosis** | **Kontak unggas mati massal di Pasar Hewan** |
| **Brucellosis** | **A23** | **Zoonosis** | **Peternak kontak cairan kelahiran sapi** |

> [!TIP]
> **Keunggulan gameplay**: Pasien wisatawan biasanya **tidak punya riwayat SDOH** di VillageRegistry (mereka bukan warga). Dokter harus bergantung **sepenuhnya pada anamnesis klinis** — tanpa bantuan data SDoH atau Detective Mode. Ini melatih *clinical reasoning* murni tanpa *crutch* data komunitas.

### One Health: Dimensi Zoonosis & Wildlife Interface (dari DT R4)

Area **Wana Wisata** (Air Terjun + Hutan sekitarnya) dan **Pasar Hewan Komunal** menjadi episentrum *One Health* — interaksi manusia-hewan-lingkungan yang menghasilkan penyakit:

**Mekanik VAR (Vaksin Anti Rabies):**
- VAR harus ada di stok apotek Puskesmas. Harga mahal (Rp 250.000/vial), butuh rantai dingin.
- Jika turis digigit kera dan VAR habis → pemain harus SISRUTE darurat ke RS Kabupaten.
- Jika gagal rujuk tepat waktu → turis meninggal → Reputasi -15 + "Berita internasional".

**Mekanik Pasar Hewan:**
- Event IKM: "Sapi mati mendadak di Pasar Hewan, warga nekat menyembelih untuk tradisi."
- Jika pemain tidak intervensi dalam 1 hari → Cutaneous Anthrax muncul di 2-3 warga.
- Jika unggas mati massal tidak dilaporkan → suspect H5N1 → notifikasi W2 wajib ke Dinkes.
- Skenario COM-B: Meyakinkan warga untuk tidak mengonsumsi hewan mati mendadak.

> [!WARNING]
> **Kasus Anthrax dan H5N1 adalah notifiable diseases.** Jika pemain gagal melaporkan ke Dinkes dalam 24 jam game, ada penalti reputasi tambahan -10 dan kemungkinan "teguran tertulis" dari Dinas Kesehatan. Ini melatih pemain tentang kewajiban surveilans.

### Mekanik Wisatawan di Peta

```
FLOW WISATAWAN:
  1. Tourist spawn di Gapura/Dermaga (entry point)
  2. Mereka "mengunjungi" landmark wisata (Sawah, Air Terjun, Pesantren)
  3. Di setiap landmark, ada PROBABILITAS insiden travel medicine
  4. Jika sakit → pasien muncul di queue Puskesmas bertag [🌍 TOURIST]
  5. Penanganan sukses → Reputasi +5 (lebih tinggi dari warga biasa)
     karena "berita tersebar di TripAdvisor"
  6. Penanganan gagal → Reputasi -8 ("Bad review online")

VOLUME TURIS:
  Weekday: 1-2 turis/hari
  Weekend: 3-5 turis/hari
  High Season (libur sekolah): 5-8 turis/hari
  Festival Desa (event khusus): 10-15 turis/hari → STRESS TEST untuk Puskesmas
```

### Implikasi Revenue Desa

| Sumber Pendapatan | Jumlah | Catatan |
|-------------------|--------|---------|
| Tiket masuk Air Terjun | Rp 15.000/turis | Masuk Dana Desa |
| Homestay per malam | Rp 150.000/malam | Masuk ekonomi warga |
| Retribusi Dermaga | Rp 10.000/perahu | Seasonal |
| Jasa Guide (warga) | Rp 50.000/trip | Job creation |

> [!NOTE]
> Revenue wisata **tidak langsung masuk kas Puskesmas**, tapi meningkatkan `economy` rata-rata desa → mengurangi indikator kemiskinan → mengurangi risiko penyakit berbasis SDoH secara pasif. Pemain bisa "berinvestasi" di infrastruktur wisata untuk efek jangka panjang.

### Apakah Ini Mencerminkan Desa Pada Umumnya?

**Ya, dengan sengaja dirancang sebagai amalgamasi representatif:**

| Elemen | Referensi Nyata | Realism Score |
|--------|-----------------|---------------|
| Sawah Berundak | Jatiluwih (Bali), Majalengka (Jabar) | ⭐⭐⭐⭐⭐ |
| Sungai Penghubung | Desa Kalimantan, Sulawesi, Sumatra | ⭐⭐⭐⭐⭐ |
| Hutan Lindung + Malaria | Desa Papua, NTT, Kalimantan | ⭐⭐⭐⭐⭐ |
| Pesantren Salaf | Jawa Timur, Jawa Tengah | ⭐⭐⭐⭐⭐ |
| Dukun Beranak | Universal Indonesia, terutama pelosok | ⭐⭐⭐⭐⭐ |
| Jembatan Gantung rusak | NTT, Papua, Sulawesi | ⭐⭐⭐⭐⭐ |
| Desa Wisata | >3.000 desa di Indonesia (Kemenparekraf) | ⭐⭐⭐⭐⭐ |
| Pasung ODGJ | Masih terjadi di >15.000 kasus (Riskesdas) | ⭐⭐⭐⭐⭐ |
| Pos Ronda tempat nongkrong | Universal desa Jawa/Bali/Sumatra | ⭐⭐⭐⭐⭐ |

**Desa Sukamaju adalah "Indonesia dalam 1 halaman" — bukan 1 desa spesifik, tapi komposit terbaik dari keragaman geokultural Nusantara.**

---

## III-C. ALGORITMA PENEMPATAN (Spesifikasi Teknis)

### Fungsi Utama: `generateVillageMap()` v2.0

```
INPUT:  width=160, height=120, seed, villageData (200 families)
OUTPUT: { tiles[][], buildings[], roadPaths[], sectorBounds }

STEP 1: Generate Terrain Base
  - Sungai Cikapas (Bezier curve x=148→152, y=0→119)
  - Hutan Lindung (Perlin noise x < 15)
  - Sawah Berundak (grid pattern y > 82)
  - Jalan Raya Trans (horizontal y=25)

STEP 2: Place ALL Buildings (from Planology Table above)
  - Hub buildings: hardcoded coordinates
  - Sector facilities: hardcoded per-sector
  - Hazard hubs: hardcoded strategic positions
  - Desa Wisata buildings: hardcoded at entry/attraction points

STEP 3: Generate Road Network
  - Jalan utama (aspal): y=25 horizontal + x=80 vertical
  - Jalan desa: Bezier dari hub → setiap RW center
  - Jalan setapak: RW center → cluster rumah
  - Jalan wisata: Hub → Air Terjun → Dermaga (path khusus)

STEP 4: Place 200 Families (HYBRID ALGORITHM per-sector)
  - Barat: Poisson Disk Sampling (min 5 sel)
  - Timur: Distance-to-Curve (Sungai ±8 sel)
  - Utara: Distance-to-Line (Jalan ±5 sel)
  - Selatan: Poisson + mini-cluster (2-4 rumah)
  - House type: SDOH economy → visual mapping

STEP 5: Place 1 Posyandu per RW (centroid of cluster)

STEP 6: Road Smoothing & Decorative Accents
```

### Algoritma Poisson Disk Sampling (Barat/Selatan)

```javascript
function poissonDiskSample(bounds, minDist, maxAttempts, rng) {
  // Bridson's algorithm with seeded RNG
  // bounds: { x1, y1, x2, y2 }
  // minDist: minimum distance between points (e.g., 5 cells)
  // Returns: Array of {x, y} positions
}
```

### Algoritma Distance-to-Curve (Timur/Sungai)

```javascript
function placeAlongCurve(curvePoints, families, maxOffset, rng) {
  // curvePoints: Array of {x, y} defining Bezier river path
  // families: families to place
  // maxOffset: max perpendicular distance from curve (e.g., 8 cells)
  // Returns: Array of {x, y, familyId} positions
}
```

---

## IV. DEEPTHINK ROUND 2: TRI-LAYER ARCHITECTURE (VALIDASI)

DeepThink R2 merekomendasikan arsitektur **Makro-Meso-Mikro**. Setelah runtime audit April 2026, visi ini **masih relevan**, tetapi status implementasinya tidak lagi 100% sama dengan blueprint awal:

| Layer DT R2 | Padanan di runtime saat ini | Status |
|-------------|-----------------------------|--------|
| **Macro** (peta overview + lensa overlay) | 2D blueprint + operational overlays + overview/detail zoom | ✅ Hidup |
| **Meso** (diorama navigasi / inspector) | 3D full-village diorama opsional saat ini, dengan arah jangka lanjut ke **inspector/reward scene**, **bukan** pocket RW-only taktis | 🟡 Parsial |
| **Micro** (building scene interior) | Subset building scenes aktif (`Posyandu`, `Pustu`, `Polindes`, behavior/community panels) | 🟡 Parsial |

> [!NOTE]
> Perubahan arsitektural utamanya adalah **penguncian 2D sebagai layar komando** dan **reposisi 3D sebagai layer inspector/showcase**. Jadi 3D tidak lagi dibaca sebagai parity debt yang harus mengejar semua overlay operasional 2D.

---

## V. DEEPTHINK ROUND 2: 6 HAZARD HUBS (TRIAGE)

DT R2 mengusulkan 6 bangunan "Hazard Hub" baru untuk memperkaya *Karma Loop* dan memberi karakter unik *Global South*. Berikut triage setelah audit codebase:

### ✅ Diadopsi (4 dari 6)

#### Hub 1: 🏚️ Padepokan Dukun Beranak (Sektor Selatan)
- **Codebase Status**: Skenario `dukun_beranak` sudah ada di `IKMScenarioLibrary.js` (line 514) DAN `CulturalBeliefs.js` (line 170). Tapi **belum ada bangunan fisik** di peta.
- **Keputusan**: **ADOPT.** Tambahkan `BUILDING_TYPES.PADEPOKAN_DUKUN` di `constants.js`. Tempatkan di Sektor Selatan dekat Polindes (rival positioning).
- **Gameplay**: Faskes "saingan". Jika pemain memusuhi → bumil lari ke Dukun → `perdarahan_postpartum` muncul di IGD. Jika pemain jalankan skenario "Kemitraan Bidan-Dukun" → Dukun jadi "Mitra Perujuk" (visual upgrade + buff AoE: `persalinan: true` untuk seluruh RW).
- **UKP Bridge**: `Gagal mitra dukun → Ruptur uteri / PPH jam 2 pagi`

#### Hub 2: 🕌 Pondok Pesantren Salaf (Sektor Barat)
- **Codebase Status**: Tidak ada referensi pesantren/kyai/santri di seluruh codebase. **Sepenuhnya baru.**
- **Keputusan**: **ADOPT.** Tambahkan `BUILDING_TYPES.PESANTREN`. Tempatkan di Sektor Barat (komunitas tertutup di pinggiran).
- **Gameplay**: Asrama padat → epicenter wabah Scabies, TB, Hepatitis A. Pemain harus "Sowan ke Pak Kyai" (negosiasi COM-B khusus — jika gagal, santri menolak diobati). Keberhasilan → akses screening massal + buff `tb: true` untuk seluruh santri.
- **New Building Scene**: Interior pesantren (Asrama, Dapur Umum, Pondok Kyai) — 3 stasiun.
- **UKP Bridge**: `Gagal sowan kyai → Outbreak Scabies + TB masif`

#### Hub 3: 🌉 Jembatan Gantung Cikapas (Sektor Timur, di atas Sungai)
- **Codebase Status**: `BUILDING_TYPES.JEMBATAN` sudah ada di `constants.js:57`, termasuk 3D renderer di `BuildingRenderer.jsx:399`. **Hanya perlu peningkatan mekanik.**
- **Keputusan**: **ADOPT (enhance existing).** Jembatan yang sudah ada ditingkatkan menjadi *dynamic infrastructure* yang responsif terhadap musim.
- **Gameplay**:
  - Musim Kemarau: Jembatan normal, penalty 0%.
  - Musim Hujan: Status "Rawan Banjir" — energy cost ke RW Timur +100%.
  - Musim Hujan Ekstrem (event trigger): "Jembatan Putus!" — RW Timur **terisolasi 3 hari**. Rujukan ambulans delay. Pasien dari RW Timur tiba di UGD dalam kondisi lebih buruk (severity auto-upgrade).
- **Seasonal Integration**: `PatientGenerator.js` sudah punya `SEASONAL_MULTIPLIERS` (line 78). Jembatan putus = modifier tambahan.

#### Hub 4: ☕ Warung Kopi / Pos Ronda (1 per sektor, total 4)
- **Codebase Status**: Tidak ada. **Sepenuhnya baru.**
- **Keputusan**: **ADOPT.** Ini adalah mekanik **anti-grinding** yang jenius. Tambahkan `BUILDING_TYPES.POS_RONDA`.
- **Cost Formula**: **15 Energy + Rp 20.000 + 15 menit game** (≈ secangkir kopi + jajan).
- **Gameplay**: NPC memberikan "Gosip" dan seketika:
  - Data SDoH & IKS dari **5 rumah terdekat** langsung terbuka di Detective Mode
  - Kemungkinan trigger skenario IKM baru
  - Peluang dapat "intel": *"Pak, katanya Bu Rina tolak vaksin..."* → shortcut ke skenario yang relevan
- **Penempatan**: 1 per sektor (4 total = Pos Ronda Utara/Barat/Timur/Selatan). Posisi strategis di tengah-tengah cluster rumah.
- **Design Rationale**: Menghindari tedium "klik 200 rumah satu per satu". Warung sebagai *Community Intelligence Hub* — sangat khas Indonesia.
- **Konflik Resolusi (DT R3)**: R3 menyarankan biaya Rp 20.000 → **diadopsi** sebagai friction ringan agar tidak di-spam.

### ⚠️ Diadopsi dengan Modifikasi (1 dari 6)

#### Hub 5: ⛓️ Bilik Pasung — MODIFIKASI: Dynamic Hidden Prop
- **Codebase Status**: Indikator `jiwa` sudah ada di PIS-PK (13 indikator). Tapi tidak ada mekanik visual Pasung.
- **Keputusan DT R2**: Jangan jadikan bangunan *default*. Bilik Pasung muncul **secara dinamis** di belakang rumah keluarga yang indikator `jiwa`-nya merah selama ≥14 hari berturut-turut.
- **Modifikasi Saya**: **ADOPT tapi bukan building type baru.** Implementasikan sebagai **visual overlay** pada `Map2DMarker` — ikon ⛓️ kecil muncul di sudut marker rumah. Alasan: Pasung bukan "bangunan", melainkan kondisi keluarga.
- **Gameplay**: Kemunculan Pasung memerlukan intervensi cross-sector:
  1. Lapor ke Kades (Balai Desa)
  2. Koordinasi Polisi (auto — tidak perlu building baru)
  3. Kunjungan Rumah bersama perawat jiwa → skenario `pembebasan_pasung` → indikator `jiwa` → `true` + reputasi +20
- **Design Rationale**: Pasung adalah aib tersembunyi. Membuatnya sebagai bangunan tetap di peta justru menghilangkan dimensi "discovery".

### ❌ Ditangguhkan (1 dari 6)

#### Hub 6: 🏭 Tambang Pasir / Pabrik Tahu Informal — DEFERRED
- **Alasan**: Ini memerlukan implementasi **upstream pollution system** (limbah pabrik → warna sungai berubah → diare di hilir). Secara gameplay sangat menarik, tapi **kompleksitas implementasi tinggi** dan tidak kritis untuk MVP peta. Mekanik serupa sudah ter-cover oleh Pos UKK + skenario `pestisida_pertanian`.
- **Rekomendasi**: Masukkan ke **Phase 5 (Post-MVP)** jika waktu memungkinkan.

---

## VI. DAFTAR BUILDING TYPES FINAL (Update dari DT R2)

Setelah triage, 4 building type baru ditambahkan ke `constants.js`:

```javascript
// === NEW from DT R2 ===
PADEPOKAN_DUKUN: 'padepokan_dukun',   // Hub 1: Faskes saingan di Selatan
PESANTREN: 'pesantren',                 // Hub 2: Komunitas tertutup di Barat
POS_RONDA: 'pos_ronda',                 // Hub 4: Intelligence hub (4 instances)
// JEMBATAN sudah ada (Hub 3: enhance mekanik saja)
// Pasung = visual overlay, bukan building type
```

**Total Building Types**: 39 (existing) + 3 (baru) = **42 tipe bangunan unik.**

### Penempatan Hazard Hubs di Grid

```
┌────────────────────────────────────────────────────────┐
│  UTARA — RW 03, RW 04                                  │
│  ☕ Pos Ronda Utara                                     │
├───────────┬────────────────────────┬───────────────────┤
│  BARAT    │     PUSAT              │     TIMUR         │
│  🕌 Pesantren │  🏥 Puskesmas     │  🌉 Jembatan     │
│  ☕ Pos Ronda │                     │     Gantung      │
│    Barat   │                        │  ☕ Pos Ronda    │
│           │                        │     Timur         │
├───────────┴────────────────────────┴───────────────────┤
│  SELATAN — RW 07, RW 08                                 │
│  🏚️ Padepokan Dukun   ☕ Pos Ronda Selatan              │
└────────────────────────────────────────────────────────┘
```

---

## VII. PRIORITAS EKSEKUSI (Superseded 2026-04-04)

> [!IMPORTANT]
> Daftar phase 1-6 versi lama **bukan lagi source of truth**. Sebagian item di bawah sudah hidup di runtime, sementara sebagian lain masih aspirational. Source of truth eksekusi sekarang ada di [`wilayah_execution_plan_2026-04.md`](./wilayah_execution_plan_2026-04.md).

### Phase A: Lock Source of Truth
1. **Sprint 1 — Blueprint Lock + Cleanup**
   Sinkronkan blueprint, audit runtime, hapus status stale (`RW 09`, semantic zoom 3 tahap, pocket diorama final, terrain SVG violation lama).

### Phase B: Core `Wilayah` MVP Completion
2. **Sprint 2 — 2D Gameplay Completion**
   Finalkan source of truth 2D: visual cue unlock, parity overlay inti, activation subset bangunan yang sudah terpasang di topologi.
3. **Sprint 3 — Systemic Feedback Loop**
   Buat aksi pemain lebih terasa di desa: ledger, distrust/death consequences, readiness, behavior change, service coverage, dan feedback spasial.

### Phase C: Narrative Node Activation
4. **Sprint 4 — Hazard Hub Activation**
   Aktifkan bangunan/naratif prioritas seperti pesantren, padepokan dukun, dan loop intervensi lintas-sektor.
5. **Sprint 5 — Outsider / Tourism Layer**
   Tambahkan wisatawan/pendatang, Tourist EMR tab, outsider cases, dan alur travel medicine yang sekarang masih provisional.

### Phase D: 3D Inspector + Showcase Hardening
6. **Sprint 6 — 3D Inspector + Showcase Gate**
   Kunci framing 3D sebagai inspector/reward/exhibition layer, capai `truthful minimum` agar tidak menyesatkan pemain, polish readability, dan siapkan fitur showcase seperti traceback UI yang belum live.

---

## VIII. PRINSIP DESAIN (NON-NEGOTIABLE) — Updated

1. **Seeded RNG Everywhere**: Peta sama pada seed sama = identik.
2. **Canvas/SVG Terrain, DOM Markers**: Terrain = 1 elemen statis (SVG/Canvas). Markers = ~250 elemen DOM interaktif. JANGAN PERNAH render 19K sel sebagai individual DOM elements.
3. **Staf Defend, Dokter Attack**: Staf maintain hijau, dokter convert merah → hijau.
4. **No Death Spiral**: Hukuman selalu bisa di-recover. Director mercy mode di stress ≥80.
5. **Map = Living Organism**: Setiap bangunan bernapas, setiap rumah punya cerita.
6. **Hazard Hubs = Narrative Engines**: Bangunan khusus = generator konflik + dilema moral.
7. **Anti-Grinding**: Selalu sediakan shortcut (Warung Kopi, Kader report, Detective Mode).
8. **Cultural Authenticity**: Anomali kultural Indonesia (Dukun, Pesantren, Pasung, Pos Ronda) bukan *flavor text* — mereka adalah **mekanik gameplay aktif** yang membentuk keputusan pemain.
9. **Scope Discipline**: Ide brilian yang belum punya infrastruktur codebase = di-katalog, bukan dipaksakan. Phase 1–4 = shippable MVP. Phase 5–6 = aspirational.

---

## IX. DEEPTHINK R5: 8 MEGATREN EPIDEMIOLOGI FRONTIER (TRIAGE)

> [!CAUTION]
> **Penilaian jujur**: Semua 8 konsep ini **konseptual brilian** dan layak untuk showcase global. TAPI tidak ada satupun yang sudah punya infrastruktur di codebase (0% coverage setelah audit grep). Jika semua diadopsi sekaligus, development time akan **meledak 3–5×** dan MVP tidak akan pernah ship. Saya menggunakan framework **Value vs Implementation Cost** untuk memilah.

### Matriks Value × Cost

```
                    LOW COST                          HIGH COST
              ┌─────────────────────────┬─────────────────────────┐
  HIGH VALUE  │ ✅ ADOPT MVP            │ 📦 KATALOG PHASE 6      │
              │                         │                         │
              │ 1. Wastewater (sampling  │ 2. AMR (perlu resistance│
              │    action → early warn)  │    tracking per-case)   │
              │                         │                         │
              │ 3. Infodemiology (COM-B  │ 4. Climate Extremes     │
              │    mass debuff event)    │    (multi-system cascade)│
              │                         │                         │
              │ 5. Syndemics/Judol       │ 7. Zoonotic Spillover   │
              │    (SDoH mutation event) │    (Nipah + lockdown)   │
              │                         │                         │
              ├─────────────────────────┼─────────────────────────┤
  LOW VALUE   │ ❌ REDUNDAN             │ 📦 KATALOG PHASE 6      │
  (relative)  │                         │                         │
              │ 8. Spatial Inequity      │ 6. CDoH / Junk Food     │
              │    (sudah di Q2 + Q4)    │    (perlu corporate     │
              │                         │    entity system)        │
              └─────────────────────────┴─────────────────────────┘
```

### ✅ Diadopsi untuk Phase 5 (3 dari 8)

Ketiga ini diadopsi karena **bisa diimplementasikan dengan infrastruktur yang SUDAH ADA** (TheDirector events, IKM scenarios, SDoH mutations, OutbreakSystem):

#### Megatren 1: 🔬 Wastewater Surveillance (Early Warning System)
- **Implementation**: Aksi "Ambil Sampel" di Sungai Cikapas / MCK → TheDirector memberi warning 3 hari sebelum outbreak.
- **Cost**: LOW — hanya 1 aksi baru di building scene Sungai + modifier di OutbreakSystem.js (delay outbreak jika sampel diambil).
- **Gameplay**: "Jendela Emas 3 hari" — klorinasi sumur massal = outbreak dibatalkan. Diabaikan = IGD lumpuh.
- **Why MVP-ready**: Hanya perlu 1 inspection action + 1 modifier di OutbreakSystem. Tidak perlu sistem baru.

#### Megatren 3: 📱 Infodemiology / Hoax Event
- **Implementation**: TheDirector spawn event "Broadcast WA Viral" → COM-B `motivation` seluruh RW anjlok ke 0 → imunisasi gagal → KLB Campak/Difteri.
- **Cost**: LOW-MEDIUM — IKM event baru + mass debuff seluruh keluarga di radius. Counter-campaign = skenario IKM di Balai Desa.
- **Visual**: Pulse merah di peta 2D merambat dari Warung Kopi → rumah-rumah (CSS animation).
- **Why MVP-ready**: COM-B motivation readiness sudah ada di `behaviorCaseRuntime.js`. Hoax = just another motivation barrier.

#### Megatren 5: 🎰 Syndemics — Judi Online & Pinjol
- **Implementation**: Random SDoH mutation event — `economy` keluarga tiba-tiba drop dari Middle → Very Low + `jiwa` merah. Cascade: istri masuk IGD (KDRT trauma), suami masuk IGD (intoksikasi organofosfat), balita gizi buruk.
- **Cost**: LOW — hanya SDoH mutation di `applyFamilyIndicatorDrift()` + 2-3 emergency case baru di `EmergencyCases.js`.
- **Why MVP-ready**: SDoH mutation framework sudah ada. Emergency cases sudah ada. Tinggal tambahkan "linked case chain" (3 pasien dari 1 keluarga dalam 2 hari).
- **Why HIGH VALUE**: Ini adalah isu Indonesia **paling aktual** 2024-2026. Reviewer dalam negeri akan langsung terkoneksi.

### 📦 Dikatalogkan untuk Phase 6 "Global Showcase DLC" (4 dari 8)

Konsep-konsep ini **terlalu bagus untuk dibuang** tapi **terlalu mahal untuk MVP**:

#### Megatren 2: 💊 AMR & Apotek Gelap
- **Why deferred**: Memerlukan **antibiotic resistance tracking per-pathogen, per-patient** — ini mengubah SELURUH pipeline klinis (CaseLibrary, treatment evaluation, PatientRuntime). Bukan sekadar event, tapi sistem engine baru.
- **Aspirational value**: SANGAT TINGGI. AMR di-prediksi WHO membunuh 10 juta orang/tahun pada 2050.
- **Sketsa implementasi**: Property `resistanceProfile` di setiap case → jika area terpapar "AMR warung" → Lini 1 gagal → paksa Lini 3 (mahal).

#### Megatren 4: 🌍 Planetary Health / Climate Extremes
- **Why deferred**: "El Niño mega-event" mempengaruhi **SEMUA sistem sekaligus** (water, economy, food security, infrastructure). Ini indah secara akademis tapi butuh multi-system cascade engine yang belum ada.
- **Catatan**: Seasonal multipliers di `PatientGenerator.js` adalah benih yang bisa ditumbuhkan ke sini.

#### Megatren 6: 🍔 CDoH — Commercial Determinants (Vape, Junk Food)
- **Why deferred**: Perlu "corporate entity" system yang belum ada — sponsor rokok, gerobak minuman manis, dll. Bukan cuma event tapi entitas persisten di peta.
- **Catatan**: Kasus DM tipe 2 dan EVALI bisa ditambahkan ke CaseLibrary lebih dulu tanpa perlu CDoH engine penuh.

#### Megatren 7: 🦇 Zoonotic Spillover Enhancement (Nipah/Lockdown)
- **Why deferred**: Lockdown lokal + contact tracing mini-game = **sistem game baru** yang cukup besar. Blueprint sudah punya One Health dasar (Pasar Hewan, Wana Wisata).
- **Catatan**: "Deforestation indicator" di Hutan Lindung bisa ditambahkan sebagai modifier sederhana tanpa lockdown system penuh.

### ❌ Redundan (1 dari 8)

#### Megatren 8: 🗺️ Spatial Inequity & Zero-Dose Children
- **Sudah ter-cover di Blueprint**: Q2 (Distance = Energy Cost), Q4 (RW Unlock framing), Vehicle Progression, dan implisit di seluruh design "pemain malas = pinggiran desa terlupakan".
- **Satu-satunya delta**: Framing "Zero-Dose Children" bagus untuk pitch tapi bukan mekanik baru.
- **Action**: Tambahkan sebagai narasi di Morning Briefing saat RW terluar memiliki anak tanpa imunisasi apapun.

---

## X. DEEPTHINK R6: 6 UX/EXECUTION HACKS (TRIAGE)

DT R6 bukan fitur/bangunan baru, melainkan **6 polish-level implementation hacks**. Per 4 April 2026, status implementasinya **campuran**, bukan lagi 0% coverage.

### Status aktual per hack

#### Hack 1: 🔍 Karma Traceback UI — PROVISIONAL 🟠
- Intent tetap valid untuk showcase kausalitas UKM → UKP.
- Belum live di runtime. Tempat yang paling masuk akal sekarang = **Sprint 6 / Showcase Gate**.

#### Hack 2: 🖥️ Canvas Terrain + DOM Markers — LIVE ✅
- Prinsip ini sekarang **sudah tercapai** di runtime 2D.
- `Map2DTerrain.jsx` memakai **1 `<canvas>`** untuk terrain, sementara marker interaktif tetap berada di DOM.

#### Hack 3: 💰 KBK BPJS (Kapitasi Berbasis Kinerja) — LIVE ✅
- Sudah punya pondasi runtime melalui sistem performa `KBK`/kapitasi berbasis kualitas desa.
- Ini bukan lagi ide, melainkan bagian dari loop reward/punishment `Wilayah`.

#### Hack 4: 🎒 Tourist EMR Tab (Travel History) — PROVISIONAL 🟠
- Masih desain target untuk outsider/tourism layer.
- Belum aktif di EMR runtime saat ini, jadi **tidak boleh ditandai selesai**.

#### Hack 5: 🕛 The 2 AM Shift (Night Emergency) — FUTURE 🔵
- Masih cocok sebagai immersive polish pasca-MVP.
- Belum punya implementasi runtime aktif.

#### Hack 6: 🎖️ Local Champion / Kaderisasi — LIVE ✅
- Local champion sudah hidup di peta 2D dan sistem proteksi tetangga.
- Visual/readability-nya juga sudah masuk gelombang kerja sprint terakhir.

---

## XI. AI EXECUTION GUARDRAILS & DATA CONTRACTS (dari DT R7)

> [!CAUTION]
> **UNTUK AGENTIC AI**: Baca SELURUH section ini sebelum menulis kode apapun. PRIMER menggunakan **Vanilla JS/JSX + Zustand + Immer**. Tidak ada TypeScript. Guardrails ini mencegah halusinasi arsitektural.

### Triage DT R7: Semua 6 Guardrails Diadopsi ✅

Setelah audit `useGameStore.js` (267 baris), **semua 6 klaim DT R7 terkonfirmasi akurat**:

| Guardrail | Klaim DT R7 | Verifikasi Codebase | Status |
|-----------|-------------|---------------------|--------|
| #1 Dependency Ban | Tidak boleh install map library | PRIMER = 0 map library, semua DIY | ✅ Confirmed |
| #2 19K Tiles Trap | Jangan render 19K `<div>` | `Map2DTerrain.jsx` pakai canvas tunggal (1 elemen) | ✅ Confirmed |
| #3 Zustand Persist | `persist` middleware ke localStorage | `useGameStore.js:166` → `persist()` aktif | ✅ Confirmed |
| #4 Data Contracts | Vanilla JS butuh explicit schemas | Tidak ada TypeScript di seluruh codebase | ✅ Confirmed |
| #5 Algorithmic Failsafe | Procedural gen bisa infinite loop | `map-utils.js` belum punya `MAX_ITER` | ✅ Confirmed |
| #6 No Over-Engineering | Jangan buat A* pathfinding | Manhattan distance sudah di Q2 blueprint | ✅ Confirmed |

### Guardrails (Adopted & Corrected)

#### 1. STRICT DEPENDENCY BAN ✅
- **DILARANG** `npm install` library peta (`leaflet`, `react-leaflet`, `pixi.js`, `phaser`, `d3`, `mapbox`).
- Semua peta 2D = DOM/SVG/Canvas native. Pan/Zoom = CSS `transform: translate(x,y) scale(z)`.

#### 2. THE 19.200 TILES TRAP ✅
- **DILARANG** render `tiles[][]` sebagai 19K `<div>` via `.map()`.
- Runtime aktif: `Map2DTerrain.jsx` = **1 elemen `<canvas>` statis**.
- Guardrail tetap: jika suatu saat butuh SVG, gunakan hanya untuk overlay garis/route, bukan tile terrain per-sel.
- React DOM hanya untuk ~250 `Map2DMarker` (interaktif).

#### 3. ZUSTAND PERSISTENCE LIMIT ✅ (Corrected)
- `useGameStore.js` line 166: `persist()` middleware **aktif** → localStorage key `primer_gamestate_v4`.
- `partialize()` (line 242) sudah membatasi apa yang disimpan. **TILES `[][]` TIDAK BOLEH masuk `partialize`.**
- **Simpan di Zustand**: `mapSeed` (integer), `unlockedRWs` (string[]), `facilityLevels` (object).
- **Generate on-the-fly**: `tiles[][]` dan `buildings[]` via `generateVillageMap(seed)` + `useMemo`.

#### 4. DATA CONTRACTS (Explicit JSON Schema) ✅

```javascript
// UKP Bridge Traceback (saat TheDirector spawn pasien dari UKM gagal)
patient.hidden.ukpBridge = {
  sourceId: 'padepokan_dukun',       // building ID sumber masalah
  sourceCoords: { x: 60, y: 95 },    // grid koordinat untuk polyline
  reason: 'Kegagalan Kemitraan Bidan-Dukun'
};

// Tourist (Travel Medicine)
patient.isTourist = true;
patient.hidden.familyId = null;       // bukan warga VillageRegistry
patient.hidden.travelHistory = {
  origin: 'Australia',
  arrivalDay: 45,
  visitedLandmarks: ['waterfall', 'homestay']
};

// Dynamic Props (bukan building baru, tapi flag di family data)
family.isChampion = true;   // IKS 100% → Kader Lokal + AoE buff
family.hasPasung = true;    // indikator jiwa merah > 14 hari → ikon ⛓️
```

#### 5. ALGORITHMIC FAILSAFES ✅
- Semua loop procedural generation **WAJIB** punya `MAX_ITERATIONS`:
```javascript
const MAX_ATTEMPTS = 5000;
let attempts = 0;
while (!placed && attempts < MAX_ATTEMPTS) {
  attempts++;
  // ... placement logic
}
if (!placed) fallbackPlacement(family); // JANGAN PERNAH freeze browser
```

#### 6. MOVEMENT & DISTANCE RULES ✅
- **DILARANG** membangun A*, Dijkstra, atau pathfinding real-time.
- Kalkulasi jarak = **Manhattan Distance**:
```javascript
const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
const energyCost = baseEnergy * (1.0 + distance / gridDiagonal * TERRAIN_PENALTY[sector]);
```
- Klik rumah/fasilitas = **Instant Teleportation** (menu langsung buka).
- Jalan Bezier = **kosmetik visual only**, tidak mempengaruhi kalkulasi.

#### 7. STRICT ZERO-EMOJI POLICY + ASSET SEGREGATION ✅ (Revised DT R10)
- **DILARANG KERAS** menggunakan Emoji Unicode (🏥🏠🛖) di peta 2D untuk bangunan manapun.
- **DILARANG** menaruh PNG isometrik 3D (`src/assets/buildings/`) langsung di peta 2D. Perspektif clash = "stiker di tembok".
- **Bangunan di peta 2D**: Render sebagai **Acrylic Token** (DOM div + SVG icon minimalis). Detail di XII.K.
- **Rumah warga di peta 2D**: Render sebagai **Data Node LED** (8-12px colored dot). Detail di XII.K.
- **PNG isometrik**: HANYA muncul di **Inspector Panel sidebar** saat token diklik. Detail di XII.K.

#### 8. 60FPS REACT PERFORMANCE SHIELD ✅ (dari DT R11)
- **DILARANG** menyimpan koordinat pan `{x, y}` di `useState`. Setiap mouse-move = re-render 250 marker = browser freeze.
- Pan & Zoom **WAJIB** via CSS `transform: translate(...) scale(...)` pada container utama.
- **WAJIB** `will-change: transform;` pada map container untuk GPU acceleration.
- **WAJIB** `React.memo()` pada `Map2DMarker` / data node component.
- **WAJIB** `useMemo()` pada list marker (`buildings.map(...)`) agar tidak re-compute setiap frame.
- Target: **60 FPS** saat panning/zooming dengan 200 data nodes + 47 tokens visible.

#### 9. HMR STATIC SEED (Development Only) ✅ (dari DT R11)
- Selama development, `generateVillageMap()` **WAJIB** menggunakan static seed (`_seed = 12345`).
- Tata letak peta **TIDAK BOLEH** berubah setiap `Ctrl+S` / HMR reload.
- Static seed dihapus saat production build (atau dibuat configurable via `import.meta.env`).

---

## XII. VISUAL DESIGN SYSTEM — PETA 2D

> [!IMPORTANT]
> Section ini **hanya untuk peta 2D** (Helicopter View / Meja Komando). Visual 3D saat ini masih berupa **full-village diorama opsional** dan ke depan harus dibingkai sebagai **inspector / reward / exhibition layer**, bukan peta taktis kedua.

### A. Art Direction — HYBRID A+C: "Premium GIS Tactical Dashboard" (FINAL)

> [!IMPORTANT]
> **KEPUTUSAN TERKUNCI (DT R10)**: Opsi Hybrid A+C. Bukan "Illustrated Tourist Map" lagi. Target estetika = **High-End Interactive GIS Dashboard / Premium Board Game Fisik.**

```
CURRENT (harus diubah):
  Background: #0a0f14 (near-black sci-fi) ← sterile, dingin
  Terrain: SVG rects warna gelap muted ← inkonsisten
  Markers: Emoji mentah (🏥🏠) ← amatir

TARGET (Hybrid A+C):
  Background: warm parchment + procedural noise ← editorial map
  Terrain: Canvas editorial cartography + contour lines ← GIS akademis
  Fasilitas: Acrylic Token DOM (SVG icon + glassmorphism) ← board game premium
  Rumah: LED Data Nodes (8-12px dots) ← epidemiological radar
  Detail View: PNG isometric di Inspector Panel sidebar ← 3D diorama reward
  Feel: "Instrumen Intelijen Kemenkes / Palantir for Public Health" 🛰️
```

**Referensi Visual**: Civilization VI Strategic View, Plague Inc., Mini Metro, Palantir dashboard, The Economist data viz, premium board game (Scythe/Wingspan).

### B. Color Palette Master

#### Terrain Palette (Canvas Fill)

| Terrain | Hex | HSL | Catatan |
|---------|-----|-----|---------|
| **Rumput (base)** | `#8fbc6b` | 97° 38% 58% | Warm green — foundation seluruh peta |
| **Rumput gelap (shade)** | `#6b9e4f` | 97° 33% 46% | Alternating untuk menghindari flat look |
| **Sungai (air)** | `#4a90d9` | 212° 62% 57% | Biru cerah — bukan navy gelap |
| **Sungai (shimmer)** | `#6db3f2` | 210° 84% 69% | Specular highlight animasi ringan |
| **Hutan (rapat)** | `#2d5a27` | 114° 38% 25% | Gelap — zona bahaya terasa |
| **Hutan (tepi)** | `#4a8c3f` | 113° 38% 40% | Gradasi ke rumput |
| **Sawah aktif** | `#a8d86e` | 90° 57% 64% | Hijau muda — padi tumbuh |
| **Sawah kering** | `#d4c97a` | 50° 50% 65% | Musim kemarau — shift kuning |
| **Jalan aspal** | `#8c8a85` | 36° 3% 54% | Abu netral warm |
| **Jalan tanah** | `#c4a882` | 30° 34% 64% | Coklat sandy |
| **Jembatan** | `#a0785a` | 25° 28% 49% | Kayu tua |
| **Bunga/dekorasi** | `#e8a0c8` | 330° 57% 77% | Pink accent di tepi jalan |

#### Map Background & Chrome

| Elemen | Hex | Catatan |
|--------|-----|---------|
| **Background (di luar peta)** | `#f5f0e6` | Warm parchment — bukan pitch black |
| **Grid lines** | `rgba(120,100,70, 0.08)` | Subtle brown grid — blueprint feel tapi warm |
| **RW label** | `rgba(80,60,30, 0.4)` | Soft brown, dekat grid |
| **Vignette edge** | `rgba(60,40,20, 0.3)` | Warm brown shadow, bukan black |

#### Marker Palette (Building Badges)

| Kategori | Badge BG | Border | Contoh |
|----------|----------|--------|--------|
| **Faskes (Puskesmas, Pustu, Polindes)** | `#fee2e2` | `#ef4444` | Merah — identitas medis universal |
| **Pendidikan (SDN, TK)** | `#fef3c7` | `#f59e0b` | Amber — cerah, ramah anak |
| **Ibadah (Masjid)** | `#dcfce7` | `#22c55e` | Hijau — Islam |
| **Komersial (Pasar, Warung, Toko)** | `#fde68a` | `#b45309` | Emas/coklat — dagangan |
| **Pemerintahan (Balai, Kantor)** | `#e2e8f0` | `#64748b` | Slate — formal |
| **Hazard Hub (Dukun, Pesantren, Pos Ronda)** | `#fce7f3` | `#db2777` | Magenta — perhatian! |
| **Wisata (Homestay, Dermaga, Gardu)** | `#cffafe` | `#06b6d4` | Cyan — pariwisata |
| **Infrastruktur (MCK, PAMSIMAS, Bank Sampah)** | `#dbeafe` | `#3b82f6` | Biru — utilitas |
| **Alam (Hutan, Sungai, Air Terjun)** | `#d1fae5` | `#059669` | Emerald — nature |

#### Rumah Warga (House Visual Differentiation)

| SDOH Economy | Emoji/Icon | Badge BG | Border | Visual Cue |
|-------------|------------|----------|--------|------------|
| **High** | 🏠 | `#f0f9ff` | `#0ea5e9` | Besar (20px), terang, modern |
| **Middle** | 🏠 | `#fefce8` | `#a3a3a3` | Normal (16px), netral |
| **Low-Middle** | 🏚️ | `#fef3c7` | `#92400e` | Normal (16px), kayu tradisional |
| **Low / Very Low** | 🛖 | `#fecaca` | `#b91c1c` | Kecil (14px), warning merah |
| **Make-shift** | 🛖 | `#fecaca` | `#ef4444` | Kecil (12px), pulsing subtle |
| **Champion (IKS 100%)** | 🏠⭐ | `#fef9c3` | `#eab308` | Gold glow halo |
| **Pasung (jiwa merah >14d)** | 🏠⛓️ | — | — | Overlay chain icon di sudut |

### C. Rendering Architecture (Canvas Terrain)

> [!NOTE]
> Runtime aktif **tidak lagi melanggar Guardrail #2**. `Map2DTerrain.jsx` sudah memakai **`<canvas>` tunggal** untuk terrain. Sisa pekerjaan di area ini adalah polish visual, seasonal variation, dan layering overlay, bukan migrasi away from per-tile DOM.

**Reference Architecture:**

```
┌─────────────────────────────────────┐
│ Map2DBlueprint.jsx (container)      │
│  ├─ <canvas> — Map2DTerrain         │  ← 1 elemen, rendered once
│  │   (drawn via 2D Canvas API)      │     cached via useMemo/useRef
│  │   (grass, water, forest, road,   │
│  │    sawah, flowers, grid lines)   │
│  │                                  │
│  ├─ <div> × 8 — RW Zone overlays   │  ← CSS divs, transparent fills
│  │                                  │
│  ├─ <div> × ~250 — Map2DMarker[]   │  ← DOM interaktif
│  │   (buildings + houses, hover,    │     emoji + badge pill
│  │    tooltip, detective overlay)    │
│  │                                  │
│  ├─ <svg> — Overlay lines           │  ← 1 SVG untuk Traceback lines,
│  │   (Traceback polyline, routes)   │     road highlights, wisata path
│  │                                  │
│  └─ HUD chrome (zoom, compass, etc) │
└─────────────────────────────────────┘
```

**Canvas Rendering Function:**

```javascript
function renderTerrainToCanvas(canvas, tiles, width, height, cellSize, season) {
  const ctx = canvas.getContext('2d');
  canvas.width = width * cellSize;
  canvas.height = height * cellSize;

  const TERRAIN_COLORS = {
    [TILE_TYPES.GRASS]:      season === 'dry' ? '#a8b87b' : '#8fbc6b',
    [TILE_TYPES.WATER]:      '#4a90d9',
    [TILE_TYPES.TREE]:       '#2d5a27',
    [TILE_TYPES.FOREST_BASE]:'#4a8c3f',
    [TILE_TYPES.SAWAH]:      season === 'dry' ? '#d4c97a' : '#a8d86e',
    [TILE_TYPES.ROAD_H]:     '#8c8a85',
    [TILE_TYPES.ROAD_V]:     '#8c8a85',
    [TILE_TYPES.ROAD_CROSS]: '#8c8a85',
    [TILE_TYPES.DIRT_ROAD_H]:'#c4a882',
    [TILE_TYPES.DIRT_ROAD_V]:'#c4a882',
    [TILE_TYPES.BRIDGE]:     '#a0785a',
    [TILE_TYPES.FLOWER]:     '#e8a0c8',
    [TILE_TYPES.SAND]:       '#e8d5a3',
  };

  // Paint terrain in ONE pass — no DOM elements created
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = tiles[y][x];
      ctx.fillStyle = TERRAIN_COLORS[tile] || '#8fbc6b';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Optional grid overlay
  ctx.strokeStyle = 'rgba(120,100,70,0.06)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= width; x += 5) {
    ctx.beginPath(); ctx.moveTo(x*cellSize, 0);
    ctx.lineTo(x*cellSize, height*cellSize); ctx.stroke();
  }
  for (let y = 0; y <= height; y += 5) {
    ctx.beginPath(); ctx.moveTo(0, y*cellSize);
    ctx.lineTo(width*cellSize, y*cellSize); ctx.stroke();
  }
}
```

- **Performance**: 1 canvas = 1 DOM element. 19.200 `fillRect` calls + 1 paint = <5ms pada laptop kentang.
- **Season-reactive**: Warna berubah berdasarkan `season` parameter (kemarau = kuning, hujan = hijau).
- **Cached**: Hanya re-render jika `tiles[][]` atau `season` berubah (`useEffect` + dependency check).

### D. Marker Design (Badge Pill)

Saat ini markers = emoji mentah floating. Target = **rounded pill badge**:

```css
.map2d-marker {
  /* Badge pill design */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1.5px solid;
  backdrop-filter: blur(4px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  /* Hover */
  transition: transform 150ms ease, box-shadow 150ms ease;
  cursor: pointer;
}
.map2d-marker:hover {
  transform: scale(1.4);
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  z-index: 50;
}
.map2d-marker.selected {
  transform: scale(1.3);
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245,158,11,0.3);
}
```

### E. Touch Target Guidelines (Mobile)

| Element | Min Size | Catatan |
|---------|----------|---------|
| Facility marker | **44×44px** (WCAG AA) | Puskesmas, Sekolah, dll |
| House marker | **36×36px** minimum | Utamanya pada zoom `>= 0.6` (detail view) |
| HUD buttons (zoom +/-) | **48×48px** | Bottom-right corner |
| Tooltip tap area | Same as marker | Long-press = tooltip sticky |
| Swipe panning | Full container | Touch-action: pan-x pan-y |
| Pinch zoom | Full container | gesturechange handler |

> [!TIP]
> Pada overview view (`zoom < 0.6`), rumah warga tidak semuanya ditampilkan. Jadi masalah 200 × 36px markers **baru dominan pada zoom detail** ketika space visual memang sudah cukup.

### F. Seasonal Visual Variations

| Musim | Terrain Changes | Overlay | Duration |
|-------|----------------|---------|----------|
| **Hujan** | Rumput → lebih hijau gelap, sawah → hijau emerald, sungai → melebar +1 sel | Rain particle overlay (CSS anim) | Month 1,2,11,12 |
| **Kemarau** | Rumput → kekuningan `#a8b87b`, sawah → coklat kering `#d4c97a`, sungai → menyempit | Heat shimmer overlay (CSS anim) | Month 6,7,8,9 |
| **Pancaroba** | Gradasi antara keduanya | Tidak ada overlay | Transisi |
| **Banjir (event)** | Sungai → meluap `x > 142`, warna merah-coklat `#8b6245` | Flood pulse animation | 3 hari game |

**Implementation**: Canvas terrain di-repaint saat `season` state berubah. Hanya 1 repaint per perubahan musim (bukan per frame).

### G. Animation Catalog

| Animasi | Tipe | CSS/JS | Target |
|---------|------|--------|--------|
| **Outbreak pulse** | Ring expand + fade | CSS `@keyframes pulse` | Map2DMarker (merah) |
| **IKM event alert** | Bounce + glow | CSS `@keyframes bounce` | 🚨 pada bangunan |
| **Hoax wave** | Ripple expand dari Warung | CSS `@keyframes ripple` | Red wave overlay divs |
| **Tourist movement** | Dot trail dari Gapura | SVG animated path | Polyline di overlay SVG |
| **Bendera Kuning** | 🕊️ slow bob | CSS `@keyframes bob` | death marker di rumah |
| **Pasung discover** | ⛓️ shake | CSS `@keyframes shake` | Corner overlay marker |
| **Champion glow** | Gold halo pulse | CSS `@keyframes goldPulse` | 🎖️ badge on house |
| **Sungai shimmer** | Canvas light sweep | Canvas gradient animation | Water tiles (60fps target) |
| **Rain particles** | CSS falling dots | CSS pseudo-elements | Full map overlay |
| **Zoom transition** | Smooth scale | CSS `transition: transform 300ms ease` | Transform container |

### H. Map HUD Chrome

```
┌─────────────────────────────────────────┐
│ [Layers: 🧭][🏠][🦠][🐛][❤️][👥]     │ ← top-left: layer toggle
│                                   [N]   │ ← top-right: compass
│                                   ↑     │
│                                         │
│          *** PETA 2D ***                │
│                                         │
│                                         │
│                              [+]        │ ← right: zoom controls
│                              [—]        │
│                              [🔄]       │ ← reset zoom
│                                         │
│ [🗺️ Zoom: 120%]  [📅 Hari 45, Rabu]    │ ← bottom: info bar
│ [Musim: Hujan ☔]  [IKS Desa: 67% 🟡]  │
└─────────────────────────────────────────┘
```

| HUD Element | Lokasi | Info |
|-------------|--------|------|
| **Detective lens toggle** | Top-left | 3 tombol radio: IKS / Surveilans / SDoH |
| **Compass** | Top-right | N indicator, static |
| **Zoom controls** | Right-center | +, −, reset (48px buttons) |
| **Info bar** | Bottom | Zoom %, hari/tanggal, musim, IKS desa avg |
| **Legend** | Bottom-left (collapsible) | Warna marker per kategori |
| **Mini events ticker** | Top-center | Toast notifications untuk events aktif |

### I. Typography

| Elemen | Font | Weight | Size | Color |
|--------|------|--------|------|-------|
| **RW Label** | `'Inter', sans-serif` | 900 (Black) | 7px | `rgba(80,60,30,0.4)` |
| **Tooltip title** | `'Inter', sans-serif` | 800 (ExtraBold) | 11px | `#ffffff` |
| **Tooltip type** | `'Inter', sans-serif` | 900 (Black) | 7px | `#34d399` (emerald) |
| **IKS badge** | `'JetBrains Mono', monospace` | 700 (Bold) | 9px | Contextual (R/Y/G) |
| **HUD info** | `'Inter', sans-serif` | 600 (SemiBold) | 10px | `rgba(255,255,255,0.7)` |
| **HUD label** | `'Inter', sans-serif` | 900 (Black) | 8px | `rgba(255,255,255,0.4)` |
| **Compass N** | `'Inter', sans-serif` | 900 (Black) | 12px | `rgba(255,255,255,0.25)` |

### J. AI Visual Execution Directives (dari DT R8)

> [!CAUTION]
> **5 instruksi ini WAJIB dipatuhi oleh AI executor.** Tanpa mereka, AI akan menghasilkan "Programmer Art" — kaku, flat, dan kotak-kotak. Instruksi ini memaksa output visual sekelas Art Director profesional.

#### Directive 1: 📜 Procedural Parchment (Anti-Flat Background)
- **DILARANG** `background-color: #f5f0e6` polos. WAJIB tambahkan **procedural SVG noise** untuk tekstur serat kertas.
- **DILARANG** menggunakan file PNG/JPG eksternal untuk tekstur.

```css
.map-container-parchment {
  background-color: #f5f0e6;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
}
```

#### Directive 2: 🏔️ 2.5D Elevation Illusion (Anti-Flat Terrain)
- Saat rendering Sawah Berundak dan Hutan Lindung di Canvas, **WAJIB** tambahkan `shadowBlur` dan `shadowOffsetY` di tepi bawah zona untuk ilusi kedalaman terasering.
- `Map2DMarker` **WAJIB** punya `box-shadow` yang responsif terhadap `zoomLevel` — semakin zoom-in, shadow semakin tebal → efek "paper pop-up book".

```javascript
// Canvas shadow untuk tepi sawah/hutan
ctx.shadowColor = '#2d5a27';
ctx.shadowBlur = 4;
ctx.shadowOffsetY = 2;
// ... render edge tiles ...
ctx.shadowBlur = 0; // reset setelah zona selesai
```

#### Directive 3: 🌅 Time-of-Day Lighting Overlay
- **WAJIB** buat `<div id="map-lighting-layer">` fullscreen dengan `pointer-events: none` dan `mix-blend-mode: multiply` di atas canvas terrain.
- Ubah background berdasarkan jam in-game:

| Waktu | Overlay | Efek Psikologis |
|-------|---------|-----------------|
| **Siang (08:00–14:00)** | `transparent` | Cerah, vibrant — "waktu kerja" |
| **Sore (15:00–17:00)** | `rgba(245,158,11, 0.12)` | Golden hour — hangat tapi mendesak |
| **Malam (2 AM Shift)** | `rgba(15,23,42, 0.75)` | Navy pekat — only emergency markers menyala |

- Saat **Malam**: Marker UGD/Dukun yang memicu emergency → `box-shadow: 0 0 20px 5px rgba(250,204,21,0.6)` (seolah "menyala sendirian di kegelapan desa").

#### Directive 4: 🌊 Anti-Grid Organic Rendering (Rivers & Roads)
- **DILARANG** menggambar Sungai Cikapas dan Jalan Utama murni dari `fillRect` kotak grid. Hasil = Minecraft, bukan peta ilustrasi.
- `tiles[][]` = **data logika/collision ONLY**. Visual Sungai & Jalan **WAJIB** digambar menggunakan **Canvas Bezier Curves** (`ctx.bezierCurveTo`).
- Sungai harus meliuk organik. Jalan tanah harus sedikit ber-kurva. Jalan aspal boleh lebih lurus tapi tetap sedikit rounded.

```javascript
// Sungai Cikapas — visual Bezier (bukan kotak grid)
ctx.beginPath();
ctx.moveTo(148 * cellSize, 0);
ctx.bezierCurveTo(
  150 * cellSize, 30 * cellSize,  // control point 1
  146 * cellSize, 60 * cellSize,  // control point 2
  152 * cellSize, 119 * cellSize  // end point
);
ctx.lineWidth = 6 * cellSize;     // lebar sungai
ctx.strokeStyle = '#4a90d9';
ctx.lineCap = 'round';
ctx.stroke();
```

#### Directive 5: 👁️ Color-Blind Safe Detective Lenses (WCAG AAA)
- **DILARANG** membedakan status IKS/outbreak **HANYA** dengan warna Hex. ~8% pria mengalami deuteranopia (buta merah-hijau).
- **WAJIB** tambahkan redundansi visual via `border-style` pattern:

| Status | Warna | Border Style | Animasi |
|--------|-------|-------------|---------|
| ✅ **Aman** | `#34d399` (green) | `solid 2px` | None |
| ⚠️ **Waspada** | `#fbbf24` (yellow) | `dashed 2px` | None |
| 🔴 **Kritis** | `#f87171` (red) | `dotted 3px` | `pulse 1.5s infinite` |

- Tanpa melihat warna sekalipun, pemain bisa membedakan rumah aman/waspada/kritis dari pola border.

### K. Hybrid A+C Visual Execution System (dari DT R10) — REPLACES DT R9

> [!CAUTION]
> **DT R9 (PNG Pedestal on Map) DIBATALKAN.** PNG isometrik (45°) di atas canvas top-down (0°) = "stiker di tembok". DT R10 menggantikan dengan Hybrid A+C yang menyatu sempurna.

#### Hack 1: 🗺️ Topographic Cartography (Editorial Terrain)
- **DILARANG** terrain warna blok flat. Palet **muted pastel/editorial**.
- **WAJIB** garis kontur topografi transparan (opacity 8-12%) di area Sawah Berundak dan Hutan.

```javascript
ctx.strokeStyle = 'rgba(255,255,255, 0.08)';
ctx.lineWidth = 0.5;
for (const contour of contourLines) {
  ctx.beginPath();
  ctx.moveTo(contour[0].x * cellSize, contour[0].y * cellSize);
  for (let i = 1; i < contour.length; i++) {
    ctx.lineTo(contour[i].x * cellSize, contour[i].y * cellSize);
  }
  ctx.stroke();
}
```

#### Hack 2: 💎 Acrylic Board-Game Tokens (47 Fasilitas)
- Fasilitas = **Pion Board Game Akrilik** (DOM). **DILARANG emoji.** SVG icon minimalis.

```css
.map2d-token {
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  background: rgba(255,255,255, 0.18);
  backdrop-filter: blur(6px);
  border-top: 1px solid rgba(255,255,255, 0.35);
  box-shadow: 2px 4px 0 rgba(0,0,0, 0.12);
  transition: transform 200ms ease; cursor: pointer;
}
.map2d-token:hover { transform: translateY(-2px); box-shadow: 2px 6px 0 rgba(0,0,0,0.18); }
.map2d-token svg { width: 60%; height: 60%; stroke: currentColor; stroke-width: 2; fill: none; }
```

| Tipe | Size | Warna | SVG Icon |
|------|------|-------|----------|
| Puskesmas | 32×32px | `#fee2e2` / `#ef4444` | Cross/Plus |
| Sekolah, Masjid | 26×26px | Per-category | Building/Mosque |
| Posyandu, Warung | 22×22px | Per-category | Heart/Store |
| Hazard Hub | 24×24px | `#fce7f3` / `#db2777` | AlertTriangle |

#### Hack 3: 🔴 Epidemiological Radar (200 Rumah = LED Data Nodes)
- 200 rumah = **Data Node LED** (8-12px CSS dot). Detective Mode: terrain **dim 40%**, node kritis = **neon glow + sonar pulse**.

```css
.map2d-data-node { width: 10px; height: 10px; border-radius: 50%; position: absolute; }
.map2d-data-node--high    { background: #38bdf8; }  /* 29 KK */
.map2d-data-node--middle  { background: #a3a3a3; }  /* 89 KK */
.map2d-data-node--lowmid  { background: #94a3b8; }  /* 53 KK — was MISSING in v2.1! */
.map2d-data-node--low     { background: #fbbf24; }  /* 23 KK */
.map2d-data-node--verylow { background: #f87171; }  /* 6 KK */
.map2d-data-node--champion { background: #facc15; box-shadow: 0 0 6px 2px rgba(250,204,21,0.5); }
.map2d-data-node--critical { animation: sonarPulse 2s ease-out infinite; }
@keyframes sonarPulse {
  0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
  70% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
  100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
}
```

#### Hack 4: 🖼️ Inspector Panel — The Holographic Diorama
- PNG isometrik 3D **HANYA** di Inspector Panel (klik token → panel slide dari kanan).
- PNG **Out-of-Bounds**: `margin-top: -40px` + `drop-shadow`. Hero art reward, bukan map clutter.

```css
.inspector-hero-img {
  position: relative; margin-top: -40px;
  filter: drop-shadow(4px 8px 6px rgba(0,0,0,0.25));
  max-width: 180px;
}
```

Aset: 24 PNG existing → Inspector Panel. 8 missing (hazard/wisata) → generate sebelum Phase 3.

#### Hack 5: 🔗 Fiber-Optic Traceback (Karma Loop)
- Traceback = **Glowing Fiber-Optic SVG** animasi, bukan garis merah statis.

```css
.traceback-line {
  stroke: #ef4444; stroke-width: 2; stroke-dasharray: 8 4;
  filter: drop-shadow(0 0 4px rgba(239,68,68,0.5));
  animation: fiberFlow 1.5s linear infinite;
}
@keyframes fiberFlow { to { stroke-dashoffset: -24; } }
```

#### NPC Portraits (Phase 4)

| NPC | Style | Building Scene |
|-----|-------|----------------|
| Bidan Ema | Editorial, tegas, seragam IBI | Polindes |
| Mak Sinem | Kerutan, selendang, sanggul | Padepokan |
| Pak Kyai | Kopiah, jubah putih | Pesantren |
| Kader Posyandu | Muda, celemek ungu | Posyandu |
| Kepala Desa | Batik formal | Balai Desa |

**DILARANG** anime/chibi/clipart. Style = Editorial Illustration (The New Yorker).

---

### L. Z-Index Manifest (dari DT R11)

> [!CAUTION]
> AI suka asal pakai `z-index: 9999`. **WAJIB** gunakan hierarki ini — tidak boleh menyimpang:

| Layer | Z-Index | Komponen | Catatan |
|-------|---------|----------|---------|
| Canvas Terrain | `10` | `<canvas>` | Dasar peta |
| Contour Lines | `12` | Canvas overlay | Di atas terrain base |
| SVG Traceback | `20` | `<svg>` fiber-optic lines | Karma Loop garis |
| Detective Overlay | `25` | `<div>` dimming layer | `mix-blend-mode: multiply` |
| LED Data Nodes | `30` | `<div>` house dots | 200 rumah warga |
| Acrylic Tokens | `40` | `<div>` building markers | 47 fasilitas |
| Hovered Marker | `50` | Active/selected element | Pop-out saat hover |
| Map Tooltips | `90` | `<div>` tooltip | Nama + info singkat |
| Inspector Panel | `100` | `<div>` sidebar panel | PNG hero art + detail |
| HUD Chrome | `200` | Lensa, Zoom, Compass, Info | Selalu di atas semua |

---

*Blueprint ini adalah kontrak eksekusi. Setiap perubahan arsitektural harus dirujuk kembali ke dokumen ini.*
*Versi: 2.5 — 2026-04-09T22:10+07:00*
*Includes: DT R1–R12 + Hybrid A+C + Geospatial SDoH + Data Crosscheck + Vibecoding Guardrails*
