# Wilayah Execution Plan - 2026-04

## Tujuan

Dokumen ini menetapkan fase dan sprint kerja berikutnya untuk gameplay peta `Wilayah`, berdasarkan:

- blueprint aspirational di `docs/blueprint_peta_desa.md`
- audit runtime aktual di `docs/blueprint_runtime_gap_audit_2026-04-04.md`
- kondisi codebase `Wilayah` per 4 April 2026

Dokumen ini sengaja memindahkan fokus dari "semua ide bagus" menjadi "apa yang harus dikerjakan berikutnya agar Wilayah benar-benar selesai".

## Prinsip Eksekusi

1. `2D blueprint` adalah source of truth gameplay spasial.
2. `3D diorama` diposisikan sebagai layer `reward / empathy / exhibition` kecuali ada keputusan eksplisit yang mengubahnya.
3. `3D` tidak mengejar parity UI operasional 2D sebagai target default.
4. Fitur yang sudah final di runtime tidak dirombak tanpa alasan kuat.
5. Fitur yang masih provisional tidak boleh lagi ditulis atau diperlakukan seolah sudah selesai.
6. Semua sprint harus punya `exit criteria` yang bisa diverifikasi.
7. Phase 5-6 dari blueprint lama dianggap `future`, bukan target sprint dekat.

## Kondisi Awal Saat Ini

Sudah kuat:

- topologi desa `160x120`
- `200 KK`
- unlock RW progresif
- overlay 2D aktif
- bridge/travel/vehicle
- champion/intel/service rings/outbreak zone
- building progress dan sebagian feedback loop desa

Masih lemah atau parsial:

- semantic zoom 3 tahap
- event anchor marker di map
- death consequence loop
- visual blank-spot RW terkunci
- interior bangunan hazard/wisata
- tourist workflow
- framing akhir 3D sebagai inspector/exhibition layer
- cleanup legacy path dan metadata file yang stale

## Fase Baru

### Phase A - Lock Source Of Truth

Fokus:

- menyamakan blueprint dengan runtime
- mengunci kontrak 2D sebagai acuan final
- membersihkan ambiguitas arsitektur

Target selesai:

- tidak ada lagi kebingungan antara blueprint aspirational dan implementasi nyata
- jalur kerja sprint berikutnya stabil

### Phase B - Core Wilayah MVP Completion

Fokus:

- menyelesaikan gap gameplay peta yang paling terasa pemain
- menjadikan 2D map lengkap sebagai gameplay layer yang ship-ready

Target selesai:

- loop `lihat peta -> pilih target -> intervensi -> desa berubah` terasa utuh

### Phase C - Narrative Node Activation

Fokus:

- menghidupkan bangunan hazard/wisata yang sekarang baru sebatas topologi
- menambahkan node konten yang membuat desa terasa "punya konflik"

Target selesai:

- pesantren, dukun, pos ronda, dan wisata bukan lagi dekorasi

### Phase D - 3D Inspector + Showcase Hardening

Fokus:

- mengunci 3D sebagai inspector/reward layer yang jujur secara topografi
- visual polish
- regression guard
- demo/showcase readiness
- safety rail WebGL untuk desktop dan mobile yang tidak kompatibel

Target selesai:

- Wilayah layak dipakai sebagai modul unggulan PRIMER

## Sprint Plan

Asumsi durasi:

- `1 sprint = 5 hari kerja efektif`
- jika ada kolaborasi multi-model, sprint tetap ditutup oleh integrasi final dari Codex

---

## Sprint 1 - Blueprint Lock + Cleanup

### Objective

Mengunci source of truth `Wilayah` agar sprint berikutnya tidak berjalan di atas spesifikasi yang saling bertabrakan.

### Scope

- sinkronkan `docs/blueprint_peta_desa.md` dengan audit runtime
- tetapkan bagian `final`, `provisional`, `future`
- tulis kontrak resmi:
  - topologi
  - overlay
  - unlock RW
  - 2D vs 3D
- identifikasi dan tandai jalur legacy:
  - `MapCanvas`
  - `TerrainCanvas`
  - `PremiumMapDemo`
- perbarui metadata file utama yang stale

### Deliverables

- blueprint utama sudah diturunkan dari status overclaim
- daftar legacy path dan keputusan `keep/deprecate`
- kontrak 2D gameplay tertulis eksplisit

### Exit Criteria

- tidak ada klaim besar di blueprint yang bertentangan dengan runtime aktif
- tim bisa menjawab "source of truth Wilayah ada di mana?" dengan satu jawaban

---

## Sprint 2 - 2D Gameplay Completion

### Objective

Menutup gap gameplay 2D yang paling terasa di depan pemain.

### Scope

- implementasi visual `blank spot` RW terkunci:
  - area abu-abu
  - label `Belum Terdata`
- event anchor marker di peta untuk IKM/event komunitas
- revisi semantic zoom:
  - minimal practical 3-tier atau
  - keputusan resmi untuk 2-tier yang dipoles
- upgrade cue visual fasilitas agar progression lebih terasa
- satukan legend/HUD/tooltip agar overlay lebih mudah dibaca

### Deliverables

- peta 2D lebih informatif tanpa harus buka panel kanan terus
- state RW terkunci dan event aktif terlihat langsung dari map

### Exit Criteria

- pemain bisa membedakan:
  - RW terkunci
  - rumah risiko tinggi
  - event aktif
  - cakupan layanan
  hanya dari peta 2D

---

## Sprint 3 - Systemic Feedback Loop

### Objective

Membuat aksi pemain di Wilayah memberi konsekuensi yang lebih jelas dan dapat dirasakan.

### Scope

- lengkapi death consequence loop:
  - marker rumah berduka
  - radius distrust
  - recovery interaction
- tampilkan dampak bridge/travel/champion/intel lebih eksplisit di UI
- perkuat `villageLedger` menjadi feedback loop yang lebih terlihat
- poles building progression:
  - posyandu
  - pustu
  - polindes
  - MCK/PAMSIMAS visual state minimal
- hubungkan metrics desa dengan perubahan yang mudah dipahami pemain

### Deliverables

- konsekuensi UKM -> UKP dan UKP -> desa lebih terasa
- progression fasilitas tidak lagi sekadar badge tersembunyi

### Exit Criteria

- satu intervensi rumah atau gedung menghasilkan perubahan yang bisa dibaca di map atau metric desa pada hari yang sama atau hari berikutnya

---

## Sprint 4 - Hazard Hub Activation

### Objective

Mengubah node hazard utama dari "ada di peta" menjadi "punya gameplay nyata".

### Scope

- aktifkan interior + scene untuk:
  - `pesantren`
  - `padepokan_dukun`
  - `pos_ronda`
- tambah skenario IKM prioritas:
  - `Sowan Kyai`
  - `Kemitraan Bidan-Dukun`
- jika bandwidth cukup:
  - `pasar_hewan` sebagai one-health node tahap 1

### Deliverables

- bangunan hazard utama bisa dimasuki
- konflik budaya dan sosial sudah punya node gameplay aktif

### Exit Criteria

- minimal 3 bangunan hazard baru sudah playable end-to-end:
  map -> masuk bangunan -> ambil aksi -> outcome -> efek ke desa atau event

---

## Sprint 5 - Outsider / Tourism Layer

### Objective

Menjadikan elemen `desa wisata` lebih dari sekadar topologi cantik.

### Scope

- tourist/outsider flow minimum viable:
  - `Pendatang` dibedakan jelas dari warga
  - EMR punya mode visitor yang lebih tepat
- implementasi `Travel History` tab atau panel khusus visitor
- aktifkan node wisata tahap 1:
  - `info_wisata`
  - `homestay`
  - `dermaga`
  - `gardu_pandang`
- minimal 1-2 loop kasus wisata yang benar-benar terasa di gameplay

### Deliverables

- desa wisata mulai memengaruhi case mix dan pengalaman klinis

### Exit Criteria

- pasien `Pendatang` tidak lagi terasa seperti warga biasa yang hanya beda label

---

## Sprint 6 - 3D Inspector + Showcase Gate

### Objective

Mengunci posisi final 3D sebagai inspector/reward/exhibition layer tanpa menariknya kembali ke jebakan parity penuh.

### Scope

- tegaskan kontrak 3D:
  - bukan layar komando
  - bukan sumber keputusan operasional
  - tidak memikul UI wabah, jentik, atau PIS-PK
- capai `truthful minimum` 3D:
  - topografi desa tetap akurat
  - tipe rumah/bangunan tetap representatif
  - target yang sedang dipilih tetap jelas
  - area `Belum Terdata` tidak menyesatkan pemain
- siapkan bentuk inspector yang paling realistis:
  - sidebar scene
  - modal turntable
  - atau exhibition mode
- optimasi visual dan interaksi kamera
- regression pass untuk `Wilayah`
- rapikan demo flow untuk showcase
- audit performa dan error recovery WebGL

### Deliverables

- 3D punya framing produk yang jelas:
  - `inspector`
  - `reward/empathy`
  - `showcase`
- tidak ada lagi ekspektasi parity operasional penuh terhadap 2D

### Exit Criteria

- keputusan final 3D terdokumentasi
- tidak ada ambiguity apakah 3D gameplay-critical atau tidak
- tidak ada task baru yang diam-diam menambah parity debt 3D tanpa justifikasi eksplisit

## Backlog Yang Ditahan Setelah Sprint 6

Belum masuk sprint dekat:

- wastewater surveillance
- hoax event system
- syndemics
- 2 AM shift
- climate mega-event
- AMR
- corporate determinants
- planetary health cascade

Semua ini tetap valid sebagai ide, tapi tidak boleh mengganggu penyelesaian `Wilayah core`.

## Urutan Prioritas Nyata

Jika hanya boleh mengerjakan satu hal per fase, urutannya adalah:

1. lock blueprint dan 2D source of truth
2. selesaikan readability + loop inti 2D
3. hidupkan death consequence dan feedback loop desa
4. aktifkan hazard hub utama
5. baru tambahkan outsider/tourism layer
6. terakhir kunci 3D sebagai inspector/showcase layer yang tepat

## Orkestrasi Codex + Claude + Gemini

Catatan penting:

- Codex tetap menjadi integrator utama dan pemilik source of truth repo.
- Claude dan Gemini dipakai sebagai sidecar worker yang hasilnya harus masuk kembali ke workspace atau patch yang bisa diaudit.
- Tidak boleh ada overlapping write-set tanpa keputusan integrasi dari Codex.

### Peran Codex

Ownership:

- arsitektur runtime
- refactor dan integrasi kode
- store/domain wiring
- implementasi core map gameplay
- regression guard
- final acceptance

File ownership utama:

- `src/components/WilayahPage.jsx`
- `src/components/wilayah/2d/*`
- `src/components/wilayah/3d/*`
- `src/store/slices/createPublicHealthSlice.js`
- `src/domains/village/*`
- `src/tests/*` yang relevan ke Wilayah

### Peran Claude

Ownership:

- penulisan atau rewrite dokumen besar
- content design
- skenario naratif
- dialog, prompt, dan framing budaya

Write-set yang aman:

- `docs/blueprint_peta_desa.md`
- dokumen phase/sprint
- draft dialog atau content matrix untuk:
  - pesantren
  - dukun
  - wisata
- bagian naratif pada `buildingScenes.js` atau spec turunannya, jika dibatasi jelas

Output yang diharapkan dari Claude:

- rewrite blueprint yang sudah sinkron
- content packet per bangunan hazard
- acceptance criteria naratif per sprint

### Peran Gemini

Ownership:

- visual QA
- UI review
- readability audit
- edge-case checklist
- screenshot comparison notes

Write-set yang aman:

- dokumen review visual
- checklist UX
- daftar bug/readability issue per layar
- rekomendasi layout/legend/HUD/touch target

Output yang diharapkan dari Gemini:

- visual defect list untuk 2D/3D map
- prioritas polish yang paling berdampak
- screenshot notes untuk parity 2D vs 3D

## Protokol Kerja Paralel

### Mode kerja

1. Codex membuat sprint brief.
2. Claude mengambil dokumen/content task yang tidak memblokir integrasi kode.
3. Gemini mengambil visual audit task yang tidak menulis file runtime inti.
4. Codex mengerjakan jalur integrasi dan implementasi utama.
5. Semua hasil kembali ke Codex untuk disatukan.

### Aturan anti-tabrakan

- Claude jangan edit file runtime inti yang sedang dipakai Codex.
- Gemini jangan edit source code tanpa write-scope eksplisit.
- Jika ada task yang menyentuh file yang sama, hanya Codex yang merge final.

### Format handoff yang disarankan

- `docs/handoffs/claude_<sprint>.md`
- `docs/handoffs/gemini_<sprint>.md`
- `docs/handoffs/codex_<sprint>.md`

Isi handoff minimal:

- tujuan
- file yang disentuh
- keputusan yang diusulkan
- blocker atau asumsi

## Sprint Ownership Matrix

### Sprint 1

- Codex: cleanup blueprint-runtime contract, mark legacy path
- Claude: rewrite blueprint status sections
- Gemini: audit readability map 2D current state

### Sprint 2

- Codex: blank spot overlay, event marker, semantic zoom decision
- Claude: microcopy legend, tooltip, label RW
- Gemini: HUD/overlay visual QA

### Sprint 3

- Codex: death consequence, feedback loop, villageLedger surfacing
- Claude: wording consequence/recovery events
- Gemini: visual severity cue audit

### Sprint 4

- Codex: hazard hub activation + scene wiring
- Claude: dialog and scenario writing
- Gemini: scene readability and interaction QA

### Sprint 5

- Codex: outsider/tourist runtime and EMR logic
- Claude: visitor narrative/content pack
- Gemini: EMR clarity review for resident vs visitor mode

### Sprint 6

- Codex: 3D inspector/showcase hardening + regression
- Claude: showcase script and narrative framing
- Gemini: final visual QC and demo checklist

## Definition Of Done Untuk Wilayah

`Wilayah` baru boleh dianggap selesai bila:

1. 2D map menjadi source of truth yang lengkap dan mudah dibaca.
2. Fitur core tidak lagi bergantung pada interpretasi blueprint yang ambigu.
3. Hazard hub utama benar-benar playable.
4. Feedback loop aksi pemain terhadap desa terbaca jelas.
5. 3D sudah diputuskan posisinya secara eksplisit.
6. Dokumen utama, runtime, dan test tidak saling bertentangan secara konsep.

## Rekomendasi Mulai Sekarang

Sprint yang harus dimulai sekarang adalah:

- `Sprint 1 - Blueprint Lock + Cleanup`

Alasan:

- ini adalah precondition untuk semua sprint lain
- paling murah secara risiko
- langsung mengurangi kebingungan desain dan technical debt
- membuat bantuan Claude/Gemini nanti lebih tertib karena semua orang mengacu ke kontrak yang sama
