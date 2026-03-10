# Konteks Proyek PRIMER — UKM ↔ UKP ↔ Wilayah Integration

## Tentang PRIMER

PRIMER adalah game simulasi dokter puskesmas berbasis web (React 18 + Vite + Zustand) yang mengajarkan mahasiswa kedokteran tentang pelayanan kesehatan primer di Indonesia. Game ini memiliki dua pilar utama:

1. **UKP (Upaya Kesehatan Perorangan)** — Layanan klinik/poli: pasien datang, anamnesis, pemeriksaan fisik, diagnosis, tatalaksana, resep obat. Sudah cukup mature.
2. **UKM (Upaya Kesehatan Masyarakat)** — Kerja komunitas: kunjungan rumah, promosi kesehatan, surveilans, intervensi perilaku. Baru content-complete tapi **belum ter-wire ke game loop**.

Pemain berperan sebagai dokter puskesmas di desa fiksi. Setiap hari: morning briefing → layanan poli (UKP) → kunjungan wilayah (UKM) → evening debrief. Ada sistem energy, reputasi, XP, dan skor IKS (Indeks Keluarga Sehat).

---

## Apa yang Sudah Ada (Content Layer — Complete)

### 15 Building Interior Scenes (`buildingScenes.js`)
Setiap bangunan di desa punya interior interaktif point-and-click style:

| Building | UKM Area | Stasiun Kerja |
|----------|----------|---------------|
| `posyandu` | KIA/Imunisasi | Timbang, Imunisasi, PMT, Vitamin A |
| `school` | UKS/UKGS | UKS, Kantin, CTPS, Pemeriksaan Gigi |
| `farm` | Kes. Kerja/Lingkungan | Sawah, Gudang Pestisida, Irigasi |
| `pustu` | KIA-KB | ANC, Imunisasi, KB, Register |
| `kb_post` | Keluarga Berencana | Konseling KB, IUD Kit, Data BKKBN |
| `balai_desa` | Promkes | Papan Data IKS, Musyawarah, Media KIE |
| `mck` | Sanitasi/STBM | Jamban, CTPS, Pengolahan Limbah |
| `pos_gizi` | Gizi/PMT | Timbang KMS, Demo PMT, 1000 HPK |
| `pos_ukk` | Kes. Kerja | Skrining Pekerja, APD, P3K |
| `pamsimas` | Air Bersih | Bak Penampung, Klorinasi, Distribusi |
| `bank_sampah` | Kesling/3R | Pemilahan, Kompos, Ecobrick |
| `polindes` | Persalinan | Partus Set, Nifas, Register Kohort |
| `market` | Keamanan Pangan | Daging/Ikan, Tes BTP, Sanitasi |
| `warung` | Gizi Masyarakat | Minyak Jelantah, Isi Piringku |
| `toga` | Kes. Tradisional | Tanaman Obat, Jamu Safety |

Masing-masing punya: NPC dialog (kader, bidan, dll), investigasi temuan (findings dengan severity), COM-B barrier discovery, dan linked scenarios.

### 30 IKM Scenarios (`IKMScenarioLibrary.js`)
Event-event kesehatan masyarakat yang bisa terjadi di desa:

| Kategori | Jumlah | Contoh Skenario |
|----------|--------|----------------|
| 🧼 PHBS | 5 | cuci_tangan, bab_sembarangan, sampah_menumpuk |
| 🏮 Sosio-Kultural | 4 | tolak_vaksin, kesurupan_massal, dukun_beranak |
| 🌿 Kes. Lingkungan | 5 | pestisida_pertanian, air_minum_tercemar, banjir_diare |
| 🥗 Gizi | 4 | stunting_deteksi, gizi_buruk_balita, mpasi_salah |
| 🧠 Kes. Jiwa | 3 | depresi_pascabencana, psikotik_akut, bunuh_diri_remaja |
| 🎒 PKPR/Remaja | 3 | anemia_remaja, teen_pregnancy, napza_remaja |
| 🍽️ Keamanan Pangan | 3 | makan_sembarangan, formalin_tahu, jajan_anak_sekolah |
| 🌿 Kes. Tradisional | 3 | jamu_berbahaya, dukun_beranak, herbal_interaksi_obat |

Setiap skenario punya:
- `triggerConditions`: season, minDay, probability, SDOH requirements
- `phases`: dialog bercabang multi-fase dengan choices dan impact
- `outcomes`: iks_score, reputation, xp
- `relatedCases`: **list ID diagnosis UKP yang terkait** (e.g., `bab_sembarangan` → `['diare_akut']`)
- `educationTopics`: topik edukasi untuk Wiki/Codex

### Engine-Engine yang Sudah Ada

**IKMEventEngine.js** — Engine lengkap untuk IKM events:
- `evaluateIKMTriggers(state)` — Evaluasi semua skenario vs kondisi game saat ini
- `makeChoice(eventInstance, choiceIndex)` — Proses pilihan player di dialog
- `resolveEvent(eventInstance)` — Selesaikan event, akumulasi impact
- `calculateEventImpact(eventInstance)` — Hitung delta: reputasi, XP, IKS, dll
- `isBlockedByBC(ikmId, activeBCCases)` — Overlap guard agar IKM dan BC tidak duplikat
- `getSeasonForDay(day)` — Musim hujan/kemarau untuk trigger seasonal

**BehaviorCaseEngine.js** — Engine untuk kasus perubahan perilaku (behavior change):
- `createBehaviorCase(scenarioId, mode, day)` — Buat kasus BC dari DiseaseScenario
- `scoreCOMBDiagnosis(case, playerBarriers)` — Skor diagnosis COM-B player
- `scoreIntervention(case, interventionId)` — Skor intervensi yang dipilih
- `resolveOutcome(case)` — Resolusi akhir + readiness change

**PatientGenerator.js** — Generate antrian pasien harian untuk poli UKP.

### UI Components yang Sudah Ada

- **WilayahPage.jsx** — Peta desa isometric + building drawer sidebar
- **BuildingGamePanel.jsx** — Render interior bangunan: stasiun kerja, NPC dialog, findings, COM-B wheel, linked scenarios badges
- **MorningBriefingModal.jsx** — Briefing pagi sebelum operasional
- **RumahDinas.jsx** — Hub utama player (rumah dinas dokter)

---

## 4 Integration Gaps — Yang Perlu Di-Wire

**Semua engine dan content exist, tapi TIDAK terhubung satu sama lain di runtime.**

### Gap 1: 🔴 CRITICAL — IKMEventEngine Tidak Terhubung ke GameStore

`evaluateIKMTriggers()` tidak pernah dipanggil dari mana pun. Engine exist tapi unwired.

**Yang dibutuhkan:**
- Tambah `ukm` slice di Zustand store (`useGameStore.js`):
  ```js
  ukm: {
      activeIKMEvents: [],      // Event IKM yang sedang aktif
      completedIKMIds: [],       // ID event yang sudah selesai
      cooldowns: {},             // categoryId → lastTriggerDay
      activeBCIds: [],           // Behavior Change cases aktif
      buildingProgress: {}       // buildingType → { completedStations, findings }
  }
  ```
- Panggil `evaluateIKMTriggers()` di siklus day-advance
- Expose `activeIKMEvents` ke UI (MorningBriefingModal atau WilayahPage)

### Gap 2: 🟠 HIGH — `relatedCases` Tidak Generate Pasien UKP

Ini jembatan inti pedagogi UKM→UKP. Konsep: **jika player menemukan masalah `bab_sembarangan` di desa → kasus `diare_akut` muncul lebih banyak di poli keesokan harinya.** Player belajar bahwa UKM yang buruk menyebabkan beban UKP membludak.

Saat ini `relatedCases` hanya metadata mati di setiap skenario.

**Yang dibutuhkan:**
- Saat `resolveEvent()`, produce `caseBoosts`:
  ```js
  // contoh output
  [{ caseId: 'diare_akut', boost: 0.3, sourceEvent: 'bab_sembarangan' }]
  ```
- `PatientGenerator` consume `caseBoosts` untuk meningkatkan probabilitas kasus terkait di patient queue hari berikutnya

### Gap 3: 🟡 MEDIUM — `linkedScenarios` Badge Tidak Interaktif

Badge "Kasus Terkait" di interior gedung ditampilkan sebagai `<span>` pasif. Seharusnya bisa di-klik untuk: (a) trigger IKM event terkait, atau (b) buka Wiki Codex entry.

**Yang dibutuhkan:**
- Ganti `<span>` jadi `<button>` dengan handler `onTriggerScenario`
- Wire dari WilayahPage ke IKMEventEngine atau Wiki

### Gap 4: 🟢 LOW-MEDIUM — Building Completion Tidak Mutasi SDOH Desa

Menyelesaikan semua stasiun di `pamsimas` memberi XP/reputasi tapi tidak menaikkan skor akses air bersih desa.

**Yang dibutuhkan:**
- Tambah `sdohDelta` di `completionReward`:
  ```js
  completionReward: { xp: 120, reputation: 15, sdohDelta: { water_access: +10 } }
  ```
- Apply ke `villageData` saat building complete

---

## Arsitektur Target (Setelah Wiring)

```
Peta Wilayah
  → klik building → BuildingGamePanel → complete stations → SDOH desa naik ↑
  → klik linkedScenario → trigger IKM event

Day Advance
  → evaluateIKMTriggers() → IKM event muncul di morning briefing
  → player pilih aksi dalam dialog bercabang
  → resolveEvent() → impact (reputasi, XP, IKS) + caseBoosts

caseBoosts
  → masuk PatientGenerator → kasus diare/gizi/dll muncul lebih banyak di poli
  → UKP clinical service handle kasus
  → player belajar: UKM buruk = UKP membludak = feedback loop

SDOH rendah
  → lebih banyak IKM events triggered → mengharuskan player turun ke wilayah
  → cycle berulang: UKM ↔ UKP saling mempengaruhi
```

## Tech Stack
- React 18 + Vite (client-side only, no backend)
- Zustand (`useGameStore.js`) — state management
- File-file kunci:
  - `src/store/useGameStore.js` — Zustand store
  - `src/game/IKMEventEngine.js` — IKM trigger/phase/resolution
  - `src/game/BehaviorCaseEngine.js` — Behavior change case lifecycle
  - `src/game/PatientGenerator.js` — Generate patient queue
  - `src/game/MorningBriefing.js` — Morning briefing data
  - `src/components/wilayah/BuildingGamePanel.jsx` — Building interior UI
  - `src/components/WilayahPage.jsx` — Map + building drawer
  - `src/components/wilayah/buildingScenes.js` — 15 building scene data
  - `src/content/scenarios/IKMScenarioLibrary.js` — 30 IKM scenarios
  - `src/pages/RumahDinas.jsx` — Player hub + morning briefing host
