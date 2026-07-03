# Parallel Audit Notes

Tanggal: 2026-04-16
Status: initial findings dari audit paralel internal + visual spot-check lokal

## P1

- `MainLayout mobile shell parity gap`
  - Pada mobile, beberapa surface global tidak punya jalur akses yang setara dengan desktop.
  - Dampak: user touch-only kehilangan akses ke `TimeController`, KPI review, Calendar, dan shortcut help.
  - Referensi: [MainLayout.jsx](</D:/Dev/PRIMER/src/components/MainLayout.jsx:853>), [MainLayout.jsx](</D:/Dev/PRIMER/src/components/MainLayout.jsx:905>), [MainLayout.jsx](</D:/Dev/PRIMER/src/components/MainLayout.jsx:917>), [MainLayout.jsx](</D:/Dev/PRIMER/src/components/MainLayout.jsx:926>), [MainLayout.jsx](</D:/Dev/PRIMER/src/components/MainLayout.jsx:1064>)

## P2

- `Queue row density still degrades under long names`
  - Row pasien masih membiarkan nama panjang wrap bebas, sementara metadata dan timer tetap dipertahankan di row yang sama.
  - Di tablet, ini membuat tinggi item jadi tidak stabil dan scan speed turun.
  - Referensi: [QueueList.jsx](</D:/Dev/PRIMER/src/components/QueueList.jsx:149>), [QueueList.jsx](</D:/Dev/PRIMER/src/components/QueueList.jsx:181>), [QueueList.jsx](</D:/Dev/PRIMER/src/components/QueueList.jsx:221>)

- `Patient EMR tetap desktop-biased di tablet`
  - Pada `1024x768`, EMR masih memuat header kaya badge, strip 9 tab, worksheet utama, dan rail AI di kanan.
  - Layout ini masih usable, tapi terasa padat dan cepat kehilangan napas visual.
  - Referensi: [PatientEMR.jsx](</D:/Dev/PRIMER/src/components/PatientEMR.jsx:140>), [PatientEMR.jsx](</D:/Dev/PRIMER/src/components/PatientEMR.jsx:244>), [PatientEMR.jsx](</D:/Dev/PRIMER/src/components/PatientEMR.jsx:280>), [PatientEMR.jsx](</D:/Dev/PRIMER/src/components/PatientEMR.jsx:361>)

- `Clinical mobile still has competing action zones`
  - Mobile shell sudah jauh lebih sederhana, tetapi masih ada kompetisi antara kartu queue preview, tombol KPI besar, service strip bawah, dan global bottom nav.
  - Ini belum fatal, tapi fokus “aksi utama” belum sebersih yang seharusnya.
  - Referensi: [ClinicalPage.jsx](</D:/Dev/PRIMER/src/components/ClinicalPage.jsx:603>), [ClinicalPage.jsx](</D:/Dev/PRIMER/src/components/ClinicalPage.jsx:713>)

- `Dashboard hub still trends toward over-panelization`
  - Hub launchpad menumpuk status bar, ticker, dan card-card yang masing-masing punya micro-metrics.
  - Di laptop/tablet, beban scan tetap terasa tinggi walau secara visual lebih seimbang dari sebelumnya.
  - Referensi: [DashboardPage.jsx](</D:/Dev/PRIMER/src/components/DashboardPage.jsx:237>)

- `KPI dashboard remains modal-heavy and scroll-heavy`
  - Struktur tab dan isi modal masih cenderung desktop-first.
  - Risiko utamanya ada di tablet dan future mobile surfacing.
  - Referensi: [KPIDashboard.jsx](</D:/Dev/PRIMER/src/components/KPIDashboard.jsx:240>), [KPIDashboard.jsx](</D:/Dev/PRIMER/src/components/KPIDashboard.jsx:261>)

- `Wilayah compact breakpoint likely arrives too late`
  - Breakpoint compact di bawah `1024px` membuat `1024x768` masih berpotensi menerima komposisi yang terlalu penuh.
  - Referensi: [WilayahPage.jsx](</D:/Dev/PRIMER/src/components/WilayahPage.jsx:192>), [WilayahPage.jsx](</D:/Dev/PRIMER/src/components/WilayahPage.jsx:697>)

- `Sensus and Arsip remain document-first on smaller screens`
  - Modal KK dan daily archive flow masih berat untuk mobile/tablet karena tabel dan toolbar belum benar-benar compact-first.
  - Referensi: [SensusPage.jsx](</D:/Dev/PRIMER/src/components/sensus/SensusPage.jsx:188>), [ArsipPage.jsx](</D:/Dev/PRIMER/src/components/ArsipPage.jsx:161>)

## P3

- `Dashboard subviews still compress rather than truly restack`
  - Beberapa subview dashboard masih mengandalkan blocks dan gauges yang lebih cocok desktop.

- `Above-the-fold Sensus can bury the real work area`
  - Hero dan summary blocks mendorong daftar kerja terlalu jauh ke bawah pada layar kecil.

## Artifact

- [desktop clinical shell](</D:/Dev/PRIMER/.codex_tmp/parallel-audit-2026-04-16/desktop-clinical-shell-dev.png>)
- [desktop EMR](</D:/Dev/PRIMER/.codex_tmp/parallel-audit-2026-04-16/desktop-emr-dev.png>)
- [tablet clinical shell](</D:/Dev/PRIMER/.codex_tmp/parallel-audit-2026-04-16/tablet-clinical-shell-dev.png>)
- [tablet EMR](</D:/Dev/PRIMER/.codex_tmp/parallel-audit-2026-04-16/tablet-emr-dev.png>)
- [mobile clinical shell](</D:/Dev/PRIMER/.codex_tmp/parallel-audit-2026-04-16/mobile-clinical-shell-dev.png>)

