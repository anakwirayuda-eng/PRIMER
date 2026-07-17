# M11 E-2 - Proposal Keputusan SAJI Fase 2

**Tanggal:** 2026-07-17  
**Baseline sebelum implementasi:** commit `943bfc9`, `REVISI_ENGINE=41`

**Keputusan dokter/pemilik:** **SETUJU REKOMENDASI E-2**, 2026-07-17

**Status:** **SELESAI DIIMPLEMENTASIKAN** pada `REVISI_ENGINE=42` dan content release
`m11-e2-saji-pilot-2026-07-17`.

**Tujuan:** mengunci desain dan rekam pelaksanaan gelombang unfreeze tunggal
`REVISI_ENGINE 41 -> 42`.

## 1. Rekomendasi singkat

Rekomendasi operatif CODEX adalah:

1. Tambahkan babak **Ingatkan** secara bertahap pada 5 skenario pilot.
2. Pertahankan `kualitasMi` sebagai ukuran wawancara murni; buat nilai per-kunjungan
   `kualitasSaji = 0,8 x kualitasMi + 0,2 x kualitasIngatkan` hanya untuk skenario
   yang sudah memiliki babak Ingatkan. Jangan jadikan satu jawaban Ingatkan sebagai
   hard gate keberhasilan kunjungan.
3. Modelkan `ditolak_total` dan `diterima_terpaksa` sebagai **penutupan kontak awal
   yang sah**, bukan sebagai hasil setelah wawancara/intervensi selesai.
4. Tambahkan field `hasilAkhir` berisi enam kemungkinan dan pertahankan field lama
   `berhasil`, `diusir`, serta `tingkat` untuk kompatibilitas.
5. Pada dua penutupan kontak sah itu, jangan ubah indikator, TTM, arc, MI, atau skor.
   Habiskan slot lapangan, buat janji ulang, dan jangan percepat karma.
6. Pecah `konfrontasi` menjadi empat perangkap primer:
   `menghakimi`, `menggurui`, `menakut_nakuti`, dan `memaksa`. Mekanik dua pilihan
   buruk beruntun tetap identik.
7. Uji penerimaan awal hanya pada 2 keluarga Career; jangan masukkan ke Ujian dan
   jangan membuatnya acak.

## 2. Fakta yang diverifikasi

### 2.1 Snapshot gameplay saat ini

| Fakta | Nilai aktual |
|---|---:|
| Keluarga aktif | 16 |
| Skenario kunjungan aktif | 27 |
| Skenario dengan varian Tingkat-A | 11 |
| Pilihan dialog runtime | 255 |
| Pilihan bergaya `konfrontasi` | 82 |
| Skenario dengan 3 node dialog | 23 |
| Skenario dengan 4 node dialog | 4 |

Satu node menghasilkan satu pilihan yang diambil pemain. Jadi 23/27 kunjungan
memiliki tiga unit MI, sedangkan empat kunjungan memiliki empat unit MI.

### 2.2 Kontrak engine yang sudah hidup

- Fase: `observasi -> wawancara -> diagnosis_perilaku -> resep_sosial -> selesai`.
- `kualitasMi` adalah proporsi pilihan dialog `tepat` terhadap pilihan yang diambil.
- Keberhasilan mensyaratkan `kualitasMi >= 50`, selain hipotesis, intervensi, dan
  gerbang eskalasi.
- Secara semantik sudah ada empat hasil: `berhasil`, `partial`, `gagal`, dan `diusir`.
  `tingkat` hanya memuat tiga yang pertama; `diusir` adalah boolean terpisah.
- `miTotal` dan `miTepat` ditally per kunjungan, bukan per tombol dialog.
- Hasil akhir arc sudah memakai `sumber:'janji'` dan jadwal `verifikasi_pispk`.
  Mekanik ini sudah memodelkan komitmen pascaintervensi yang belum terbukti.

Dengan demikian, menambah dua hasil baru tidak menghasilkan union empat anggota,
melainkan enam hasil semantik.

## 3. Koreksi sumber yang mengubah desain

Permenkes 39/2016 masih berstatus **berlaku** pada portal peraturan pemerintah.
PDF resmi diverifikasi visual, bukan hanya melalui OCR:

- Lampiran I halaman 100: Ingatkan berarti mengulang pokok pesan dan tindakan yang
  harus dilakukan keluarga.
- Halaman 101: Pembina Keluarga membuat perjanjian kapan dapat berkunjung lagi.
- Halaman 103: daftar larangan komunikasi memuat memerintah, menyalahkan,
  meremehkan/memberi label, membandingkan, mengklaim, mengancam, membohongi,
  memotong pembicaraan, menyindir, dan mencecar.
- Halaman 104: bila ditolak pada kunjungan pertama, jangan memaksa; tetap ramah,
  nyatakan silaturahmi, buat kesepakatan waktu ulang, dan bila perlu libatkan orang
  yang dihormati keluarga.
- Halaman 105: penerimaan terpaksa/basa-basi disamakan dengan penolakan;
  **perbincangan tentang masalah keluarga sebaiknya tidak dilanjutkan**, lalu dibuat
  kesepakatan waktu yang nyaman untuk kunjungan berikutnya.

Sumber resmi:

- Status: https://www.peraturan.go.id/id/permenkes-no-39-tahun-2016
- PDF: https://peraturan.go.id/files/bn1223-2016.pdf
- Ekstrak lokal: `docs/references/ukm/permenkes-39-2016-pispk/fulltext.txt`,
  terutama baris 796, 808, 811, 820, dan 823.

### Implikasi wajib

Rancangan lama "diterima terpaksa = indikator tetap terverifikasi tetapi rapuh"
tidak boleh diterapkan:

1. Ia bertentangan dengan instruksi halaman 105 untuk tidak melanjutkan pembahasan
   masalah keluarga.
2. Ia memberi label `dokter` pada data yang belum layak diverifikasi.
3. Ia menduplikasi mekanik `sumber:'janji'` + `verifikasi_pispk` yang sudah menangani
   komitmen rapuh setelah intervensi sungguhan.

Istilah yang lebih tepat dalam game adalah **penutupan kontak awal yang sah**, bukan
"hasil terapi/perubahan perilaku" dan bukan alias `diusir`.

## 4. Keputusan D1 - Skor babak Ingatkan

### Opsi A - Tambahkan sebagai satu unit ke rasio MI yang sama

Formula: `(dialog tepat + Ingatkan tepat) / (jumlah dialog + 1)`.

Kelebihan: perubahan kode paling kecil.

Masalah:

- Bobot Ingatkan menjadi 25% pada 23 skenario, tetapi 20% pada empat skenario.
- Pada skenario tiga dialog, MI buruk `1/3` dapat diselamatkan satu tombol Ingatkan
  menjadi `2/4 = 50%` dan lolos gerbang.
- Pada skenario empat dialog, MI minimal-lulus `2/4` dapat dijatuhkan satu tombol
  Ingatkan menjadi `2/5 = 40%`.
- Ingatkan adalah penutupan SAJI, bukan teknik MI/OARS. Nama metrik menjadi tidak
  jujur.

**Verdict:** tidak direkomendasikan.

### Opsi B - Pisahkan MI dan Ingatkan, lalu gabungkan dengan bobot tetap

**Direkomendasikan.**

Per kunjungan:

```text
kualitasIngatkan = 100 bila tepat, 0 bila tidak tepat
kualitasSaji      = round(0,8 x kualitasMi + 0,2 x kualitasIngatkan)
```

Aturan integrasi:

- `AMBANG_KUALITAS_MI_BERHASIL=50` tetap membaca `kualitasMi` murni.
- Tally yang sekarang bernama `miTepat` menerima `kualitasSaji/100` untuk skenario
  ber-Ingatkan, dan `kualitasMi/100` untuk skenario legacy.
- `miTotal` tetap satu unit per kunjungan substantif.
- UI Rapor mengganti label menjadi **Kualitas komunikasi (MI + SAJI)**, sementara
  debrief kunjungan menampilkan MI dan Ingatkan secara terpisah.
- Skenario yang belum memiliki konten Ingatkan byte-for-byte mempertahankan skor
  lama.

Kelebihan: bobot stabil, MI buruk tidak bisa "diselamatkan" satu klik penutup, dan
pilot parsial tidak menghukum skenario legacy.

### Opsi C - Ingatkan sebagai hard gate keberhasilan

Salah Ingatkan langsung membuat hasil `partial` walau MI, hipotesis, dan intervensi
benar.

**Verdict:** tidak direkomendasikan. Satu pilihan biner menjadi cliff yang terlalu
besar dan berisiko mengubah babak edukatif ringan menjadi jebakan meta.

## 5. Keputusan D2 - Bentuk dua penutupan kontak sah

### Model data yang direkomendasikan

Tambahkan field baru, jangan memperlebar `tingkat`:

```ts
type HasilAkhirKunjungan =
  | 'berhasil'
  | 'partial'
  | 'gagal'
  | 'diusir'
  | 'ditolak_total'
  | 'diterima_terpaksa'
```

`HasilKunjungan.hasilAkhir` menjadi sumber tampilan baru. Field legacy tetap ada:

- `berhasil` dan `diusir` dipertahankan agar konsumen lama tidak pecah.
- `tingkat` tetap `'berhasil' | 'partial' | 'gagal'` untuk bridge karma lama.
- Save lama mendapat `hasilAkhir` lewat migrasi derivatif:
  `diusir`, lalu `tingkat`, lalu fallback dari `berhasil`.

### Semantik hasil

| Hasil | Skor MI/SAJI | Indikator/TTM/arc | Jadwal | Karma |
|---|---|---|---|---|
| berhasil/partial/gagal | seperti sekarang | seperti sekarang | seperti sekarang | seperti sekarang |
| diusir | gagal pemain | tidak maju | seperti sekarang | dipercepat seperti sekarang |
| ditolak_total | tidak masuk denominator | tidak berubah | janji ulang wajib | tidak dipercepat |
| diterima_terpaksa | tidak masuk denominator | tidak berubah | janji ulang wajib | tidak dipercepat |

Kedua penutupan sah tetap menghabiskan stamina dan slot lapangan. Keduanya menaikkan
`jumlahKunjungan` dan mengisi `kunjunganTerakhir`, sehingga kejadian hanya muncul
sekali pada kontak pertama dan tidak dapat dipanen berulang.

Untuk keluarga dengan karma aktif, rekomendasi gameplay adalah menunda jatuh tempo
**sekali** sebesar `ulangDalamHari`, sama dengan janji ulang. Ini aturan fairness
game, bukan klaim dari Permenkes. Karena event hanya aktif saat
`jumlahKunjungan===0`, ia tidak dapat dipakai memperpanjang karma tanpa batas.

### Cara membuatnya tetap gameplay, bukan cutscene

Pada kontak pertama yang ditandai konten, pemain mendapat dua respons:

1. Hormati penolakan/basa-basi dan sepakati waktu ulang - hasil sah.
2. Memaksa masuk ke masalah kesehatan saat itu - hasil `diusir` sebagai kegagalan
   pemain.

Pilihan ini terjadi sebelum hotspot dan wawancara. Ia tidak dinilai sebagai MI.

### Yang ditolak

- Alias ke `diusir`: menghukum pemain yang mengikuti pedoman.
- Memasukkan kedua status ke `tingkat`: konsumen lama akan mempercepat/menunda
  karma dengan semantik yang salah.
- Menandai indikator "rapuh": bertentangan dengan halaman 105 dan menduplikasi
  `sumber:'janji'`.

## 6. Keputusan D3 - Scope konten

### Babak Ingatkan

Field yang direkomendasikan memakai array ber-ID, bukan posisi `benar/salahSatu`:

```ts
interface BabakIngatkan {
  prompt: string
  pilihan: Array<{
    id: string
    teks: string
    tepat: boolean
    respons: string
    catatanPedagogis?: string
  }>
}
```

Invariant: tepat tiga pilihan, ID unik, tepat satu jawaban benar, dan urutan render
diacak deterministik. Teks benar wajib spesifik terhadap indikator/tindakan dan
memuat janji waktu ulang melalui placeholder jadwal dari helper engine yang sama
dengan jadwal state. Teks tidak boleh menjanjikan tanggal yang berbeda dari
`followUpHari`/`verifikasi_pispk`.

Pilot 5 skenario:

| Skenario | Domain | Alasan pilot |
|---|---|---|
| `wulan_k1` | hipertensi/PTM | 4 node, varian, karma |
| `santoso_k1` | TB/stigma | 4 node, varian |
| `asih_k1` | KIA risiko tinggi | karma keselamatan |
| `yani_k1` | ASI/tumbuh kembang | dua target, karma |
| `raharjo_k1` | sanitasi | hambatan kesempatan |

Setelah test dan playtest singkat, perluas ke 27/27. Biaya konten penuh yang nyata
adalah 81 pilihan Ingatkan, bukan sekadar 27 kalimat.

### Penutupan kontak awal

Rancangan lama dua penutup tambahan untuk setiap 27 skenario tidak diperlukan.
Sumber menempatkannya pada penerimaan kunjungan, khususnya kontak awal.

Pilot 2 keluarga, Career-only dan tidak acak:

- `santoso_k1`: `ditolak_total`, cocok dengan stigma dan takut ketahuan.
- `asih_k1`: `diterima_terpaksa`, menguji jalur karma berisiko tinggi tanpa
  mengizinkan diskusi substantif dipaksakan.

Setelah pilot, maksimum satu event bespoke pada kontak pertama masing-masing dari
16 keluarga. Tidak perlu dua penutup x 27 skenario dan tidak perlu template generik
yang menghapus karakter keluarga.

`ulangDalamHari` wajib authored per event, rentang validator 1-7 hari, disertai
rasional naratif. Angka ini adalah cadence gameplay/follow-up, bukan regimen klinis.

## 7. Keputusan D4 - Taksonomi gaya terlarang

### Rekomendasi

Gunakan empat label primer agar debrief presisi tetapi tidak overload:

```ts
type GayaDialogTerlarang =
  | 'menghakimi'
  | 'menggurui'
  | 'menakut_nakuti'
  | 'memaksa'
```

Tambahkan helper tunggal `isGayaTerlarang(gaya)`. Semua empat tipe menambah counter
righting-reflex yang sama. Dua berturut-turut tetap `diusir`; tidak ada perubahan
bobot trust atau ambang.

Definisi authoring:

- `menghakimi`: menyalahkan, mempermalukan, meremehkan, memberi label,
  membandingkan, menyindir, atau mencecar.
- `menggurui`: ceramah satu arah, koreksi otoritatif, atau memberi solusi sebelum
  memahami konteks.
- `menakut_nakuti`: risiko, hukum, keluarga, atau komplikasi dipakai sebagai
  ancaman/teror, bukan informed discussion.
- `memaksa`: ultimatum, mengabaikan otonomi, memakai anggota keluarga sebagai alat,
  atau tindakan fisik tanpa izin.

Satu pilihan dapat memiliki lebih dari satu kesalahan. Enum hanya menyimpan
**perangkap primer** untuk chip/debrief; detail klinis, etik, dan SDOH tetap pada
`catatanPedagogis`. Ini penting untuk pilihan seperti `ak3_d3_c` (kompromi rujukan
yang tidak aman) dan `slk2_d3_c` (perubahan dosis tanpa evaluasi), yang tidak boleh
direduksi menjadi masalah nada bicara semata.

### Hasil baca literal 82/82 pilihan

Klasifikasi primer pra-implementasi:

| Subtipe | Jumlah | ID pilihan |
|---|---:|---|
| `menghakimi` | 48 | `wk1_d2_b`, `wk1_d3_b`, `wk2_d1_b`, `sk1_d2_b`, `sk1_d3_b`, `kk1_d2_b`, `kk1_d3_b`, `kk2_d1_b`, `kk2_d2_b`, `kk2_d3_b`, `dewi_d1_konfrontasi`, `dewi_d3_konfrontasi`, `dewi_d4_konfrontasi`, `dewi_k2_d1_konfrontasi`, `dewi_k2_d2_konfrontasi`, `dewi_k2_d3_konfrontasi`, `musa_d1_konfrontasi`, `musa_d2_konfrontasi`, `musa_k2_d1_konfrontasi`, `musa_k2_d2_konfrontasi`, `raharjo_d1_konfrontasi`, `raharjo_d2_konfrontasi`, `raharjo_d3_konfrontasi`, `raharjo_k2_d1_konfrontasi`, `raharjo_k2_d2_konfrontasi`, `raharjo_k2_d3_konfrontasi`, `ak1_d1_b`, `ak1_d2_c`, `ak2_d2_c`, `ak3_d1_c`, `ak3_d2_c`, `slk1_d2_b`, `slk2_d1_c`, `slk2_d2_c`, `yk1_d3_c`, `yk2_d2_c`, `prk1_d1_c`, `prk1_d2_c`, `mk1_d1_c`, `mk1_d2_c`, `mk1_d3_c`, `gk1_d1_c`, `gk1_d2_c`, `bk1_d3_c`, `ek1_d1_c`, `kk1_d1_c`, `kk1_d2_c`, `kk1_d3_c` |
| `menggurui` | 11 | `wk1_d1_b`, `wk2_d2_b`, `dewi_d2_konfrontasi`, `ak2_d3_c`, `ak3_d3_c`, `slk2_d3_c`, `yk1_d2_c`, `yk2_d3_c`, `lk1_d1_c`, `lk1_d3_c`, `ek1_d2_c` |
| `menakut_nakuti` | 14 | `wk1_d4_b`, `sk1_d1_b`, `sk1_d4_b`, `sk2_d1_b`, `sk2_d3_b`, `kk1_d1_b`, `musa_d3_konfrontasi`, `ak1_d3_c`, `slk1_d1_b`, `yk1_d1_c`, `yk2_d1_c`, `lk1_d2_c`, `bk1_d1_c`, `bk1_d2_c` |
| `memaksa` | 9 | `wk2_d3_b`, `sk2_d2_b`, `kk1_d4_b`, `musa_k2_d3_konfrontasi`, `ak2_d1_c`, `slk1_d3_b`, `prk1_d3_c`, `gk1_d3_c`, `ek1_d3_c` |

Total: 48 + 11 + 14 + 9 = **82**, sama persis dengan inventaris runtime.

Taksonomi literal 10 kategori Permenkes tidak direkomendasikan sebagai enum UI:
beberapa kategori tumpang tindih, banyak hanya muncul sedikit, dan pemain akan
menerima terlalu banyak label. Empat payung di atas tetap dapat ditautkan ke daftar
resmi pada debrief/sitasi.

## 8. Dampak kode jika disetujui

File utama yang diperkirakan tersentuh:

- `src/content/types.ts`: `BabakIngatkan`, penerimaan awal, taksonomi gaya.
- `src/engine/state.ts`: fase `ingatkan`, pilihan tersimpan, `hasilAkhir`.
- `src/engine/actions.ts`: aksi pilih Ingatkan dan respons penerimaan awal.
- `src/engine/kunjungan.ts`: state transition, helper gaya buruk, dua jenis hasil.
- `src/engine/reducer.ts`: tally komunikasi, janji ulang, karma netral sekali.
- `src/engine/save.ts`: derivasi `hasilAkhir` pada save lama.
- `src/engine/scoring.ts`: baca kualitas komunikasi dengan nama yang jujur.
- `src/renderer/src/screens/Kunjungan.tsx`: babak I dan penerimaan awal.
- `PetaDesa.tsx`, `MejaKerja.tsx`, debrief: label enam hasil.
- 6 file `src/content/keluarga/desaA-F.ts`: reklasifikasi 82 pilihan dan konten pilot.
- `src/engine/verifikasi.ts`: `REVISI_ENGINE 42`.
- `src/engine/freeze.test.ts`: hash dihitung paling akhir.

Karena `sidikJariPack` meng-hash `arc` keluarga secara wholesale, perubahan konten
ini pasti mengubah fingerprint. Aktivasi pilot juga wajib menaikkan
`CONTENT_RELEASE`; bump engine saja tidak cukup.

## 9. Gerbang implementasi

Jika rekomendasi disetujui, urutan aman:

1. Kunci keputusan ini di decision log.
2. Tambahkan tipe, validator konten, dan negative tests.
3. Tambahkan konten pilot 5 Ingatkan + 2 penerimaan awal.
4. Implementasi engine dan migrasi save.
5. Implementasi UI, keyboard, screen-reader labels, responsif, dan mode gelap.
6. Bump `CONTENT_RELEASE` serta manifest mode-policy; penerimaan awal Career-only.
7. Bump `REVISI_ENGINE 41 -> 42` dengan komentar lengkap.
8. Jalankan full suite, typecheck, build, replay lama, dan soak teliti/ceroboh.
9. Hitung serta tempel hash freeze **paling akhir**.
10. Playtest pilot sebelum memperluas Ingatkan ke 27/27 dan penerimaan ke 16/16.

### Acceptance criteria minimum

- Skenario tanpa `pilihanIngatkan` menghasilkan state, skor, dan replay yang sama.
- Tepat satu pilihan Ingatkan benar; posisi diacak deterministik.
- MI 1/3 + Ingatkan benar tetap tidak lolos gerbang MI.
- MI 2/4 + Ingatkan salah tetap lolos gerbang MI, tetapi skor komunikasi turun.
- `ditolak_total`/`diterima_terpaksa` tidak menyentuh indikator, TTM, arc, MI,
  apathy, atau denominator keberhasilan.
- Penolakan yang dihormati tidak menjadi `diusir` dan tidak mempercepat karma.
- Memaksa keluarga yang menolak menghasilkan `diusir`.
- Kontak awal sah hanya terjadi sekali dan tidak muncul di mode Ujian.
- Semua 82 pilihan lama tidak lagi menggunakan literal `konfrontasi`.
- Helper righting-reflex mengenali tepat empat subtipe baru.
- Save lama tanpa `hasilAkhir` termigrasi deterministik.
- Enam hasil mendapat label visual/aksesibilitas yang berbeda dan tidak hanya
  bergantung warna.

## 10. Form keputusan

Rekomendasi paket tunggal:

- [x] **SETUJU REKOMENDASI E-2**: D1 Opsi B, D2 model enam hasil + penutupan
  kontak awal, D3 pilot 5+2, D4 empat subtipe primer.
- [ ] **PERLU EDIT**: tuliskan bagian/angka/scope yang diubah.
- [ ] **TOLAK**: E-2 tidak dilanjutkan.
- [ ] **NANTI**: simpan proposal tanpa unfreeze.

Catatan keputusan:

```text
Disetujui oleh dr. Anak Agung Bagus Wirayuda melalui instruksi
"Setuju rekomendasi E-2" pada 2026-07-17.
```

## 11. Hasil implementasi

- Babak Ingatkan aktif pada 5 skenario pilot; kualitas SAJI memakai bobot
  80% MI + 20% Ingatkan, sedangkan gerbang keberhasilan tetap memakai MI murni.
- `ditolak_total` dan `diterima_terpaksa` aktif sebagai penutupan kontak awal
  yang sah pada 2 skenario Career; keduanya tidak menyamar sebagai `diusir`.
- 82 pilihan lama telah direklasifikasi: 48 `menghakimi`, 11 `menggurui`,
  14 `menakut_nakuti`, dan 9 `memaksa`.
- Save lama dimigrasikan deterministik; release lama tidak diteruskan lintas
  content release tanpa mekanisme arsip yang sudah berlaku.
- UI memuat stepper SAJI lima tahap, label enam hasil, debrief, keyboard/fokus,
  dan nama aksesibel. QA visual Wulan dimainkan E2E pada build produksi.
- Full suite 91 berkas / 994 test, freeze 17/17, typecheck, dan build produksi
  seluruhnya bersih.
