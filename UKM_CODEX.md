# UKM CODEX — Upaya Kesehatan Masyarakat Reference

> **Version:** 1.0  
> **Last Updated:** 2026-02-19  
> **Purpose:** Authoritative reference for all UKM concepts implemented in PRIMER  
> **Regulatory Basis:** Permenkes No. 19 Tahun 2024 (replaces Permenkes No. 43 Tahun 2019)

---

## 1. Definisi UKM

**Upaya Kesehatan Masyarakat (UKM)** adalah serangkaian kegiatan terpadu dan berkesinambungan yang bertujuan untuk memelihara, melindungi, meningkatkan derajat kesehatan, serta mencegah dan menanggulangi masalah kesehatan pada tingkat **populasi** (bukan perorangan).

| Aspek | UKM | UKP |
|---|---|---|
| **Pendekatan** | Promotif & Preventif | Kuratif & Rehabilitatif |
| **Sasaran** | Keluarga, kelompok, masyarakat | Individu/perorangan |
| **Pelaksana utama** | Puskesmas, kader, UKBM | Puskesmas (poli), RS, klinik |
| **Contoh** | Posyandu, penyuluhan, PSN | Berobat di poli, operasi, rawat inap |

---

## 2. Dasar Hukum

### 2.1. Permenkes No. 19 Tahun 2024 — Penyelenggaraan Puskesmas (BERLAKU)

Menggantikan Permenkes No. 43/2019 dan No. 44/2016. Mengatur sistem **klaster siklus hidup**:

| Klaster | Cakupan | PRIMER Engine |
|---|---|---|
| **Manajemen** | SDM, keuangan, sarpras, SIK | `GameCore`, `BillingEngine`, `useGameStore` |
| **KIA** | Bumil, nifas, bayi, balita, imunisasi, gizi | `PregnancyEngine`, `ImmunizationEngine`, `GrowthChartEngine`, `PosyanduEngine` |
| **Dewasa & Lansia** | PTM, penyakit kronis, Prolanis | `ProlanisEngine` |
| **P2P & Kesling** | PM, PTM, surveilans, KLB, vektor, sanitasi | `IKMEventEngine`, `EmergingEventTriggers`, `BehaviorCaseEngine` |
| **Lintas Klaster** | Koordinasi antar klaster | `MorningBriefing`, `ConsequenceEngine` |

> **Setiap klaster dipimpin oleh penanggung jawab** yang ditunjuk kepala Puskesmas. Penanggung jawab bertanggung jawab atas perencanaan, pembagian tugas, koordinasi, penjaminan mutu, pemantauan, evaluasi, dan pelaporan.

### 2.2. Permenkes No. 43 Tahun 2019 (DICABUT, referensi historis)

Mendefinisikan UKM Esensial dan UKM Pengembangan secara eksplisit. Masih relevan secara konseptual karena Permenkes 19/2024 melanjutkan prinsip yang sama dengan reorganisasi klaster.

### 2.3. Permenkes Terkait Lainnya

| Permenkes | Tentang | Relevansi PRIMER |
|---|---|---|
| No. 18/2024 | Petunjuk Teknis BOK | Dana operasional UKM |
| No. 37/2023 | Insentif UKM BOK | Insentif petugas Puskesmas |
| No. 4/2019 | SPM Kesehatan | Standar pelayanan minimal yang harus dicapai |

---

## 3. UKM Esensial — 6 Komponen Wajib

Setiap Puskesmas **wajib** melaksanakan ke-6 komponen ini.

### 3.1. Promosi Kesehatan (Promkes)

**Definisi:** Penyuluhan, pemberdayaan masyarakat, peningkatan PHBS, dan GERMAS.

**Kegiatan utama:**
- Penyuluhan kesehatan (individu, kelompok, massa)
- Pembinaan dan pendampingan Posyandu
- Pemberdayaan kader kesehatan
- Kampanye PHBS (10 indikator)
- Gerakan Masyarakat Hidup Sehat (GERMAS)

**PRIMER Implementation:**
| Engine/File | Coverage |
|---|---|
| `BehaviorCaseEngine` | COM-B diagnosis, TTM stages, 9 intervention functions |
| `IKMScenarioLibrary` (PHBS) | 5 PHBS scenarios (BAB, cuci tangan, jajanan, air, sampah) |
| `DiseaseScenarios` | 20 behavior change cases across 4 tiers |
| `VillagerBehavior` | COM-B profiles for 30 families, PHBS scoring |
| `MiniGameLibrary` | inspeksi_kilat, baca_ekspresi, susun_strategi |
| `buildingScenes.posyandu` | Meja 4: Penyuluhan ASI/MPASI |

**10 Indikator PHBS Rumah Tangga:**
1. Persalinan ditolong tenaga kesehatan
2. ASI eksklusif 6 bulan
3. Menimbang balita tiap bulan (Posyandu)
4. Air bersih
5. Cuci tangan pakai sabun (CTPS)
6. Jamban sehat
7. Pemberantasan jentik nyamuk (PSN)
8. Makan sayur dan buah
9. Aktivitas fisik/olahraga
10. Tidak merokok dalam rumah

### 3.2. Kesehatan Lingkungan (Kesling)

**Definisi:** Pengelolaan air bersih, sanitasi, pengendalian vektor, inspeksi sarana.

**Kegiatan utama:**
- Inspeksi sanitasi (air bersih, jamban, SPAL)
- Pemantauan kualitas air (fisik, kimia, bakteriologis)
- Pengendalian vektor (PSN, larvaciding, fogging)
- Pengawasan tempat-tempat umum (TTU)
- Pengawasan tempat pengelolaan makanan (TPM)
- Pemicuan STBM (Sanitasi Total Berbasis Masyarakat)

**PRIMER Implementation:**
| Engine/File | Coverage |
|---|---|
| IKM `bab_sembarangan` | STBM pillar 1: Stop BABS |
| IKM `air_minum_tercemar` | Inspeksi air bersih |
| IKM `sampah_menumpuk` | Pengelolaan sampah |
| BC `bc_dbd_psn` | PSN/pengendalian vektor |
| `buildingScenes.school` | Inspeksi toilet, sabun, ventilasi, kantin |
| `buildingScenes.farm` | Tes air sungai, MCK, kandang |
| Building: `mck`, `pamsimas`, `bank_sampah` | Listed, belum ada interior |

**5 Pilar STBM (Sanitasi Total Berbasis Masyarakat):**
1. Stop Buang Air Besar Sembarangan (Stop BABS)
2. Cuci Tangan Pakai Sabun (CTPS)
3. Pengelolaan Air Minum dan Makanan Rumah Tangga (PAMM-RT)
4. Pengelolaan Sampah Rumah Tangga
5. Pengelolaan Limbah Cair Rumah Tangga

### 3.3. Kesehatan Ibu, Anak, dan KB (KIA-KB)

**Definisi:** Pelayanan bumil, nifas, menyusui, bayi, balita, imunisasi, dan kontrasepsi.

**Kegiatan utama:**
- ANC (Antenatal Care): K1-K4
- Persalinan dan nifas
- Kelas ibu hamil & kelas ibu balita
- Imunisasi dasar lengkap
- SDIDTK (Stimulasi, Deteksi, Intervensi Dini Tumbuh Kembang)
- Pelayanan KB/kontrasepsi
- Kunjungan neonatus (KN1, KN2, KN3)

**PRIMER Implementation:**
| Engine/File | Coverage |
|---|---|
| `PregnancyEngine` | ANC K1-K4, risk scoring (12 faktor), obstetric events, delivery simulation |
| `PregnancyEngine.KB_METHODS` | 8 metode KB (pil, suntik, implant, IUD, kondom, MOW, MOP) |
| `ImmunizationEngine` | 14+ vaksin, jadwal nasional, catch-up, coverage tracking |
| `GrowthChartEngine` | KMS digital, WHO z-score, faltering detection, status gizi |
| `PosyanduEngine` | Sistem 5 Meja, penimbangan, imunisasi, penyuluhan |
| `buildingScenes.posyandu` | Full 5-Meja interior |
| Building: `polindes`, `kb_post` | Listed, belum ada interior |

### 3.4. Perbaikan Gizi Masyarakat

**Definisi:** Pemantauan tumbuh kembang, pemberian suplemen, penanganan stunting.

**Kegiatan utama:**
- Pemantauan pertumbuhan/KMS (bulanan di Posyandu)
- Pemberian suplemen (Vit A, tablet Fe, obat cacing)
- PMT (Pemberian Makanan Tambahan) untuk balita kurang gizi
- Deteksi dan penanganan stunting
- Pendidikan gizi seimbang & ASI eksklusif
- Kadarzi (Keluarga Sadar Gizi)

**PRIMER Implementation:**
| Engine/File | Coverage |
|---|---|
| `GrowthChartEngine` | WHO z-score (BB/U, TB/U, BB/TB), deteksi faltering (2T) |
| `PosyanduEngine` | Meja 2 & 3 (timbang, plot KMS), Vit A, obat cacing |
| `buildingScenes.posyandu` | Meja 2 (penimbangan), Meja 3 (KMS), Meja 4 (penyuluhan gizi) |
| BC `bc_sth_cacingan` | Cacingan → anemia → stunting chain |
| IKM nutrition scenarios | Gizi buruk, MPASI salah |
| Building: `pos_gizi` | Listed, belum ada interior |

### 3.5. Pencegahan dan Pengendalian Penyakit (P2P)

**Definisi:** Surveilans epidemiologi, imunisasi massal, penanggulangan PM/PTM, penyelidikan KLB.

**Kegiatan utama:**
- Surveilans epidemiologi (penemuan kasus, pelacakan kontak)
- Imunisasi massal / kampanye vaksin
- Penanggulangan penyakit menular (TB, DBD, HIV, malaria, kusta, diare)
- Pengendalian penyakit tidak menular (hipertensi, DM, kanker, PPOK)
- Penyelidikan Kejadian Luar Biasa (KLB/outbreak)
- Laporan W2 (mingguan) dan STP (bulanan)

**PRIMER Implementation:**
| Engine/File | Coverage |
|---|---|
| `DiseaseScenarios` | 20 BC cases: TB, DBD, HIV, scabies, STH, diare, dll |
| `IKMScenarioLibrary` | 18 IKM community events |
| `EmergingEventTriggers` | 5 emerging disease triggers (difteri, AI, anthrax, malaria, pertussis) |
| `ProlanisEngine` | PTM: Hipertensi & DM type 2 monitoring |
| `IKMEventEngine` | Surveilans + response phases |
| `ImmunizationEngine` | Imunisasi massal & coverage |

### 3.6. Keperawatan Kesehatan Masyarakat (Perkesmas)

**Definisi:** Perawatan kesehatan masyarakat, termasuk kunjungan rumah (home visit) untuk keluarga rawan.

**Kegiatan utama:**
- Skrining kepala keluarga (PIS-PK/IKS)
- Kunjungan rumah (home visit) keluarga rawan
- Asuhan keperawatan komunitas
- Monitoring keluarga binaan
- Perawatan di rumah (home care)

**PRIMER Implementation:**
| Engine/File | Coverage |
|---|---|
| `VillageRegistry` | 30 keluarga dengan profil SDOH, IKS scoring |
| `VillagerBehavior` | COM-B profiles, PHBS scoring, behavioral risk classification |
| Home visit mechanic | BehaviorCaseEngine `quickVisitVariant` + `stampCard` system |
| Building: `balai_desa` | Listed, belum ada interior |

---

## 4. UKM Pengembangan — 7+ Program Opsional

Program disesuaikan dengan kebutuhan dan prioritas daerah.

### 4.1. Upaya Kesehatan Sekolah (UKS) ✅

| Kegiatan | PRIMER Coverage |
|---|---|
| Skrining kesehatan siswa | `buildingScenes.school` — UKS station |
| Penjaringan & pemeriksaan berkala | Anemia screening, demam/ruam |
| PHBS di sekolah | Cuci tangan, inspeksi kantin, survei jentik |
| P3K & dokter kecil | UKS kotak P3K |

### 4.2. Kesehatan Jiwa ❌ — BELUM ADA

**Kegiatan yang seharusnya ada:**
- Deteksi dini gangguan jiwa di masyarakat (SRQ-20)
- Penanganan ODMK dan ODGJ
- Program BKJ (Bebas Kesehatan Jiwa)
- Pencegahan bunuh diri
- NAPZA prevention
- Pemasungan → penanganan

### 4.3. Kesehatan Gigi dan Mulut ⚠️ — PARTIAL

| Kegiatan | PRIMER Coverage |
|---|---|
| UKGS (di sekolah) | ❌ Belum ada |
| Sikat gigi massal | ❌ Belum ada |
| Perawatan gigi sederhana | ✅ `DentalDiagnosisEngine`, `DentalProcedureEngine` (UKP) |

> DentalEngines ada untuk UKP (perawatan kuratif di poli gigi), tapi belum ada komponen UKM (promotif-preventif gigi di masyarakat).

### 4.4. Kesehatan Lansia ✅

| Kegiatan | PRIMER Coverage |
|---|---|
| Posyandu lansia | ✅ `PosyanduEngine` + `ProlanisEngine` |
| Pemeriksaan berkala | ✅ Prolanis rutin (TD, HbA1c, GDS) |
| Senam lansia | ❌ Belum ada |
| Skrining PTM | ✅ `ProlanisEngine.calculateComplicationRisk()` |

### 4.5. Kesehatan Kerja ⚠️ — PARTIAL

| Kegiatan | PRIMER Coverage |
|---|---|
| Pos UKK | Building listed, belum ada interior |
| Inspeksi APD pekerja | ✅ `buildingScenes.farm` — sawah, gudang pestisida |
| Penyakit akibat kerja | ✅ `bc_pestisida` scenario, leptospirosis |
| Kesehatan kerja sektor informal | ✅ Farm interior (petani, peternak) |

### 4.6. Kesehatan Reproduksi Remaja (PKPR) ❌ — BELUM ADA

**Kegiatan yang seharusnya ada:**
- Konseling kesehatan reproduksi
- Skrining anemia remaja putri
- Edukasi pernikahan dini
- Pencegahan kehamilan remaja
- Pendidikan seksualitas berbasis sekolah

### 4.7. Perawatan Kesehatan Masyarakat di Rumah (Home Care) ⚠️ — PARTIAL

| Kegiatan | PRIMER Coverage |
|---|---|
| Kunjungan rumah | ✅ Home visit mechanic (BC quickVisitVariant) |
| Home nursing | ❌ Belum ada dedicated engine |
| Paliatif komunitas | ❌ Belum ada |

### 4.8. Kesehatan Tradisional ⚠️ — PARTIAL

| Kegiatan | PRIMER Coverage |
|---|---|
| TOGA (Tanaman Obat Keluarga) | Building `toga` listed, interior belum ada |
| Akupresur | ❌ Belum ada |
| Jamu aman vs berbahaya | ✅ IKM `jamu_berbahaya` scenario |
| Pengobatan tradisional | ❌ Belum ada engine |

### 4.9. Kesehatan Olahraga ❌ — BELUM ADA

**Kegiatan yang seharusnya ada:**
- Senam bersama (senam lansia, senam hamil)
- Pemeriksaan kebugaran jasmani
- Promosi aktivitas fisik (GERMAS pilar 1)

---

## 5. UKBM (Upaya Kesehatan Berbasis Masyarakat)

UKBM adalah bentuk partisipasi aktif masyarakat dalam UKM.

| Jenis UKBM | Definisi | PRIMER Building |
|---|---|---|
| **Posyandu** | Pos Pelayanan Terpadu (balita, lansia) | `posyandu` ✅ |
| **Polindes** | Pondok Bersalin Desa | `polindes` ⚠️ |
| **Pos UKK** | Pos Upaya Kesehatan Kerja | `pos_ukk` ⚠️ |
| **Pos Gizi** | Pemulihan gizi buruk | `pos_gizi` ⚠️ |
| **TOGA** | Tanaman Obat Keluarga | `toga` ⚠️ |
| **Dana Sehat** | Iuran kesehatan masyarakat | — |
| **Desa Siaga** | Desa dengan kesiapsiagaan kesehatan | Implicit in village system |

---

## 6. Indikator Kinerja UKM

| Indikator | Target Nasional | PRIMER Variable |
|---|---|---|
| Cakupan K4 (ANC) | ≥ 95% | `PregnancyEngine` visit tracking |
| Cakupan imunisasi dasar | ≥ 93% | `ImmunizationEngine.calculateCoverage()` |
| Balita ditimbang (D/S) | ≥ 85% | `PosyanduEngine` participation |
| Angka Bebas Jentik (ABJ) | ≥ 95% | IKM `bc_dbd_psn` ABJ metric |
| Akses sanitasi layak | 100% (SDGs) | PHBS indicators per family |
| PHBS rumah tangga | ≥ 75% | `VillagerBehavior.calculatePHBSScore()` |
| IKS (Indeks Keluarga Sehat) | ≥ 0.5 | `VillageRegistry` IKS per family |

---

## 7. Mapping Engine ↔ UKM

```
┌─────────────────────────────────────────────────────────────┐
│                    UKM ESENSIAL                              │
│                                                              │
│  Promkes ─── BehaviorCaseEngine + IKMEventEngine            │
│  Kesling ─── IKMScenarioLibrary (PHBS) + buildingScenes     │
│  KIA-KB ──── PregnancyEngine + ImmunizationEngine           │
│  Gizi ────── GrowthChartEngine + PosyanduEngine             │
│  P2P ─────── DiseaseScenarios + EmergingEventTriggers       │
│  Perkesmas ─ VillagerBehavior + VillageRegistry             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    UKM PENGEMBANGAN                          │
│                                                              │
│  UKS ─────── buildingScenes.school                    ✅    │
│  Lansia ──── ProlanisEngine                           ✅    │
│  Kes.Kerja ─ buildingScenes.farm + pos_ukk            ⚠️    │
│  Kes.Tradis─ IKM jamu_berbahaya + toga                ⚠️    │
│  Gigi ────── DentalEngines (UKP only)                 ⚠️    │
│  Kes.Jiwa ── [NOT IMPLEMENTED]                        ❌    │
│  PKPR ────── [NOT IMPLEMENTED]                        ❌    │
│  Kes.OR ──── [NOT IMPLEMENTED]                        ❌    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Referensi Regulasi

1. **Permenkes No. 19 Tahun 2024** — Penyelenggaraan Pusat Kesehatan Masyarakat (berlaku, menggantikan No. 43/2019 dan No. 44/2016)
2. **Permenkes No. 43 Tahun 2019** — Pusat Kesehatan Masyarakat (dicabut, referensi historis)
3. **Permenkes No. 44 Tahun 2016** — Pedoman Manajemen Puskesmas (dicabut)
4. **Permenkes No. 18 Tahun 2024** — Petunjuk Teknis Pengelolaan Dana BOK
5. **Permenkes No. 37 Tahun 2023** — Insentif UKM dalam BOK
6. **Permenkes No. 4 Tahun 2019** — Standar Pelayanan Minimal (SPM) Bidang Kesehatan
7. **PP No. 2 Tahun 2018** — Standar Pelayanan Minimal
8. **UU No. 36 Tahun 2009** — Kesehatan
9. **UU No. 17 Tahun 2023** — Kesehatan (pengganti UU 36/2009)

---

*This codex is a living document. Update as new Permenkes or gameplay engines are added.*
