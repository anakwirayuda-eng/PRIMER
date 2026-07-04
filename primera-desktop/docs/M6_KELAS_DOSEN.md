# M6 — Kelas & Dosen: Integritas Asesmen (DESAIN, ditulis sebelum kode)

> Tanggal: 2026-07-03 · Ruang lingkup: ROADMAP butir **26** (rekomputasi skor
> dari action-log) + **27** (Dossier Mahasiswa bertanda tangan, offline-first).
> Butir 28 (dashboard Supabase) & 29 (telemetri) = opsional-online, DITUNDA
> sampai keputusan infrastruktur kelas; kontrak data yang dibangun di sini
> (dossier JSON terverifikasi) adalah masukan langsung untuk keduanya.

## 0. Temuan eksplorasi yang mengoreksi asumsi roadmap

Roadmap menulis *"fondasi sudah ada (log lengkap di state)"* — **keliru**.
`LogEntry` hari ini = `{hari, blok, aksi: Action['type'], detail?}` — jurnal
telemetri untuk debrief, TIDAK memuat payload aksi (`pertanyaanId`, `icd10`,
`obatId`, …) sehingga **tidak bisa di-replay**. Fondasi yang benar-benar ada:

1. `buildInitialState(namaDokter, seed, pack, {mode})` deterministik penuh —
   paket ujian & seedKurikulum diturunkan dari seed (M4.5).
2. `advance(state, action, pack)` murni; keacakan hanya dari `Rng`
   (mulberry32) yang di-seed dari `seed`/`seedKurikulum` + hari + nama stream.
3. Konsekuensi: **state awal + urutan aksi lengkap = seluruh permainan dapat
   direproduksi byte-demi-byte**. Yang hilang tinggal jurnal aksi lengkap.

## 1. Model ancaman (jujur, tanpa teater keamanan)

| Ancaman | Pertahanan |
|---|---|
| Edit tangan file dossier (ubah skor/tally sebelum setor) | **Replay**: skor TIDAK dibaca dari klaim, tapi DIHITUNG ULANG dari jejak aksi. Klaim ≠ hasil replay → TIDAK SAH. |
| Edit kasar (typo JSON, potong jejak) | Validasi bentuk + replay mismatch → TIDAK SAH. |
| Edit canggih + hitung ulang HMAC (butuh baca source utk kunci) | HMAC hanya *deterrent*; pertahanan sejati tetap replay — memalsukan jejak yang KONSISTEN setara dengan memainkan game dengan benar (TAS). Diterima sebagai residual risk; dicatat di sini agar tak ada ilusi. |
| Joki / share save antar mahasiswa | Di luar cakupan kriptografi: seed per-mahasiswa berbeda → jejak identik antar 2 dossier = red flag manual dosen (`seed` & `namaDokter` tercetak di panel verifikasi). Deteksi kembar otomatis = kandidat butir 28. |
| Dossier dari Mode Karier disetor sbg ujian | `mode` & `paketUjian` bagian dari data yang direplay + dicetak besar di panel verifikasi. |
| Konten game berbeda versi (kasus di-patch) → replay melenceng | `sidikJariPack` (FNV-1a atas id konten) direkam di dossier; beda → status TIDAK DAPAT DIVERIFIKASI (bukan TIDAK SAH) + anjuran verifikasi dgn build yang sama. |

## 2. Arsitektur

### 2a. Jurnal aksi penuh — `GameState.jejak: Action[]`

- Ditambahkan di `catat()` reducer: SETIAP aksi yang masuk `advance` di-append
  (termasuk yang berakhir `ERROR_AKSI` — replay mereproduksi penolakan yang
  sama, state tetap konsisten).
- `init` → `jejak: []`. Save lama tanpa field → `deserialize` mengisi `[]`
  (kompat); verifier menandai *"jejak dimulai bukan dari Hari 1"* → TIDAK
  DAPAT DIVERIFIKASI (game yang dimulai SETELAH patch ini selalu utuh).
- Estimasi ukuran: ±120 aksi/hari × 30–90 hari × ±40 byte ≈ 150 KB–450 KB
  JSON — aman untuk save/ekspor.
- `VERSI_SAVE` tetap 1: penambahan field opsional-dengan-default, bukan
  perubahan bentuk.

### 2b. Verifier headless — `src/engine/verifikasi.ts` (murni, tanpa DOM)

```
verifikasiDossier(json, pack) →
  { status: 'sah' | 'tidak_sah' | 'tidak_dapat_diverifikasi',
    alasan: string[],           // setiap ketidakcocokan dijelaskan
    ringkasan?: { namaDokter, mode, paketUjian?, hari, skorKlaim, skorReplay, grade } }
```

Urutan pemeriksaan (berhenti di kegagalan kategori lebih awal):
1. **Bentuk**: parse + field wajib + `format: 'primer-dossier'` + versi.
2. **Tanda tangan**: HMAC-SHA256 (WebCrypto, kunci embedded) atas
   `stringifyKanonik(dossier tanpa field ttd)`. Beda → TIDAK SAH (alasan:
   "berkas diubah setelah diekspor").
3. **Sidik jari konten**: beda → TIDAK DAPAT DIVERIFIKASI.
4. **Jejak utuh**: kosong / tak dimulai dari kondisi awal → TIDAK DAPAT
   DIVERIFIKASI.
5. **Replay**: `buildInitialState` → fold `advance` seluruh jejak →
   bandingkan `tally` (kanonik), `hari`, `tamat`, dan `hitungSkor()` vs klaim.
   Mismatch apa pun → TIDAK SAH + daftar field yang melenceng.

`stringifyKanonik`: JSON.stringify dengan kunci objek diurutkan rekursif —
satu-satunya bentuk yang di-HMAC & dibandingkan (kebal urutan properti).

### 2c. Dossier Mahasiswa — format berkas

```jsonc
{
  "format": "primer-dossier", "versi": 1,
  "identitas": { "namaDokter": "...", "nim": "..." },      // nim opsional, diisi saat ekspor
  "stase": { "mode": "ujian", "paketUjian": "paket_c", "seed": 123, "seedKurikulum": 777,
              "hari": 30, "tamat": { "hari": 30, "grade": "B" } },
  "klaim": { "skor": {4 dimensi}, "grade": "B", "tally": {…}, "badge": ["…"] },
  "jejak": [ {"type":"PANGGIL_PASIEN"}, {"type":"TANYA","pertanyaanId":"q_onset"}, … ],
  "lingkungan": { "versiApp": "0.1.0", "sidikJariPack": "a1b2c3d4" },
  "ttd": "hex hmac-sha256"
}
```

- Ekspor dari **Laporan Akhir** (hanya terbit saat `tamat` — kunci skor M4.5
  tetap dihormati); tombol terpisah dari "Ekspor Arsip" (arsip = save lengkap
  untuk MAIN LAGI; dossier = bukti untuk DINILAI).
- Verifikasi dari **layar judul** ("Verifikasi Dossier — untuk dosen"): pilih
  file → panel hasil ber-stempel `SAH` (hijau) / `TIDAK SAH` (merah) /
  `TIDAK DAPAT DIVERIFIKASI` (kunyit) + ringkasan + daftar alasan. Dosen
  memakai build game yang sama — tidak butuh server/instalasi lain (offline-first).

### 2d. Keputusan yang sengaja TIDAK diambil sekarang

- **Butir 28 (dashboard Supabase)**: menunggu keputusan infra kelas; dossier
  JSON terverifikasi adalah unit datanya kelak (upload = insert satu baris).
- **Butir 29 (telemetri)**: jejak aksi penuh SUDAH menjadi telemetri
  per-keputusan; analisis batch (mis. distribusi TEGAK/SUSPEK per kasus utk
  kalibrasi M7) bisa dibangun di atas dossier tanpa event pipeline baru.
- **Deteksi jejak-kembar antar dossier**: manual dulu (seed tercetak); otomatis
  menyusul bersama 28.

## 3. Rencana test (`m6verifikasi.test.ts`)

1. **Sah**: mainkan beberapa aksi nyata di PACK produksi → susun dossier +
   ttd → verifikasi = `sah`, skorReplay = skorKlaim.
2. **Tamper klaim**: ubah `klaim.tally.diagnosisBenar` (+ttd dihitung ulang
   penyerang) → replay menangkap → `tidak_sah`.
3. **Tamper jejak**: hapus satu aksi → `tidak_sah`.
4. **Tamper file tanpa ttd baru**: ubah 1 field → gagal di tanda tangan.
5. **Jejak kosong** (simulasi save lama) → `tidak_dapat_diverifikasi`.
6. **Sidik jari beda** → `tidak_dapat_diverifikasi`.
7. **Determinisme**: dua kali verifikasi dossier sama → hasil identik.
