# SESSION RECOVERY - 2026-04-03

Dokumen ini dibuat untuk memulihkan konteks proyek PRIMER setelah reformat Windows dan putusnya sesi kerja.

## Tujuan Dokumen

Menjawab empat hal:

1. Apa sebenarnya PRIMER itu dan untuk siapa.
2. Bagaimana loop gameplay dan sistem-sistem utamanya bekerja.
3. Stack teknis, arsitektur, dan engine apa saja yang aktif.
4. Progress terakhir yang sudah masuk git dan WIP lokal yang belum dikomit.

## Ringkasan Eksekutif

PRIMER adalah game simulasi edukasi dokter Puskesmas berbasis browser. Pemain berperan sebagai dokter baru di desa Indonesia dan harus menangani layanan klinis, program kesehatan masyarakat, outbreak, logistik, SDM, fasilitas, serta kondisi pribadi dokter sendiri.

Secara teknis, proyek ini bukan dibangun dengan Unity atau Godot. Runtime utama adalah React 19 + Vite 7 + Zustand, dengan banyak "engine" game berbentuk modul JavaScript murni untuk clinical reasoning, patient generation, outbreak, event UKM, dan geospatial village simulation.

Fase pengembangan terbaru bergerak kuat ke simulasi `Wilayah`: peta 2D/3D, travel energy berbasis jarak, status jembatan musiman, severity drift sektor timur, warung intel, local champion, service coverage rings, dan visual cue outbreak/infrastruktur. Ekspansi desa ke `200 KK` sudah hidup di runtime, bukan sekadar rencana.

## Identitas Proyek

- Nama: `PRIMER`
- Ekspansi makna: `Primary Care Simulator` / `Primary Care Manager Simulator`
- Bentuk: single-player browser-based simulation game
- Domain: pendidikan kedokteran layanan primer Indonesia
- Peran pemain: dokter Puskesmas baru di desa
- Sasaran penggunaan: mahasiswa kedokteran, pelatihan akademik, showcase institusi
- Target operasional cloud yang pernah ditulis di dokumen: sekitar `50` mahasiswa konkuren

Referensi konteks utama:

- `PRIMER_BIBLE.md`
- `PRIMER_DOSSIER.md`
- `AGENT_CONTEXT.md`
- `docs/GAME_DESIGN_LOG.md`

## Tujuan Desain Game

Tujuan desain PRIMER bukan hanya "main dokter", tetapi mensimulasikan peran dokter primer Indonesia secara utuh:

- UKP: anamnesis, pemeriksaan, diagnosis, lab, terapi, prosedur, billing, CPPT, rujukan
- UKM: Posyandu, Prolanis, home visit, PIS-PK, surveilans, perilaku kesehatan masyarakat
- Manajerial: kapitasi BPJS, logistik obat, pengembangan fasilitas, SDM, KPI, akreditasi
- Naratif-sistemik: keputusan klinis memengaruhi kondisi desa, dan kondisi desa memengaruhi kasus klinis
- Pameran/akademik: ada ambisi menjadikan fitur UKM dan peta desa sebagai exhibition-ready showcase

Secara desain, proyek ini sangat menekankan jembatan `UKM <-> UKP`, yang di dokumen disebut sebagai semacam karma loop: kegagalan intervensi komunitas akan memunculkan konsekuensi klinis di layanan.

## Sejarah Singkat yang Terlihat dari Repo

### Januari 2026

- Hak cipta/HaKI sudah dicatat dan disebut di dokumentasi utama.

### Maret 2026

- Proyek masuk fase `Clinical Hardening`.
- Refactor besar store dilakukan untuk mengatasi "god object" di `useGameStore.js`.
- `2026-03-27`: CP2 store slicing dinyatakan selesai.
- `2026-03-27`: target pipeline berikutnya ditetapkan: patient factory, village expansion, living village, lalu EMR mobile UX.
- `2026-03-31`: blueprint peta desa v2.x disusun secara serius, termasuk dual-mode `2D blueprint + 3D diorama`, geospatial SDoH, unlock RW progresif, dan guardrail performa.

### April 2026

- `2026-04-01` sampai `2026-04-02`: banyak commit gameplay untuk sistem `Wilayah`.
- `2026-04-02`: commit `02880fa` memulihkan `docs/blueprint_peta_desa.md` dan update bible.
- `2026-04-02`: commit `8f872d9` memperbaiki readability champion dan intel di map serta menambah visual regression test sprint 5.

## Loop Gameplay yang Aktif

Loop besar yang aktif di kode:

1. Opening cinematic.
2. Pilih slot save.
3. Setup dokter/pemain.
4. Masuk gameplay utama.
5. Kelola hari kerja: lihat dashboard, tangani pasien, jalankan program komunitas, kelola sumber daya.
6. Hari berlanjut melalui tick/time loop.
7. End-of-day, arsip, progression, dan lanjut hari berikutnya.

Komponen runtime yang menegaskan alur ini:

- `src/App.jsx`
- `src/components/MainLayout.jsx`
- `src/context/GameContext.jsx`
- `src/hooks/useGameLoop.js`

### Halaman Utama yang Aktif

- `Dashboard`
- `Layanan`
- `Wilayah (Map)`
- `Gedung`
- `SDM (Squad)`
- `Sarana (Logistik)`
- `Diklat`
- `MAIA Codex`
- `Arsip`
- `Kantor Desa`
- `Rumah Dinas`

## Gameplay Klinis

Area klinis utama berjalan di `src/components/ClinicalPage.jsx` dan `src/components/PatientEMR.jsx`.

Flow klinis yang tampak aktif:

- antrean pasien reguler
- EMR modular: anamnesis, physical exam, lab, assessment, treatment, procedures, education, billing, history
- IGD/emergency dengan triase dan tindakan stabilisasi
- panel Prolanis
- farmasi/lab
- CPPT dan reasoning support

Engine kunci:

- `src/game/PatientGenerator.js`
- `src/game/AnamnesisEngine.js`
- `src/game/ClinicalReasoning.js`
- `src/game/CPPTEngine.js`
- `src/game/BillingEngine.js`
- `src/game/LabEngine.js`
- `src/game/EmergencyCases.js`

Catatan penting:

- `PatientGenerator` sudah masuk fase refactor dan bertumpu pada `CaseLibrary`, `VillageRegistry`, SDoH, musim, jarak layanan, dan spatial hazard.
- MAIA / clinical reasoning bukan kosmetik UI saja, tetapi punya coverage score, OLD CARTS tracking, essential question coverage, dan alert reasoning.

## Gameplay Wilayah dan UKM

Ini adalah area yang paling aktif dikerjakan menjelang putus sesi.

`WilayahPage` adalah salah satu pusat simulasi terbesar di proyek. Halaman ini memadukan:

- peta desa
- overlay PIS-PK
- surveilans
- PHBS
- perilaku
- building interaction
- Posyandu
- Pustu/Polindes
- IKM event/community diagnosis
- home visit
- behavior change case

### Dua Mode Peta

- `2D DENAH`
- `3D DIORAMA`

Implementasi:

- `src/components/wilayah/2d/Map2DBlueprint.jsx`
- `src/components/wilayah/3d/WilayahDiorama.jsx`

2D adalah mode default dan tampak menjadi mode strategis utama. 3D bersifat opsional dan aktif jika WebGL tersedia.

### Sistem Wilayah yang Penting

- `bridgeSeasonalState.js`
  - jembatan gantung timur bisa normal, rawan banjir, atau putus
  - outage dapat bertahan beberapa hari
- `homeVisitTravel.js`
  - biaya energi home visit dipengaruhi jarak, sektor, kendaraan, dan status jembatan
- `warungIntel.js`
  - membuka intel rumah/famili terdekat secara deterministik
- `localChampion.js`
  - keluarga dengan IKS sempurna bisa jadi champion dan memberi efek lingkungan
- `kbkPerformance.js`
  - rata-rata IKS desa memengaruhi multiplier kapitasi KBK
- `serviceDistance.js`, `spatialDistanceDecay.js`, `spatialContext.js`
  - jarak layanan punya konsekuensi gameplay, bukan hanya kosmetik peta

## Simulasi Desa

Status penting yang sudah terkonfirmasi di runtime:

- `VillageRegistry` sekarang menggabungkan `30 KK asli + 170 KK ekspansi = 200 KK`
- ada sistem `RW unlock` progresif
- data keluarga, indikator, dan SDoH dipakai langsung oleh gameplay
- halaman live hasil inspeksi juga menampilkan `200 KK` dan `IKS 85%`

File inti:

- `src/domains/village/VillageRegistry.js`
- `src/domains/village/village_families.js`
- `src/domains/village/village_families_expanded.js`
- `src/domains/village/village_data_expanded.js`

Implikasi penting:

- target ekspansi desa bukan lagi roadmap murni
- simulasi sudah berpindah dari desa kecil ke desa yang lebih layak untuk campaign dan progression

## State Management dan Arsitektur

Arsitektur runtime saat ini:

- source of truth utama: Zustand store
- facade untuk komponen: `GameContext`
- persist save-game: zustand persist
- guard dan normalizer: runtime model/adapters

Store shell:

- `src/store/useGameStore.js`

Slice utama:

- `createNavSlice.js`
- `createWorldSlice.js`
- `createPlayerSlice.js`
- `createFinanceSlice.js`
- `createPublicHealthSlice.js`
- `createStaffSlice.js`
- `createClinicalSlice.js`
- `createMetaSlice.js`
- `createOrchestratorSlice.js`

Guard penting:

- `PatientRuntime.js`
- `EncounterRuntime.js`
- `InventoryRuntime.js`
- dispatch guard / freeze protocol / invariant trap

Refactor ini lahir dari problem besar sebelumnya:

- schema fragmentasi
- nested transaction bug
- split-brain state
- regressi karena store terlalu besar

Dokumen yang menjelaskan latar belakang ini:

- `docs/ARCHITECTURE_LOG.md`
- `docs/POST_CP2_DOSSIER.md`
- `docs/codex_root_cause_dossier_2026-03-24.md`
- `docs/BUG_TRIAGE_LOG.md`

## Stack Teknis

Stack yang aktif di repo:

- Frontend: React 19
- Bundler: Vite 7
- State: Zustand
- 3D: `three`, `@react-three/fiber`, `@react-three/drei`
- Test unit/component: Vitest
- E2E/visual: Playwright
- Backend opsional: Supabase
- Hosting: Vercel

`package.json` menunjukkan dependensi modern dan cukup matang, termasuk `react-router-dom`, `framer-motion`, `dexie`, `zod`, dan `recharts`.

## PRIMERA dan Tooling Internal

PRIMERA adalah lapisan meta reliability untuk proyek ini. Fungsinya bukan gameplay langsung, tetapi menjaga kualitas teknis dan klinis.

Komponen PRIMERA yang tampak aktif:

- watchdog lint
- megalog
- clinical watchdog
- engine content audit
- save audit
- topology/store audit
- asset audit

Referensi:

- `PRIMERA_system_overview.md`
- `PRIMERA_megalog.md`
- `scripts/primera/`

Catatan:

- snapshot `PRIMERA_megalog.md` yang ada sekarang tampak lawas dibanding keadaan repo April 2026.
- output `megalog/outputs/vitest.json` menunjukkan snapshot hijau lama, bukan jaminan bahwa semua test terbaru baru saja dijalankan.

## Progress Git Terakhir yang Sudah Masuk

Riwayat commit terbaru yang berhasil dipulihkan dari git:

- `02880fa` - `2026-04-02` - `docs: restore village blueprint and bible updates`
- `8f872d9` - `2026-04-02` - `feat(wilayah): improve champion and intel map readability`
- `9360231` - `2026-04-02` - `feat(wilayah): label service coverage rings`
- `7dfcfbd` - `2026-04-02` - `feat(wilayah): add service rings and bridge repair cue`
- `b96ebc9` - `2026-04-02` - `feat(wilayah): scale home visit energy by travel`
- `e8e065e` - `2026-04-02` - `feat(wilayah): add facility and outbreak map cues`
- `75ecea7` - `2026-04-02` - `feat(wilayah): add bridge outage feedback to 2d map`
- `0be67b9` - `2026-04-01` - `feat(public-health): add bridge repair action`
- `f179e78` - `2026-04-01` - `feat(village): persist bridge outages across multiple days`
- `3ee0559` - `2026-04-01` - `feat(village): grant XP aura for upgraded posyandu`
- `9676d03` - `2026-04-01` - `feat(village): use active service anchors for distance severity`
- `b358dc3` - `2026-04-01` - `feat(public-health): boost outbreak response near level 2 FOB`
- `d54c68b` - `2026-04-01` - `feat(village): wire distance decay severity and intel state`
- `5a1bc0b` - `2026-04-01` - `feat(public-health): use active FOB anchors for outbreak travel`
- `4272c0a` - `2026-04-01` - `feat(clinical): make KBK performance affect spawn pressure`

Kesimpulan dari rangkaian commit ini:

- prioritas pengembangan terbaru bukan cloud/auth
- prioritas utama adalah simulasi desa, traversal, visual map cue, dan loop UKM yang memberi dampak nyata ke kasus dan resource

## WIP Lokal Saat Recovery Ini Dibuat

Saat recovery dilakukan, worktree dalam keadaan dirty.

Temuan utamanya:

- banyak file dokumen berubah tipis, kemungkinan besar karena line ending/penyelarasan minor
- `src/components/EmergencyPanel.jsx` memiliki perubahan lokal yang tampak hanya formatting
- `src/components/WilayahPage.jsx` memiliki perubahan lokal yang lebih penting:
  - `bridgeStatus` diteruskan ke komponen peta 2D
  - wiring panel Posyandu/Pustu/BuildingGamePanel dirapikan
  - tidak terlihat indikasi fitur besar baru yang separuh jadi, tetapi ini tetap WIP yang belum dikomit

Artefak lokal baru juga ada:

- beberapa `out_live_*.png`
- `out_live_*.txt`
- `out_live_wilayah_inspection.json`
- output lint/json lokal

Ini mengindikasikan ada sesi verifikasi manual/playtest yang cukup baru sebelum konteks terputus.

## Status Deploy yang Terlihat

Ada dua sinyal deploy/live check yang tersimpan:

- `out_live_deploy_sprint5.txt` menunjukkan deployment Vercel berstatus `READY`
- `out_live_home.txt` dan `out_live_wilayah_page.txt` menunjukkan halaman live bisa dibuka dan `Wilayah` menampilkan data `200 KK`

Artinya, setidaknya pada salah satu titik sebelum recovery:

- aplikasi berhasil dibangun/deploy
- halaman utama dan wilayah sempat berjalan

## Inkonstistensi Dokumen yang Perlu Diingat

Beberapa dokumen tidak lagi 100% sinkron dengan kode:

- `README.md` masih template default Vite
- `AGENT_CONTEXT.md` menyebut "No Tailwind", tetapi kode JSX jelas memakai utility classes dan repo memiliki `tailwind.config.js`
- sebagian snapshot PRIMERA/test output tampak lebih lama dari perubahan April 2026

Aturan praktis:

- untuk identitas dan visi: percaya `PRIMER_BIBLE.md` dan `docs/GAME_DESIGN_LOG.md`
- untuk runtime nyata: percaya kode di `src/` dan commit log
- untuk status terakhir: percaya gabungan `git log`, `git diff`, dan artefak `out_live_*`

## Area yang Sudah Matang

- shell aplikasi utama
- routing dasar dan save slot flow
- clinical EMR modular
- sistem pasien dan reasoning dasar
- outbreak system
- peta wilayah 2D/3D
- ekspansi desa 200 KK
- banyak selector dan domain logic khusus wilayah
- test suite dan audit framework sudah ada dalam jumlah besar

## Area yang Masih Terbuka

Berdasarkan roadmap dan dokumen aktif:

- tutorial/onboarding
- victory condition
- balancing difficulty/energy/XP
- mobile-friendliness EMR dan polish UX
- scoring akhir / achievement
- cloud launch penuh dan operasional mahasiswa real
- sinkronisasi dokumentasi agar tidak kontradiktif

## Rekomendasi Saat Lanjut Kerja Lagi

Kalau melanjutkan dari titik ini, urutan paling aman:

1. Cek `git diff` agar paham WIP lokal, terutama `WilayahPage.jsx`.
2. Jalankan verifikasi cepat untuk area wilayah dan layanan.
3. Putuskan apakah WIP lokal mau dikomit sebagai cleanup kecil atau dilanjutkan jadi fitur.
4. Sinkronkan dokumentasi inti yang stale, minimal `README.md`.
5. Pilih salah satu trek berikut sebagai fokus:
   - polish `Wilayah`
   - EMR mobile UX
   - living village feedback loop lebih dalam
   - cloud/deployment readiness

## Bottom Line

PRIMER saat ini adalah game simulasi pendidikan layanan primer yang sudah jauh lebih dari prototipe. Arsitektur utamanya sudah hidup, desa 200 KK sudah aktif, loop klinis dan UKM sudah saling terhubung, dan fase kerja terakhir sangat jelas berpusat pada `Wilayah` sebagai jantung strategic gameplay.

Jika sesi kerja terputus lagi, file ini bisa dipakai sebagai titik masuk tercepat untuk memahami konteks tanpa harus membaca ulang seluruh repo dari nol.
