# Blueprint Runtime Gap Audit - 2026-04-04

## Scope

Audit ini membandingkan `docs/blueprint_peta_desa.md` melawan runtime `Wilayah` yang benar-benar aktif pada 4 April 2026.

Tujuan audit:

1. Menentukan bagian mana yang sudah final di kode aktif.
2. Menentukan bagian mana yang masih provisional atau baru parsial.
3. Menandai bagian blueprint yang sudah stale dan perlu diturunkan statusnya.

Sumber bukti utama:

- `docs/blueprint_peta_desa.md`
- `src/components/WilayahPage.jsx`
- `src/components/wilayah/2d/Map2DBlueprint.jsx`
- `src/components/wilayah/2d/Map2DTerrain.jsx`
- `src/components/wilayah/2d/Map2DMarker.jsx`
- `src/components/wilayah/map-utils.js`
- `src/components/wilayah/buildingScenes.js`
- `src/components/wilayah/3d/WilayahDiorama.jsx`
- `src/domains/village/VillageRegistry.js`
- `src/domains/village/homeVisitTravel.js`
- `src/domains/village/bridgeSeasonalState.js`
- `src/store/slices/createPublicHealthSlice.js`
- `src/store/slices/createClinicalSlice.js`
- `src/game/PatientGenerator.js`
- `src/components/PatientEMR.jsx`

## Executive Verdict

`docs/blueprint_peta_desa.md` tidak bisa lagi dianggap "FINAL v2.3 - Geospatial SDoH Engine Complete" secara harfiah.

Status yang lebih akurat per 4 April 2026:

- `final` untuk kontrak inti topologi peta, data keluarga, navigasi 2D, overlay aktif, dan sistem mobilitas desa.
- `provisional` untuk lapisan gameplay lanjutan yang tertulis sangat detail di blueprint tetapi belum hidup utuh di runtime.
- `stale` untuk beberapa bagian blueprint yang masih menulis masalah lama seolah belum selesai, atau mendeskripsikan implementasi yang sudah berubah bentuk di kode.

Kesimpulan pendek:

- Blueprint inti desa sudah cukup matang untuk "dikunci" sebagai source of truth topologi.
- Blueprint belum boleh dianggap selesai untuk semantic zoom 3 level, event anchors penuh, death consequence, tourist workflow, dan hazard hub interiors.

## Final In Runtime

Bagian-bagian di bawah ini sudah cukup kuat untuk dianggap final pada level kontrak runtime.

### 1. Kontrak peta inti 160x120

Sudah final:

- `generateVillageMap(160, 120, 12345, villageData)` dipakai langsung oleh `WilayahPage`.
- Terrain inti sudah konsisten: hutan barat, sungai timur, sawah selatan, jalan utama horizontal dan vertikal.
- Metadata spasial yang dipakai engine sudah diexpose: `sectorBounds`, `hazardHubs`, `rwCenters`, `mainRoadY`, `mainRoadX`.

Implikasi:

- Grid 160x120 sekarang adalah kontrak runtime yang valid.
- Topologi inti desa sudah bukan lagi sekadar ide desain.

### 2. Topologi bangunan utama dan koordinat strategis

Sudah final:

- Bangunan pusat, utara, barat, timur, dan selatan sudah di-hardcode di `map-utils.js`.
- Bangunan baru blueprint sudah benar-benar ada di runtime topology:
  - `homestay`
  - `dermaga`
  - `pos_ronda`
  - `pesantren`
  - `padepokan_dukun`
  - `pasar_hewan`
  - `info_wisata`
  - `gardu_pandang`

Catatan:

- Ini final pada level topologi dan marker/icon.
- Ini belum otomatis berarti semua bangunan itu sudah punya gameplay interior.

### 3. 200 KK dan unlock RW progresif

Sudah final:

- `VillageRegistry.js` memang merge `30 + 170 = 200 KK`.
- `RW_UNLOCK_THRESHOLDS` aktif untuk RW `01` sampai `08`.
- `WilayahPage` dan `SensusPage` sudah membaca `unlockedRWs` dan menandai keluarga/rumah sebagai `isLocked`.

Tambahan penting:

- Bug lama `RW 09` sudah tidak tampak di data aktif.
- `kk_199` dan `kk_200` sekarang berada di RW `08`, bukan RW `09`.

Artinya:

- Bagian blueprint yang masih menyebut `RW 09 orphan bug` sekarang stale.

### 4. 2D sebagai view utama, 3D sebagai layer opsional

Sudah final secara arah produk:

- `WilayahPage` menjadikan 2D blueprint sebagai mode utama.
- 3D diorama tersedia sebagai mode opsional bila WebGL tersedia.

Namun ada koreksi penting:

- Runtime 3D saat ini adalah diorama seluruh desa, bukan pocket diorama per-RW seperti yang ditulis blueprint.
- Jadi kontrak "2D utama, 3D opsional" final.
- Detail implementasi "Pocket Diorama RW only" belum final dan harus diturunkan ke provisional.

### 5. Mobilitas desa: jarak, energi, kendaraan, jembatan

Sudah final:

- Home visit cost sudah dihitung dari jarak efektif melalui `homeVisitTravel.js`.
- Vehicle progression aktif melalui `vehicleProgression.js`.
- Bridge seasonal state aktif melalui `bridgeSeasonalState.js`.
- Home visit ke sektor timur bisa benar-benar terblokir saat jembatan putus.
- Ada aksi runtime `repairBridge()` untuk mempercepat pemulihan.

Ini berarti Q2 dan bagian besar mekanik jembatan sudah hidup nyata.

### 6. Layer overlay aktif di peta

Sudah final:

- Runtime punya layer aktif yang benar-benar dipakai marker dan HUD:
  - `general`
  - `pispk`
  - `surveillance`
  - `psn`
  - `phbs`
  - `perilaku`

Implikasi:

- Sistem overlay sudah final sebagai fitur runtime.
- Tetapi bentuknya tidak lagi sama dengan deskripsi blueprint Q11 yang hanya punya 3 lensa.

### 7. Service coverage rings, champion, intel, outbreak zone

Sudah final:

- Service coverage rings hidup di `Map2DBlueprint.jsx`.
- `local champion` dan `champion protection` hidup di marker 2D.
- `warung intel` hidup di store dan marker 2D.
- `outbreak zones` hidup secara visual di peta 2D.

Ini adalah salah satu area yang paling sinkron antara visi gameplay dan runtime aktif.

### 8. Art direction 2D editorial sudah banyak terimplementasi

Sudah final pada arah visual utama:

- `Map2DTerrain.jsx` sudah canvas-based.
- Background parchment + procedural noise sudah aktif.
- Terrain sudah pakai palette hangat.
- Marker bangunan sudah acrylic token style.
- Rumah sudah memakai LED node logic.
- River, contour, grid, vignette, dan time-of-day overlay sudah ada.

Ini penting karena blueprint masih punya bagian yang berbunyi seolah terrain renderer lama "masih melanggar".
Itu sudah tidak akurat lagi.

## Provisional Or Partial

Bagian-bagian berikut belum boleh dianggap final, walaupun blueprint menulisnya sebagai resolved.

### 1. Q1 Hybrid settlement algorithm per sektor

Blueprint mengklaim:

- barat/selatan memakai Poisson Disk
- timur memakai distance-to-curve
- utara memakai distance-to-line
- pusat memakai Gaussian

Runtime aktual:

- penempatan rumah berangkat dari `RW_CENTERS`
- rumah disebar dengan economy bias terhadap pusat RW
- validasi dilakukan dengan spiral search dan fallback random bounded

Jadi statusnya:

- `final` untuk ide umum "setiap RW punya pusat dan karakter spasial"
- `provisional` untuk klaim algoritma matematis detail per sektor

Kesimpulan:

- Blueprint terlalu spesifik dibanding implementasi nyata.

### 2. Q3 Pocket Diorama RW

Blueprint mengunci 3D sebagai pocket diorama per-RW.

Runtime aktual:

- `WilayahDiorama.jsx` merender seluruh `mapData.buildings`
- kamera melakukan swoop dan dive ke bangunan yang dipilih
- tidak ada filter RW sebagai unit render utama

Status:

- `final` untuk 3D optional presentation layer
- `provisional` untuk konsep pocket diorama RW-only

### 3. Q4 Blank Spot Data visual framing

Blueprint menulis:

- RW terkunci harus tampil sebagai area abu-abu
- ada label `Belum Terdata`

Runtime aktual:

- keluarga di RW terkunci ditandai `isLocked`
- marker rumah jadi grayscale/non-interaktif
- drawer kanan memberi pesan "Wilayah Belum Terbuka"
- `SensusPage` juga mengunci akses detail

Yang belum ada:

- overlay area abu-abu tingkat RW
- label peta `Belum Terdata`

Status:

- `final` untuk logika unlock dan lock state
- `provisional` untuk presentasi visual blueprint yang spesifik

### 4. Q6 Upgrade visual fasilitas

Blueprint menjanjikan upgrade visual nyata seperti:

- `mck_basic -> mck_keramik`
- `pamsimas_rusak -> pamsimas_aktif`
- `posyandu_sederhana -> posyandu_mandiri`

Runtime aktual:

- progres upgrade memang ada
- marker 2D bisa menampilkan badge/ring status upgrade
- helper `facilityUpgradeVisual.js` ada, tetapi belum tampak dipakai di renderer utama

Status:

- `final` untuk state progression fasilitas
- `provisional` untuk sprite swap atau transformasi visual penuh sesuai blueprint

### 5. Q9 Event spawning at map

Blueprint menulis event harus spawn sebagai anchor di atap bangunan dengan ikon alert.

Runtime aktual:

- outbreak cluster memang punya visual zone di peta
- active IKM events tampak di HUD/button
- ada notifikasi dan panel event

Yang belum terlihat jelas di peta 2D:

- marker `alert on roof` generik untuk event IKM per bangunan
- kewajiban klik bangunan tertentu via anchor visual khusus

Status:

- `partial`

### 6. Q10 Death and consequence

Blueprint menulis sistem lengkap:

- bendera kuning 3 hari
- radius distrust 3 rumah
- difficulty multiplier COM-B
- reputasi turun
- recovery visit untuk mencabut distrust

Runtime aktual yang terverifikasi:

- `dischargeEmergencyPatient()` menambah `deathCases` KPI dan penalti reputasi
- tidak tampak implementasi visual marker duka di peta
- tidak tampak sistem radius distrust map-based
- tidak tampak recovery loop khusus keluarga berduka

Status:

- `provisional`

Ini salah satu mismatch paling besar antara blueprint dan kode aktif.

### 7. Q11 Detective mode

Blueprint menulis 3 lensa:

- IKS
- Surveilans
- Kerentanan SDoH

Runtime aktual punya 6 layer:

- PIS-PK
- Surveilans
- Jentik
- PHBS
- Perilaku
- Infrastruktur umum sebagai baseline

Status:

- `final` untuk adanya layer tunggal aktif
- `stale` untuk isi Q11 di blueprint

Blueprint harus ditulis ulang mengikuti overlay runtime aktual.

### 8. Q12 Semantic zoom 3 level

Blueprint mengunci:

- macro heatmap RW
- meso cluster marker
- micro individual marker

Runtime aktual:

- hanya punya dua mode utama:
  - `zoom < 0.6`: fasilitas + rumah kritis/vulnerable/intel
  - `zoom >= 0.6`: semua bangunan

Yang belum ada:

- heatmap polygon RW
- cluster marker `RT x rumah`
- transisi 3 level seperti spesifikasi blueprint

Status:

- `partial`

### 9. Desa wisata dan tourist workflow

Runtime yang ada:

- building wisata sudah ada di topologi
- outsider patient bisa diberi `patientType = tourist|worker`
- EMR mengenali `Warga Tetap` vs `Pendatang`

Yang belum terverifikasi sebagai fitur utuh:

- tourist travel history tab di EMR
- alur wisatawan spawn dari gapura/dermaga lalu bergerak ke landmark
- jadwal turis dan forecast demand di `info_wisata`
- reward/penalty ala review wisata

Status:

- `partial`

### 10. Hazard hubs sebagai gameplay interior

Runtime yang ada:

- hazard hub sudah ada di topologi, icon, dan marker

Yang belum final:

- `GAME_ENABLED_BUILDINGS` belum mencakup:
  - `pesantren`
  - `padepokan_dukun`
  - `pos_ronda`
  - `homestay`
  - `dermaga`
  - `pasar_hewan`
  - `info_wisata`
  - `gardu_pandang`

Status:

- `final` untuk keberadaan di peta
- `provisional` untuk gameplay scene/interior

### 11. Frontier systems phase 5/6

Bagian seperti:

- wastewater surveillance
- AMR
- hoax wave
- 2AM shift
- planetary health
- full one-health tourist loop

Status:

- `future`

Tidak boleh lagi dibaca sebagai implementasi aktif.

## Stale Or Incorrect In Blueprint

Bagian berikut sebaiknya dikoreksi langsung saat blueprint utama di-update.

### A. Header status terlalu tinggi

Baris status `FINAL v2.3 - Geospatial SDoH Engine Complete` terlalu agresif.

Usulan status pengganti:

- `Runtime-Audited Blueprint`
- atau `Topology Final, Gameplay Extensions Partial`

### B. Q11 tidak mencerminkan runtime

Blueprint masih menulis 3 lensa.
Runtime sudah pindah ke 6 overlay utama.

### C. Q12 terlalu spesifik dan belum terwujud

Heatmap RW dan cluster markers belum ada.
Jadi semantic zoom belum boleh diberi cap resolved penuh.

### D. Q10 terlalu optimistis

Death consequence lengkap belum terbukti hidup di peta/store runtime.

### E. Bagian "Map2DTerrain melanggar guardrail" sudah outdated

Blueprint masih menyebut renderer lama berbasis banyak SVG rect.
Runtime sekarang sudah punya `Map2DTerrain.jsx` berbasis canvas.

### F. Bagian "codebase belum punya pesantren/padepokan" sudah outdated

Topologi dan marker bangunan-bangunan itu sudah ada.
Yang belum ada adalah interior gameplay-nya.

### G. Bagian bug RW 09 sudah outdated

Audit runtime sekarang tidak menemukan RW `09` aktif pada data keluarga ekspansi.

## Locked Decisions Going Forward

Supaya pekerjaan blueprint tidak melebar lagi, keputusan berikut sebaiknya dianggap terkunci:

1. `map-utils.js` adalah source of truth topologi grid dan koordinat strategis.
2. 2D blueprint adalah source of truth gameplay spasial.
3. 3D diorama adalah presentational layer opsional, bukan sumber aturan map.
4. Semua bangunan baru boleh dianggap final hanya pada level topologi sampai interiornya benar-benar diaktifkan.
5. Semua fitur yang belum tampak di runtime harus diberi label `provisional` atau `future`, bukan `resolved`.

## Recommended Next Edit To Blueprint

Kalau `docs/blueprint_peta_desa.md` mau dibersihkan setelah audit ini, urutan edit paling aman:

1. Turunkan status header utama.
2. Revisi Q11 agar mengikuti 6 overlay runtime.
3. Revisi Q12 agar mengakui semantic zoom saat ini masih 2-level practical implementation.
4. Pecah setiap fitur wisata/hazard hub menjadi dua status:
   - `topology final`
   - `gameplay scene provisional`
5. Hapus catatan lama tentang bug RW 09 dan terrain SVG violation.
6. Tambahkan catatan eksplisit bahwa 3D saat ini adalah full-village diorama, bukan pocket RW-only.

## Bottom Line

Blueprint desa sudah cukup matang untuk dikunci pada level:

- grid
- topologi
- distribusi 200 KK
- unlock RW
- visual 2D utama
- mobilitas dan hambatan geografis

Tetapi blueprint belum boleh dikunci penuh pada level:

- semantic zoom 3 tahap
- event anchor map yang lengkap
- death consequence loop
- tourist workflow
- hazard hub interiors
- frontier epidemiology systems

Dengan kata lain:

- `desa blueprint core = final`
- `desa gameplay expansion layer = provisional`
