# PRIMER — Deepthink Dossier: Gamification Strategy

> **Tujuan dokumen**: Beri AI penilai (DeepThink/Grok-3/Claude Opus) konteks lengkap tentang PRIMER sehingga ia dapat memberikan penilaian independen tentang strategi gamifikasi tanpa harus menebak.
> **Waktu**: April 2026, menjelang target rilis Juni 2026.
> **Pertanyaan terbuka**: "Arah gamifikasi PRIMER harus seperti apa supaya 50 mahasiswa FK belajar dengan baik tanpa mengkompromikan integritas edukasi?"

---

## 1. IDENTITAS PROYEK

**PRIMER** (Primary Care Manager Simulator) = browser-based medical education game.

- **Target pemain**: Mahasiswa Fakultas Kedokteran Indonesia (awalnya FK UNAIR), **50 mahasiswa concurrent** per sesi lab komputer
- **Target rilis**: **Juni 2026** (lab terstandar); saat ini versi 0.8.5 / 0.9 "Clinical Hardening"
- **Pengembang tunggal**: Dr. Anak Agung Bagus Wirayuda, MD PhD, ITS MEDICS
- **HAKI**: Surat Pencatatan Ciptaan No. EC002026019623 (Kemenkumham RI, 31 Januari 2026)
- **Peran pemain di dalam game**: dokter baru yang ditempatkan sebagai **Kepala Puskesmas di desa rural** (meniru pengalaman PTT/dokter-internship Indonesia)
- **Stack**: React 19 + Vite 7 + Zustand + Supabase + Tailwind + Three.js (optional 3D)
- **Bahasa**: Indonesia-first, i18n bilingual (id/en)

---

## 2. DOMAIN GAMEPLAY

### 2.1 Dua sumbu kompetensi Puskesmas
- **UKP** (Upaya Kesehatan Perorangan) — klinik individu: anamnesis, pemeriksaan fisik, lab, diagnosis ICD-10, resep obat, prosedur ICD-9-CM, rujukan SISRUTE
- **UKM** (Upaya Kesehatan Masyarakat) — komunitas: PIS-PK 12 indikator Kemenkes, Posyandu, Prolanis (DM/HT kronis), home visit, kader, outbreak response

### 2.2 Konten yang sudah ada
| Aset | Jumlah |
|---|---:|
| Patient cases (medical scenarios) | **1,358** kasus di 28 modul (infectious, metabolic, CVS, respiratory, ENT, neuro, ophtha, reprod, MSK, digestive, hema, psychiatry, STI, trauma, forensik, general) |
| ICD-10 codes | **52,346** (master + curated 600) |
| Medication database | **400+** obat dengan harga, kontraindikasi, ICD-9 procedure mapping |
| FKTP 144 mandatory diseases | **Lengkap** |
| Behavior Change scenarios (UKM) | **20 BC disease scenarios** (Tier 1–4: core, important, emerging, environmental) |
| IKM community events | **30 scenarios** (5-7 fase per event, overlap guard, seasonal trigger) |
| Anamnesis variations | **127 KB**: 6 persona × 159 kasus = **954 persona-adapted responses** |
| Village families | **200 KK**, 8 RW progressive unlock berbasis hari + reputasi |
| PIS-PK Kemenkes indicators | **12 resmi + 1 PSN** dengan applicability demografi |

### 2.3 Framework perilaku yang terpasang
- **COM-B** (Michie 2011) — Capability-Opportunity-Motivation → Behavior; wheel interaktif EliteCOMBWheel; scoring diagnosis dengan penalti false-positive + apathy
- **TTM** (Prochaska & DiClemente) — 5 stages: precontemplation → contemplation → preparation → action → maintenance; social ripple via SOCIAL_ROLES graph (kader, tokoh agama, ibu PKK, dll — total 8 roles)
- **HBM** (implisit di scenario triggers) — perceived severity/susceptibility
- **9 Intervention Functions** (Michie) — education, persuasion, incentivisation, coercion, training, enablement, modelling, environmental, restriction
- **SDOH Armor**: resistance score 0–32 dari pendidikan/ekonomi/sanitasi

### 2.4 Mekanika pendukung
- **TheDirector AI pacing**: 5 stress profile (mercy → breathing → normal → pressure → crisis) dengan gift system (mercy mode kasih energy/spirit/reputation boost)
- **UKM→UKP karma bridge**: BC case fail/partial → spawn pasien klinis deterministic (misal kasus kudis gagal hari 5 → impetigo muncul di poli hari 8-12)
- **Seasonal state**: kemarau/hujan mempengaruhi outbreak trigger (DBD hujan, ISPA kemarau), bridge outage, travel cost
- **Distance decay**: rumah jauh dari Puskesmas dapat penalty drift IKS lebih besar + severity boost
- **Kader Lokal** (IKS 100%): auto-promote, lindungi 3 tetangga terdekat dari drift

---

## 3. GAMIFICATION PRIMITIVES — YANG SUDAH ADA

### 3.1 Sistem progresi individual
- **XP + Level**: `LevelingSystem.js` — 1000 XP/level linear, no cap
- **Reputation**: 0–100, naik dari outcome baik (diagnosa akurat, IKS naik) & turun dari kegagalan
- **Energy / Spirit / Stress / Hygiene**: daily wellness cycle dengan morning status
- **Skill points**: diakuisisi saat level-up (diagnostic, communication, procedural, public-health)

### 3.2 Achievement-like tracking
- **Quest system**: daily & weekly quests di `QuestEngine.js` (rewards 40-250 XP)
- **IKS PIS-PK**: 0–100%, tier Sehat / Pra-Sehat / Tidak Sehat (Permenkes 39/2016)
- **Readiness TTM**: agregat stage engaged families (0–100)
- **Akreditasi Puskesmas**: Dasar → Madya → Utama → Paripurna
- **BPJS KBK** (Kapitasi Berbasis Kinerja): 3 indikator (angka kontak, RRNS ≤5%, rasio peserta PRB ≥50%) → multiplier kapitasi 0.8x–1.3x
- **Clinical KPI**: akurasi diagnosis, treatment appropriateness, antibiotic stewardship, rasio rujukan non-spesialistik (RRNS)

### 3.3 Content unlock & progression
- **RW progressive unlock**: Game mulai dengan 30 KK (RW 01-02), RW 03-08 unlock berbasis `day + reputation` threshold
- **Facility upgrade**: Puskesmas interior, Pustu, Polindes, FOB (Forward Operating Base)
- **Vehicle progression**: jalan kaki → sepeda → motor dinas → puskel
- **BC scenario tiers**: Tier 1 core (mulai hari 1), Tier 2-4 emerging (unlock by day/season/probability)

### 3.4 Social / emergent identity
- **Champion system**: keluarga IKS 100% jadi kader lokal, buff 3 tetangga
- **Warung Intel**: bayar untuk reveal 5 keluarga terdekat dengan kebutuhan prioritas
- **Social graph**: 8 role dengan influence 0.1–0.5 (tokoh_agama paling tinggi)

### 3.5 Narative/context
- **Calendar events**: hari kesehatan nasional, kunjungan Dinkes
- **Morning briefing**: staff report, stock alerts, priority suggestion
- **End-of-day debrief**: DebriefEngine rangkum pencapaian hari
- **Story database** (`StoryDatabase.js`): narrative beats

---

## 4. GAMIFICATION GAPS — YANG BELUM/LEMAH

### 4.1 Skor terpadu — **TIDAK ADA**
- `CloudSaveService.extractLeaderboardData()` punya formula ad-hoc `reputation×10 + level×50 + knowledge×2 + day×5` → arbitrer, tidak mencerminkan 4-dimensi UKP/UKM/Manajemen/Wellness
- Tidak ada formula "skor akhir" untuk satu playthrough

### 4.2 Endpoint / victory — **BARU DITAMBAH TAPI BELUM LENGKAP**
- Sesi sebelumnya: tambah `VictoryModal` dual-criterion (IKS PIS-PK ≥70% AND Readiness TTM ≥60) di `MainLayout.jsx` — muncul sekali saat dicapai, pemain bisa lanjut main
- Tidak ada "game over" pedagogis (hanya warning1/2/fired/fainted untuk kegagalan kinerja)
- Tidak ada **skor akhir terkompilasi** dengan feedback pedagogis

### 4.3 Achievement / lencana — **TIDAK ADA**
- Tidak ada AchievementEngine, tidak ada badge koleksi
- Quest engine ada tapi quest itu ephemeral (daily/weekly), bukan lifetime progression

### 4.4 Leaderboard / kompetisi — **KODE ADA, BELUM WIRED**
- `LeaderboardService.js`, `LeaderboardPanel.jsx`, schema Supabase `leaderboard` — tapi `.env` kosong default, tidak di-surface di navigasi
- Tidak ada dashboard dosen (membutuhkan skor terpadu dulu)

### 4.5 Tutorial / onboarding — **TIDAK ADA**
- `OpeningScreen.jsx` + `PlayerSetup.jsx` hanya character creation, tidak ada tutorial langkah pertama
- 50 mahasiswa yang belum pernah buka game akan menghabiskan 20-30 menit pertama bingung

### 4.6 Chapter / act structure — **TIDAK ADA**
- Game saat ini adalah sandbox time-progression (hari 1 → hari N tanpa batas)
- Tidak ada milestone bulanan atau "babak" yang unlock fitur baru sesuai konteks mahasiswa

### 4.7 Replayability loop — **LEMAH**
- Seed deterministic ada, tapi tidak ada "New Game+" mode
- Pemain yang sudah capai IKS 80% tidak punya alasan eksplisit main lagi

---

## 5. KONTEKS PEDAGOGIS YANG WAJIB DIHORMATI

### 5.1 Kurikulum referensi
- **SKDI 2012** — 144 penyakit wajib tuntas FKTP (level 4A)
- **PIS-PK Kemenkes** — Permenkes 39/2016, 12 indikator resmi
- **Standar Akreditasi Puskesmas** — Kemenkes, 5 bab
- **Fornas BPJS** — obat rasional
- **ICD-10 + ICD-9-CM** — coding standard

### 5.2 Prinsip tidak-boleh-dilanggar
- **Keamanan obat mutlak**: alergi checking, kontraindikasi, interaksi. Tidak boleh ada intervensi gamifikasi yang "mengabaikan" keselamatan demi skor
- **Rujukan rasional**: RRNS ≤5% = indikator Kemenkes. Over-refer = performance buruk, tapi under-refer juga berbahaya. Gamifikasi harus cermat di sini
- **SKDI 4A harus dituntaskan di FKTP**: merujuk kasus 4A = penalti, bukan shortcut
- **Preventif vs kuratif**: UKM harus se-weight UKP — jangan buat mode yang hanya reward klinis
- **Behavior change realistis**: TTM stage advancement harus berdasarkan quality intervensi, bukan grind

### 5.3 Risiko yang harus dihindari
- **Miskonsepsi framework**: IKS Kemenkes ≠ readiness TTM (sekarang sudah dipisahkan di engine)
- **Gamifikasi distortif**: contoh buruk = "dapat badge kalau rujuk 20 pasien" (mendorong over-refer)
- **Reward loops yang melanggar realita klinis**: contoh buruk = "XP bonus kalau resep antibiotik" (bertentangan dengan antibiotic stewardship)

---

## 6. TARGET USAGE — SKENARIO PEMAKAIAN

### 6.1 Skenario yang diinginkan (kombinasi, belum final)
- **Lab kampus 2 jam**: 50 mahasiswa main bersamaan, dosen monitor dashboard, skor final dikumpulkan
- **PR/tugas rumah**: mahasiswa main di rumah, submit save/screenshot ke dosen
- **Self-paced learning**: mahasiswa belajar mandiri untuk ujian kompetensi/OSCE

### 6.2 Belum terjawab
- Apakah dosen expect satu mahasiswa main 1×-tuntas, atau beberapa kali ulang?
- Apakah durasi ideal 1 playthrough: 2 jam? 10 jam? 30 jam?
- Apakah mahasiswa akan main bareng kelas (competitive) atau individual (collaborative)?

---

## 7. ARSITEKTUR TEKNIS — YANG RELEVAN UNTUK GAMIFIKASI

### 7.1 State management
- **Zustand** + persist middleware (localStorage + cloud sync)
- **9 slices**: nav, world, player, finance, publicHealth, staff, clinical, meta, orchestrator
- Save/load canonical payload sudah robust; `villageVictoryAcknowledged` flag baru ditambah

### 7.2 Save/resume
- Single save slot per user (sekarang), extensible to multi-slot
- Cloud save via Supabase (belum config di dev)

### 7.3 Analytics hooks siap
- `AnalyticsService.js` buffered event tracking — bisa dipakai untuk achievement trigger logging

### 7.4 Bundle / performance
- Initial chunk ~660 KB gzip core, +455 KB vendor-3d (lazy)
- `size-limit` devDep ada tapi belum ada config budget
- 50-user concurrent di Vercel/Supabase free tier masih fit

---

## 8. TIGA MODEL KANONIK YANG SEDANG DIPERTIMBANGKAN

### Model A — "Residensi 180 Hari"
- Pemain = dokter PTT kontrak 6 bulan
- Hari 180 = hard endpoint → Laporan Akhir dengan skor 4-dimensi
- Formula usulan: `30% UKP + 30% UKM + 20% Manajemen + 20% Ketahanan`
- Label capaian: PTT Teladan (≥85) / Kompeten (70–84) / Lulus (55–69) / Belajar (<55)

### Model B — "Ujian Kompetensi 30 Hari"
- Mode terpisah dari Karir, skenario pre-defined (desa X, outbreak DBD, 4 kasus Prolanis tertentu, pasien IGD seed)
- Seed deterministic sama untuk semua mahasiswa → fair comparison
- Dosen lihat performa komparatif via leaderboard kampus

### Model C — "Sandbox Mastery"
- Tanpa endpoint
- Lencana SKDI (144 penyakit didiagnosa benar), Lencana PIS-PK (12 indikator ≥80% desa), Lencana Outbreak (3 wabah contained), Lencana Kader (5 kader aktif)
- Victory modal saat milestone utama tercapai (IKS ≥70% etc sudah ada)

### Kombinasi yang saya (Claude) rekomendasikan
**A sebagai tulang punggung + C sebagai layer achievement over-time.** B ditahan untuk v1.1 setelah A stabil.

---

## 9. PERTANYAAN KALIBRASI BELUM TERJAWAB OLEH DEVELOPER

1. Scenario pemakaian dominan: (a) lab kampus, (b) tugas rumah, (c) self-paced?
2. Kompetisi antar mahasiswa diinginkan atau tidak?
3. Siapa yang lihat skor akhir: dosen saja, mahasiswa saja, atau keduanya?
4. Replay expected: 1× tuntas atau ulang-ulang?
5. Game selesai saat victory, atau main terus?
6. Durasi ideal 1 playthrough?
7. Gimmick dilema: Kemenkes-realistis vs naratif-dramatis vs puzzle-strategy?

---

## 10. CONSTRAINTS EKSEKUSI

- **Developer**: 1 orang, waktu terbatas, ~8 minggu ke rilis Juni
- **No paid services**: gratis-tier only (Vercel + Supabase)
- **No external API calls at runtime** untuk fitur inti (offline-first)
- **Existing commitments**: PR #2 sudah merge (PIS-PK engine + UKM↔UKP bridge + wilayah polish)
- **Backlog masih banyak** selain gamifikasi: keyboard nav, extract komponen besar (WilayahPage 1,091 LOC), champion demotion, Posyandu activity wiring, outbreak investigation UI, Prolanis club meeting

---

## 11. REFERENSI LITERATUR YANG RELEVAN

- Prochaska, J. O., & DiClemente, C. C. (1983). *Stages and processes of self-change of smoking.* J Consult Clin Psychol.
- Michie, S., et al. (2011). *The behaviour change wheel: A new method for characterising and designing behaviour change interventions.* Implementation Science.
- Deci, E. L., & Ryan, R. M. (2000). *Self-Determination Theory* (SDT) — autonomy, competence, relatedness.
- Graafland, M., et al. (2012). *Systematic review of serious games for medical education and surgical skills training.* Br J Surg.
- Hamari, J., Koivisto, J., & Sarsa, H. (2014). *Does gamification work? — A literature review of empirical studies on gamification.* HICSS.
- Permenkes RI No. 39/2016 tentang PIS-PK.
- Standar Kompetensi Dokter Indonesia (SKDI) 2012, KKI.

---

## 12. REQUEST

Bantu jawab pertanyaan gamifikasi PRIMER dengan:
1. Penilaian independen atas 3 model kanonik (validasi/kritik)
2. Usulan model alternatif jika ada yang lebih cocok
3. **Formula skor akhir konkret** yang pedagogically sound
4. Struktur progresi (chapter/milestone/unlock) yang realistis untuk 8 minggu remaining dev time
5. Red flag / "jangan lakukan ini" list berdasarkan literatur gamifikasi medis
6. Implementation roadmap bertahap — prioritas minggu-ke-minggu

Lihat super prompt di `docs/deepthink_prompt_gamification.md` untuk format deliverable yang diharapkan.
