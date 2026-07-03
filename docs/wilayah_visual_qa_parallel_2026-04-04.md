# Wilayah Visual QA Parallel Brief

Tanggal: 4 April 2026
Status: Active
Scope: Sprint 2 `Wilayah` 2D canonical readability pass

## Tujuan

Mengunci keterbacaan `Wilayah` 2D sebagai source of truth gameplay, khususnya:
- layer `general`, `pispk`, `surveillance`, `psn`, `phbs`, `perilaku`
- blank spot RW / `Belum Terdata`
- anchor layanan dan service coverage
- cue `bridge`, `intel`, `champion`
- spacing dan opacity HUD bawah

## Source Of Truth

- Runtime utama: `D:/Dev/PRIMER/src/components/WilayahPage.jsx`
- Peta 2D: `D:/Dev/PRIMER/src/components/wilayah/2d/Map2DBlueprint.jsx`
- Marker: `D:/Dev/PRIMER/src/components/wilayah/2d/Map2DMarker.jsx`
- Terrain: `D:/Dev/PRIMER/src/components/wilayah/2d/Map2DTerrain.jsx`
- Blueprint audited: `D:/Dev/PRIMER/docs/blueprint_peta_desa.md`

## Pembagian Tugas

### Codex

Owner: integrasi kode dan acceptance final

Fokus:
- patch `WilayahPage` untuk layer microcopy, tooltip, HUD spacing
- patch `Map2DBlueprint` dan `Map2DTerrain` untuk opacity/readability
- review hasil QA Gemini dan copy pass Claude
- kunci final diff yang masuk repo

Output:
- patch kode yang siap commit
- ringkasan residual risk yang masih perlu live check

### Gemini

Owner: screenshot readability audit

Input yang dibutuhkan:
- screenshot `Wilayah` pada zoom `100%` untuk tiap layer
- minimal 2 screenshot tambahan:
  - `general` dengan blank spot RW terlihat
  - `surveillance` dengan outbreak/intel/champion aktif

Checklist audit:
- apakah layer aktif langsung terbaca dalam 2 detik
- apakah blank spot RW terbaca tanpa perlu hover
- apakah ring layanan terlalu dominan atau terlalu redup
- apakah HUD bawah menutupi peta penting
- apakah status `bridge`, `intel`, `champion`, `service coverage` saling rebut fokus

Format balikan:
- `P1` issue: masalah keterbacaan besar
- `P2` issue: clutter, spacing, atau hierarchy
- `OK`: elemen yang sudah final dan tidak perlu diutak-atik lagi

### Claude

Owner: microcopy dan tooltip pass

Fokus:
- rapikan label layer agar singkat tapi tetap akademik
- rapikan tooltip layer agar konsisten dengan blueprint
- rapikan subtitle/legend copy agar tidak bertele-tele
- jaga istilah tetap selaras dengan konteks Puskesmas Indonesia

Format balikan:
- usulan teks final per layer:
  - label tombol
  - tooltip
  - subtitle legend
  - badge singkat

## Paket Screenshot Yang Diminta

1. `general` overview
2. `pispk` overview
3. `surveillance` overview
4. `psn` overview
5. `phbs` overview
6. `perilaku` overview
7. `general` zoom menengah dengan label anchor layanan muncul
8. `surveillance` atau `psn` dengan kasus/jentik aktif

## Acceptance Untuk Putaran Ini

- `general` tetap terasa paling bersih dan paling canonical
- layer non-general langsung punya identitas visual yang berbeda, tapi tidak menenggelamkan terrain
- HUD bawah tetap terbaca di layar laptop tanpa memakan terlalu banyak tinggi viewport
- tooltip dan microcopy layer konsisten dengan blueprint desa

## Catatan

- Putaran ini fokus readability dan hierarchy, bukan menambah sistem baru.
- 3D parity tetap di luar scope sampai 2D readability dianggap locked.
