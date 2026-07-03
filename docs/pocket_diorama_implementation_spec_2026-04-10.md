# Pocket Diorama Implementation Spec
*Tanggal: 10 April 2026*
*Status: Proposed implementation spec for Wilayah 3D inspector pivot*

---

## 1. Decision Lock

`Wilayah` 3D **tidak** lagi diposisikan sebagai peta taktis kedua.

Keputusan produk yang dikunci:

- `2D blueprint` tetap **single source of truth** untuk gameplay operasional
- `3D` dibingkai sebagai **inspector / reward / empathy / exhibition**
- bentuk pocket diorama utama adalah **per-RW**
- `sector-level` pocket diorama hanya dipakai bila nanti dibutuhkan untuk `showcase` atau `exhibition`
- `building-level` diorama dipakai untuk bangunan naratif penting, tetapi tetap berada di dalam jalur inspector

Alasan memilih `RW` sebagai unit utama:

- game sudah memakai bahasa `RW unlock`, `blank spot`, `Posyandu RW`, dan progres `PIS-PK`
- data `family.rw`, `rwCenters`, dan zona RW sudah tersedia di runtime
- dari sisi UX, `RW` lebih mudah dipahami pemain daripada `sector` sebagai unit kerja harian

---

## 2. Tujuan Teknis

Pivot ini harus menghasilkan empat hal sekaligus:

1. mengurangi beban render 3D dibanding `full-village`
2. menjaga kejelasan mental model: pemain tetap berpikir di 2D
3. memberi momen empati/showcase tanpa menambah parity debt
4. tetap aman untuk mobile dan laptop low-end

---

## 3. State Yang Dibutuhkan

Owner utama state tetap [WilayahPage.jsx](D:/Dev/PRIMER/src/components/WilayahPage.jsx).

### 3.1 Canonical state

- `selectedBuilding`
  - sudah ada sekarang
  - tetap dipakai untuk klik bangunan/rumah di 2D
- `activeLayer`
  - sudah ada sekarang
  - tetap mengontrol 2D gameplay
- `viewMode`
  - sekarang `2D | 3D`
  - nanti sebaiknya diubah jadi:
    - `map2d`
    - `exhibition3d` optional / hidden

### 3.2 State baru untuk inspector

- `inspectorOpen: boolean`
  - apakah drawer/sidebar/bottom-sheet inspector sedang terbuka
- `inspectorTab: 'summary' | 'diorama' | 'actions' | 'wiki'`
  - desktop bisa multi-tab
  - mobile bisa dipadatkan menjadi section stack
- `inspectorScope: { kind: 'rw' | 'building' | 'sector', id: string | null }`
  - state kunci untuk menentukan pocket diorama merender apa
- `selectedRwId: string | null`
  - ditetapkan saat user klik zona RW atau bangunan yang punya `familyData.rw`
- `selectedSectorKey: 'pusat' | 'utara' | 'barat' | 'timur' | 'selatan' | null`
  - tidak wajib aktif pada MVP RW-first, tetapi berguna untuk fase lanjut/showcase

### 3.3 State baru untuk kemampuan device

- `dioramaCapability: 'live' | 'snapshot' | 'off'`
  - `live`: boleh render WebGL kecil di inspector
  - `snapshot`: tampilkan gambar statis / poster / fallback art
  - `off`: jangan tampilkan 3D sama sekali
- `dioramaStatus: 'idle' | 'loading' | 'ready' | 'failed'`
  - mempermudah UX loading/recovery
- `dioramaAutoRotate: boolean`
  - default `true`
  - bisa otomatis dimatikan untuk device lemah

### 3.4 Derived state

- `effectiveInspectorScope`
  - jika klik rumah → naikkan ke `rw`
  - jika klik bangunan naratif tertentu → bisa tetap `building`
- `pocketDioramaData`
  - hasil slicing dari `mapData`
  - bukan state manual; sebaiknya `useMemo`

---

## 4. Struktur Komponen

Struktur target yang disarankan:

### 4.1 Ownership tree

- `WilayahPage`
  - tetap owner data gameplay dan interaksi utama
- `WilayahInspector`
  - wrapper panel kanan / bottom sheet
- `PocketDioramaCard`
  - hero visual di inspector
- `PocketDioramaCanvas`
  - renderer 3D live kecil
- `PocketDioramaFallback`
  - snapshot/art statis jika `live` tidak layak

### 4.2 Split 3D scene

Refactor dari [WilayahDiorama.jsx](D:/Dev/PRIMER/src/components/wilayah/3d/WilayahDiorama.jsx) sebaiknya menjadi:

- `DioramaSceneCore.jsx`
  - isi shared scene: lampu, terrain, building map, tooltip bridge, scene shell
- `PocketDioramaCanvas.jsx`
  - pakai `DioramaSceneCore`
  - kamera terkunci
  - area render kecil
  - tanpa pan bebas
- `ExhibitionVillageDiorama.jsx`
  - nama baru untuk jalur `full-village` lama
  - dipakai hanya jika mode showcase tetap dipertahankan

### 4.3 Helper yang dibutuhkan

- `buildPocketDioramaData.js`
  - input: `mapData`, `scope`
  - output: `subsetMapData`
- `resolveInspectorScope.js`
  - input: `selectedBuilding`, `mapData`
  - output: scope efektif (`rw` lebih diutamakan)
- `useDioramaCapability.js`
  - menentukan `live / snapshot / off`

### 4.4 Contract `buildPocketDioramaData`

Input:

- `mapData`
- `scope.kind`
- `scope.id`

Output minimum:

- `tiles`
- `buildings`
- `width`
- `height`
- `centerX`
- `centerY`
- `scopeMeta`

Aturan slicing:

- `kind: 'rw'`
  - ambil semua bangunan/rumah dengan `familyData.rw === id`
  - tambahkan fasilitas lokal yang paling relevan:
    - `posyandu_rw{id}`
    - bangunan layanan/hazard terdekat di sekitar bounding box
- `kind: 'building'`
  - ambil bangunan target + konteks sekitar radius kecil
- `kind: 'sector'`
  - gunakan `sectorBounds` dari [map-utils.js](D:/Dev/PRIMER/src/components/wilayah/map-utils.js)

Tambahan penting:

- pocket data harus punya margin visual, jangan crop terlalu mepet
- center kamera harus dihitung dari subset, bukan dari pusat desa penuh

---

## 5. Flow Desktop

### 5.1 Default

- user masuk ke `Wilayah`
- yang tampil penuh tetap `Map2DBlueprint`
- user klik rumah / fasilitas / zona RW
- inspector kanan terbuka

### 5.2 Saat klik rumah biasa

- `selectedBuilding` diset seperti sekarang
- sistem mencari `familyData.rw`
- `inspectorScope` otomatis menjadi `{ kind: 'rw', id: rw }`
- tab default:
  - `summary` untuk data
  - hero area atas menampilkan pocket diorama RW

### 5.3 Saat klik bangunan naratif

- jika bangunan seperti `pesantren`, `padepokan_dukun`, `pasar_hewan`, `pos_ronda`
- inspector tetap terbuka
- `inspectorScope` boleh:
  - tetap `rw` untuk konsistensi, atau
  - `building` jika bangunan itu memang lebih cocok diberi spotlight mikro

Untuk MVP:

- tetap prioritaskan `rw`
- `building` hanya dipakai untuk bangunan naratif khusus

### 5.4 Interaksi diorama desktop

- auto-rotate pelan (`turntable`)
- kamera fixed orbit
- tidak ada free pan
- zoom hanya 1-2 langkah, atau bahkan nonaktif
- klik diorama boleh:
  - `pause rotation`
  - `focus building`
  - tetapi tidak boleh menjadi jalur komando utama

CTA utama tetap berada di panel 2D/native:

- `Kunjungan Rumah`
- `Masuk Gedung`
- `Lihat Event`
- `Wiki & Prosedur`

---

## 6. Flow Mobile

### 6.1 Default

- 2D tetap fullscreen
- user tap rumah / RW / fasilitas
- muncul `bottom sheet inspector`

### 6.2 Hero visual mobile

Urutan prioritas:

1. `snapshot`
2. `small live 3D` hanya jika device aman
3. `no 3D` bila perlu

Kenapa:

- mobile harus mendahulukan responsivitas
- `bottom sheet + WebGL live` mudah terasa berat di device rendah

### 6.3 Interaksi mobile

- diorama tidak full-screen
- tidak ada orbit bebas dengan gesture liar
- tap pada hero visual hanya:
  - expand visual
  - play/pause rotate
  - atau buka `Exhibition Preview`

Semua aksi gameplay tetap button biasa di sheet:

- `Kunjungan Rumah`
- `Masuk Gedung`
- `Lihat Data RW`

### 6.4 Mobile fallback policy

- `window.innerWidth < 768` bukan satu-satunya sinyal
- tetap pakai policy capability:
  - `live` hanya untuk device yang lolos
  - `snapshot` untuk mayoritas device menengah
  - `off` untuk device bermasalah

---

## 7. UX Rules Yang Harus Dijaga

1. 3D tidak boleh menggantikan peta 2D sebagai pusat orientasi.
2. User tidak boleh bingung “sekarang saya sedang main di layer mana?”
3. Semua keputusan operasional tetap bisa diambil tanpa melihat 3D sama sekali.
4. Inspector harus tetap berguna meskipun `dioramaCapability !== 'live'`.
5. RW terkunci harus tetap terasa `Belum Terdata`, bukan “desa penuh yang diam-diam sudah terbuka”.

---

## 8. Urutan Refactor dari `WilayahDiorama` Sekarang

Urutan ini dibuat supaya aman dan tidak memecahkan runtime yang sudah ada.

### Step 1 — Isolate scene core

Pecah [WilayahDiorama.jsx](D:/Dev/PRIMER/src/components/wilayah/3d/WilayahDiorama.jsx) menjadi bagian reusable:

- canvas shell
- camera bridge
- scene core
- tooltip layer

Target:

- scene bisa dipakai baik oleh `full-village` maupun `pocket`

### Step 2 — Rename jalur lama

Ubah `WilayahDiorama` lama menjadi sesuatu yang lebih jujur, misalnya:

- `ExhibitionVillageDiorama`

Tujuan:

- supaya tidak lagi terbaca sebagai default 3D gameplay mode

### Step 3 — Tambah scope resolver

Buat helper:

- `resolveInspectorScope(selectedBuilding, mapData)`

Rules awal:

- rumah biasa -> `rw`
- fasilitas umum biasa -> `rw` jika ada konteks keluarga/RW dekat
- hazard building tertentu -> `building`

### Step 4 — Tambah data slicer

Buat:

- `buildPocketDioramaData(mapData, scope)`

Ini adalah jantung pivot.

Kalau data slicer ini sehat, kita tidak perlu membangun 8 diorama manual.

### Step 5 — Bangun `PocketDioramaCanvas`

Fitur:

- ukuran kecil
- fixed camera
- auto-rotate
- no tactical overlay
- no free roam
- error recovery sederhana

### Step 6 — Integrasikan ke inspector panel

Masukkan `PocketDioramaCard` ke area hero inspector yang sekarang masih memakai gambar inset di [WilayahPage.jsx](D:/Dev/PRIMER/src/components/WilayahPage.jsx).

Tahap aman:

- letakkan 3D kecil di atas gambar lama
- jika gagal, fallback ke gambar inset lama

### Step 7 — Tambah capability policy

Buat `useDioramaCapability()` dan tentukan:

- kapan `live`
- kapan `snapshot`
- kapan `off`

Tahap ini penting untuk mobile dan laptop kentang.

### Step 8 — Demote toggle 3D full-screen

Setelah inspector hidup:

- toggle `2D / 3D` harian sebaiknya didemote
- `full-village 3D` pindah ke:
  - exhibition mode
  - dev toggle
  - atau hidden showcase entry

### Step 9 — Tambah regression guard

Minimal test yang perlu:

- `resolveInspectorScope` memilih `rw` dengan benar
- `buildPocketDioramaData` hanya mengembalikan subset yang tepat
- fallback `snapshot/off` tetap membuat inspector usable
- mobile bottom sheet tidak bergantung pada WebGL

---

## 9. MVP Yang Paling Masuk Akal

Jangan langsung mengejar versi final paling mewah.

MVP yang paling sehat:

1. `RW-first pocket inspector`
2. desktop sidebar hero kecil
3. mobile snapshot-first
4. full-village 3D tetap ada, tetapi bukan jalur default
5. belum ada parity overlay dinamis di 3D

Kalau MVP ini berhasil, baru pertimbangkan:

- `Data Bloom` saat RW unlock
- building-level narrative diorama
- exhibition fly-through

---

## 10. Acceptance Criteria

Pivot dianggap berhasil bila:

1. user tetap bisa bermain penuh hanya dengan 2D
2. inspector terasa lebih hidup saat RW dipilih
3. mobile tidak memaksa WebGL live
4. device lemah tidak mengalami degrade besar karena 3D tidak selalu mount
5. 3D tidak lagi menyesatkan soal `Belum Terdata` dan posisi gameplay-critical

---

## 11. Immediate Next Task

Jika eksekusi dimulai sekarang, urutan task paling aman:

1. buat `resolveInspectorScope`
2. buat `buildPocketDioramaData`
3. ekstrak `DioramaSceneCore`
4. implement `PocketDioramaCanvas`
5. tempel ke inspector desktop
6. tambah mobile fallback policy
