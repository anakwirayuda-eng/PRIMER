# Wilayah Blueprint Status 2026-04-12
*Audit file-by-file setelah blank spot dossier + mobile inspector shell pass*

---

## Verdict Singkat

- **Canonical gameplay 2D sudah terkunci.**
- **3D sudah berada di jalur demote yang benar**: showcase + inspector support, bukan source of truth operasional.
- **Gap terbesar yang tersisa** sekarang bukan topologi, tetapi **mobile polish, aktivasi subset bangunan naratif, dan coverage i18n**.

---

## Final

| File | Status | Catatan |
|------|--------|---------|
| `src/components/wilayah/2d/Map2DTerrain.jsx` | **FINAL** | Terrain Hybrid A+C sudah jadi base visual canonical 2D. |
| `src/components/wilayah/2d/Map2DMarker.jsx` | **FINAL** | Marker acrylic/LED sudah jadi source visual utama; blur trap lama sudah dibersihkan. |
| `src/components/wilayah/2d/Map2DBlueprint.jsx` | **FINAL** | Semantic zoom, overlay layer inti, event anchor, blank spot RW click, dan service coverage sudah hidup di runtime. |
| `src/components/wilayah/layerMeta.js` | **FINAL** | Menjadi source of truth overlay copy, warna, dan cue layer operasional. |
| `src/components/sensus/SensusPage.jsx` | **FINAL (operasional)** | Sudah menerima `focusRw` dari Wilayah dan bisa dipakai audit blank spot per-RW. |
| `src/domains/village/VillageRegistry.js` | **FINAL** | Threshold unlock RW tetap canonical dan sinkron dengan runtime. |

## Final Dengan Catatan

| File | Status | Catatan |
|------|--------|---------|
| `src/components/WilayahPage.jsx` | **FINAL untuk flow desktop + mobile v1** | 2D canonical, 3D showcase modal, RW dossier, locked-building dossier, dan mobile bottom-sheet shell sudah jalan. Masih perlu polish swipe/peek native dan coverage i18n. |
| `src/components/MainLayout.jsx` | **FINAL untuk shell umum, belum final untuk mobile orchestration lintas halaman** | Bahasa selector sudah terhubung lewat settings, tapi ergonomi lintas Wilayah/Clinical di mobile belum diaudit menyeluruh. |
| `src/components/SettingsModal.jsx` | **FINAL untuk selector bahasa** | Fondasi multilingual `id + en` sudah ada, tetapi coverage string game belum merata. |

## Provisional

| File | Status | Kenapa masih provisional |
|------|--------|--------------------------|
| `src/components/wilayah/3d/WilayahDiorama.jsx` | **PROVISIONAL** | Masih full-village showcase. Belum dipecah menjadi pocket diorama per RW/sektor sesuai keputusan produk. |
| `src/components/wilayah/3d/PocketDioramaCanvas.jsx` | **PROVISIONAL** | Sudah berguna sebagai inspector desktop, tetapi belum jadi pipeline final untuk pocket RW-only + mobile fallback snapshot. |
| `src/components/wilayah/buildingScenes.js` | **PROVISIONAL** | Baru subset bangunan naratif yang aktif. Banyak node topologi sudah ada tetapi gameplay-nya belum hidup. |
| `src/components/ClinicalPage.jsx` | **PROVISIONAL** | Shell multilingual dan mobile harmony dengan Wilayah belum disatukan penuh. |
| `src/i18n.js` dan file locale terkait | **PROVISIONAL** | Infrastruktur ada, tetapi copy Wilayah, dossier, clinical shell, dan building scenes belum tercakup penuh. |
| `docs/blueprint_peta_desa.md` | **FINAL sebagai arah desain, PROVISIONAL sebagai status implementasi** | Blueprint stabil, tetapi beberapa item runtime di dalamnya masih berupa intent yang belum selesai di kode. |

## Stale / Tidak Lagi Source of Truth

| File / Area | Status | Catatan |
|-------------|--------|---------|
| Toggle harian 2D vs 3D di Wilayah | **STALE** | Sudah digeser menjadi entry showcase terpisah. |
| Ekspektasi parity penuh 3D-operasional | **STALE** | Tidak lagi sesuai keputusan arsitektur. |
| Locked RW sebagai marker pasif tanpa dossier | **STALE** | Sudah digantikan alur klik blank spot → dossier → Sensus. |

---

## Backlog Sprint Berikutnya

### Sprint W-Next-A: Mobile Polish

1. Jadikan bottom sheet Wilayah punya mode `peek / expand / close`, bukan hanya sheet statis.
2. Tambahkan auto-focus dan spacing pass untuk layar portrait kecil.
3. Audit overlap antara top HUD, bottom HUD, dan inspector pada breakpoint 360px–768px.

### Sprint W-Next-B: Aktivasi Bangunan Naratif

1. Aktifkan subset bangunan yang paling dekat dengan runtime di `buildingScenes.js`.
2. Prioritaskan node yang sudah punya fungsi planologis kuat:
   - `bank_sampah`
   - `pamsimas`
   - `pos_gizi`
   - `rtk`
   - `padepokan_dukun`
3. Pastikan tiap aktivasi memberi payoff yang terbaca di layer 2D, bukan berdiri sendiri.

### Sprint W-Next-C: Multilingual Coverage

1. Pindahkan microcopy baru di `WilayahPage.jsx` ke translation keys.
2. Lanjutkan coverage `id + en` untuk shell Wilayah dan shell Clinical.
3. Audit istilah domain agar konsisten:
   - `blank spot`
   - `Belum Terdata`
   - `showcase`
   - `inspector`
   - `service coverage`

### Sprint W-Next-D: Pocket Diorama Decision Execution

1. Tetapkan pemecahan 3D per RW atau per sektor sebagai struktur final.
2. Tentukan pipeline data minimal untuk pocket diorama.
3. Pisahkan tegas:
   - `3D showcase desa penuh`
   - `3D pocket inspector`

---

## Rekomendasi Kerja Sekarang

Kalau hanya boleh memilih **1 jalur paling bernilai** setelah pass ini, ambil:

> **Sprint W-Next-B: Aktivasi bangunan naratif berikutnya di `buildingScenes.js`, sambil menjaga semua payoff tetap terbaca di peta 2D.**

Alasannya:

- flow wilayah inti sudah cukup stabil untuk dipakai sebagai kanvas gameplay
- mobile shell sekarang sudah punya fondasi yang layak
- nilai produk berikutnya paling terasa jika node topologi yang sudah ada mulai benar-benar “hidup”
