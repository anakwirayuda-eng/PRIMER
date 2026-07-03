# Mobile UX + Multilingual Feasibility

Tanggal: 8 April 2026  
Scope: `PRIMER` cross-platform planning setelah `Wilayah` 2D makin terkunci.

## Ringkasan

Keduanya **feasible**, tetapi statusnya berbeda:

- **Mobile / cross-platform**: feasible sebagai fase produk berikutnya, namun UI utama repo masih dominan desktop-first.
- **Multilingual**: feasible dan bahkan sudah punya fondasi aktif, tetapi coverage translasi masih sangat parsial.

## Mobile / Cross-Platform

### Fondasi yang sudah ada

- `Wilayah` 2D sudah punya beberapa fondasi touch:
  - hit area marker fasilitas minimum `44px`
  - hit area rumah minimum `24px`
  - pan + pinch zoom di [`Map2DBlueprint.jsx`](../src/components/wilayah/2d/Map2DBlueprint.jsx)
- App stack web (`React + Vite`) cocok untuk strategi web-first, lalu dibungkus lintas device belakangan bila perlu.

### Bloker utama saat ini

- HUD, panel, dan overlay masih padat untuk tinggi viewport mobile.
- `MainLayout` dan halaman klinis/EMR masih kuat desktop-first.
- Banyak modal masih memakai lebar/padding besar dan asumsi landscape.
- Belum ada mobile navigation contract yang benar-benar dikunci:
  - bottom nav
  - collapsible right panel
  - full-screen sheet
  - thumb zone

### Rekomendasi fase

1. **Phase M1: Shell Responsive**
   - rapikan `MainLayout`
   - jadikan sidebar desktop -> drawer mobile
   - definisikan `bottom action rail`
2. **Phase M2: Wilayah Mobile Contract**
   - kompres HUD
   - pindahkan legend ke sheet/toggle
   - audit touch target dan safe area
3. **Phase M3: EMR Mobile**
   - ubah panel tab menjadi stepper / stacked cards
   - prioritaskan anamnesis, pemeriksaan, terapi, discharge
4. **Phase M4: Device QA**
   - `1366x768`, `1024x768`, `768x1024`, `390x844`
   - audit landscape + portrait

### Kesimpulan mobile

**Feasible, tapi butuh fase UX khusus.**  
Jangan menunggu seluruh produk selesai; begitu `Sprint 2 Wilayah` locked, mobile shell sebaiknya mulai dirancang sebagai stream paralel.

## Multilingual

### Fondasi yang sudah ada

- `i18next` sudah aktif di [`src/i18n.js`](../src/i18n.js)
- locale dasar sudah ada:
  - [`src/locales/id.json`](../src/locales/id.json)
  - [`src/locales/en.json`](../src/locales/en.json)
- entry point sudah memuat i18n di [`src/main.jsx`](../src/main.jsx)
- beberapa komponen sudah mengimpor `useTranslation`

### Gap utama

- belum ada language switcher aktif di settings/runtime
- mayoritas string UI masih hardcoded di JSX
- string `Wilayah`, `layerMeta`, `buildingScenes`, narasi, tooltip, dan modal sebagian besar belum di-key-kan
- belum ada namespace translasi per domain:
  - `app`
  - `dashboard`
  - `clinical`
  - `wilayah`
  - `scenarios`
- belum ada strategi fallback untuk narasi yang sangat panjang

### Catatan penting tentang “bahasa Belgia”

Secara produk, **“bahasa Belgia” bukan satu bahasa standar**.  
Untuk target Belgium, pilih salah satu yang eksplisit:

- `nl-BE` / Dutch (Flemish context)
- `fr-BE` / French
- `de-BE` / German

Untuk rollout awal, urutan paling realistis:

1. `id`
2. `en`
3. salah satu dari `nl-BE` **atau** `fr-BE`

Jangan buka tiga bahasa Belgium sekaligus di fase pertama.

### Rekomendasi fase

1. **Phase L1: Infrastructure Cleanup**
   - tambahkan setting selector bahasa
   - persist pilihan bahasa di local storage / profile
   - pecah locale per namespace
2. **Phase L2: Core UI Coverage**
   - `MainLayout`
   - dashboard
   - clinical shell
   - `Wilayah` HUD + layer copy
3. **Phase L3: Scenario Content**
   - tooltip
   - modal
   - building scenes
   - skenario IKM / BC
4. **Phase L4: QA Linguistik**
   - panjang teks
   - overflow button
   - line wrap HUD
   - kultur/istilah medis

### Kesimpulan multilingual

**Feasible dan fondasinya sudah ada**, tetapi saat ini baru tahap embrio.  
Kalau mau cepat memberi nilai tambah, target realistis pertama adalah:

- selector `Bahasa / Language`
- coverage UI inti `id + en`

Konten naratif panjang menyusul sesudah shell UI stabil.
