# M11 Item #4 — Variasi Presentasi Penyakit-Sama: Draf Desain

> Status: **Tingkat A — MEKANIK ENGINE SELESAI & TERUJI (2026-07-16,
> REVISI_ENGINE 41).** Ditulis awalnya sebagai draf untuk adjudikasi
> ("#4 variasi presentasi ini maksudnya apa?"), disetujui dr. Wirayuda
> ("yes coba" → draf ini; "yes mulai Tingkat A saja dulu" → implementasi).
> Plumbing engine (`types.ts`/`state.ts`/`director.ts`/`clinic.ts`/
> `reducer.ts` + 3 titik renderer + guard `validasiPack`) sudah dibangun,
> diuji merah→hijau, dan lolos suite penuh + typecheck + freeze re-hash.
> **Konten (varian aktual per kasus) BELUM ditulis** — lihat §9 untuk
> status rinci dan koreksi §4 soal RNG. Lihat juga
> `[[project_primer_m11_ebm_nuance]]` di memori sesi.

## 1. Masalah yang ingin diselesaikan

Saat ini satu `KasusKlinis` = satu presentasi klinis TETAP. `dengue_df`
selalu `vital: { td: '110/70', nadi: 98, rr: 20, suhu: 39.4 }`, tiap kali
kasus itu muncul di antrian — Hari 12, Hari 47, siapa pun mahasiswanya.
Yang berubah cuma bungkus (nama pasien, usia dalam rentang, persona,
RW). Fakta klinisnya beku.

Efek pedagogis: pada replay 90-hari (Karier) atau lintas-mahasiswa (Ujian
paket sama), penyakit prevalensi tinggi (ISPA, hipertensi, dengue) ketarik
berkali-kali — begitu satu angka dihafal, encounter berikutnya jadi
klik-otomatis, bukan penalaran ulang dari data.

## 2. Dua tingkat variasi — beda biaya, beda nilai ajar

### Tingkat A — Kosmetik (murah, TIDAK mengubah kunci jawaban)

Varian mengganti angka vital/detail keluhan/temuan fisik dalam rentang
yang secara klinis **tetap berujung disposisi & tatalaksana yang SAMA**.
Tujuannya semata mematahkan hafalan-angka, bukan menambah keputusan baru.

Murni penulisan konten — tak ada keputusan klinis baru yang perlu
diadjudikasi per varian selain "apakah rentang ini masih wajar untuk
diagnosis yang sama", yang biasanya jelas.

### Tingkat B — Bercabang (mahal, MENGUBAH kunci jawaban)

Varian menggeser fase/keparahan penyakit sehingga disposisi/tatalaksana/
konsekuensi ikut berbeda (mis. dengue tanpa tanda bahaya vs dengue fase
kritis). Ini secara efektif kasus baru yang menumpang id yang sama —
butuh adjudikasi klinis eksplisit PER VARIAN, sama beratnya dengan
menulis kasus baru dari nol.

**Rekomendasi**: mulai dari Tingkat A saja dulu. Tingkat B ditunda sampai
Tingkat A terbukti nilainya di playtest, dan tetap kasus-per-kasus atas
persetujuan Anda — bukan aturan umum.

## 3. Skema konten yang diusulkan (Tingkat A)

Field baru **opsional** di `KasusKlinis` — kasus yang tak diisi berperilaku
identik seperti sekarang (kompatibel mundur, tak ada migrasi save):

```ts
/**
 * Varian presentasi Tingkat-A: mengubah angka/detail permukaan, TIDAK
 * pernah mengubah harusDirujuk/tatalaksana/konsekuensi/diagnosisBanding.
 * Kasus dasar (field vital/keluhanUtama/dst di level atas) tetap jadi
 * varian ke-0 secara implisit — array ini HANYA varian TAMBAHAN.
 */
varianPresentasi?: {
  id: string
  /** Override vital — HANYA field yang disebut yang berubah. */
  vital?: Partial<TandaVital>
  keluhanUtama?: string
  /** id pertanyaan anamnesis -> jawaban pengganti (id harus sudah ada di anamnesis dasar). */
  jawabanBerubah?: Record<string, string>
  /** region -> temuan pengganti (region harus sudah ada di pemeriksaanFisik dasar). */
  temuanBerubah?: Record<RegionFisik, string>
}[]
```

Aturan keras yang wajib dijaga `validasiPack`:
- `jawabanBerubah`/`temuanBerubah` cuma boleh mengganti id/region yang
  SUDAH ADA di kasus dasar — tak boleh menambah pertanyaan/region baru
  (itu masuk lingkup kasus, bukan varian).
- Tak ada field `harusDirujuk`/`tatalaksana`/`konsekuensi`/`diagnosisBanding`
  di tipe ini SAMA SEKALI — secara struktural mustahil varian Tingkat-A
  mengubah kunci jawaban, bukan sekadar konvensi yang bisa dilanggar.

## 4. Mekanik pemilihan (director.ts)

Pola yang **sudah ada** di codebase untuk masalah yang persis sama
(keadilan lintas-mahasiswa paket Ujian) dipakai ulang, bukan mekanik baru:

```ts
// buatPasienDariKasus, setelah kasus ditemukan:
const varian = kasus.varianPresentasi?.length
  ? rng.pick([{ id: '_dasar' }, ...kasus.varianPresentasi])  // '_dasar' = presentasi asli
  : undefined
```

**Poin krusial soal RNG**: harus dipanggil dengan `Rng` yang sama yang
sudah dipakai memilih KASUS itu sendiri (turunan `seedKurikulum`, bukan
`state.seed` pribadi mahasiswa) — persis pola yang sudah dipakai
`igd`/`posyandu`. Alasannya: Mode Ujian menuntut "bobot kasus identik per
paket" (`M45_MODE_UJIAN.md` §3b). Kalau varian dipilih dari seed pribadi,
dua mahasiswa paket sama bisa dapat presentasi dengue yang beda persis di
hari yang sama — melanggar kontrak itu. Dengan `seedKurikulum`, SEMUA
mahasiswa satu paket dapat varian yang sama; variasi tetap ada, tapi
lintas-hari/lintas-paket, bukan lintas-mahasiswa-paket-sama.

## 5. Dampak REVISI_ENGINE

`buatPasienDariKasus` ada di `director.ts` — salah satu file yang sudah
dibekukan Golden Master. Mengedit fungsi ini SELALU lolos bar unfreeze
("apakah mengedit file ini sendiri mengubah replay?") — ya, dipanggil di
setiap pembuatan pasien. Bump wajib, terlepas apakah kasus manapun sudah
diisi `varianPresentasi` — sama seperti pola unfreeze-preventif M13 Batch
6 kemarin (nol kasus terpakai belum tentu berarti nol perubahan replay).

## 6. Tiga contoh konkret (angka diambil PERSIS dari file saat ini)

### 6a. `dengue_df` — Tingkat A murni

Dasar (`src/content/kasus/kasusInfeksi.ts`):
```
vital: { td: '110/70', nadi: 98, rr: 20, suhu: 39.4 }
```

Varian usulan (dua tambahan, dasar tetap jadi varian ke-0):
- **`bifasik`**: `suhu: 38.6, nadi: 88` — demam pelana kuda (turun lalu
  naik lagi), lebih mendekati pola klasik yang justru sering membingungkan
  mahasiswa ("kok sudah turun tapi belum sembuh?").
- **`petekie_awal`**: `suhu: 38.9, nadi: 102` — ruam petekie sudah tampak
  tapi trombosit *masih* dalam rentang aman (bukan tanda bahaya) — melatih
  mahasiswa tak panik lihat ruam bila indikator bahaya lain negatif.

Ketiganya (dasar + 2 varian): `harusDirujuk: false`, tatalaksana
paracetamol + hidrasi oral + edukasi tanda bahaya — **identik**. Yang
berubah murni vignette & angka permukaan.

### 6b. `hipertensi_esensial` — Tingkat A murni

Dasar (`src/content/kasus/kasusKronis.ts`):
```
vital: { td: '160/95', nadi: 80, rr: 18, suhu: 36.7 }
keluhanUtama: 'Tengkuk saya terasa berat dan sering pusing, Dok, sudah beberapa hari ini.'
```

Varian usulan:
- **`asimtomatik`**: `td: '170/100'` (TD lebih tinggi tapi TANPA gejala
  tengkuk berat) + `keluhanUtama` diganti jadi kontrol rutin biasa —
  mengajar bahwa hipertensi sering tanpa gejala (poin EBM klasik), dan
  angka TD tinggi TIDAK otomatis berarti "krisis" tanpa gejala target-organ.
- **`gejala_ringan`**: `td: '150/92'` dengan keluhan pusing ringan saja
  (bukan tengkuk berat) — TD lebih rendah dari ambang stage-2 tapi tetap
  hipertensi yang perlu terapi, melatih mahasiswa tak menunggu TD "seram"
  untuk mulai obat.

Ketiganya: `harusDirujuk: false`, kombinasi kaptopril+amlodipine — identik.

### 6c. `ppok_eksaserbasi` — CONTOH Tingkat B (untuk ilustrasi biaya, BUKAN diusulkan dikerjakan sekarang)

Dasar (`src/content/kasus/kasusRespGi.ts`): `harusDirujuk: true`,
`bisaPrb: true` — SELALU eksaserbasi yang perlu rujuk.

Godaan alami: tambah varian "eksaserbasi ringan, manage di FKTP saja".
**Ini contoh persis kenapa Tingkat B mahal**: klaim "eksaserbasi PPOK
ringan boleh tuntas di FKTP" butuh dasar eksplisit dari GOLD/PPK
1186-1936/PNPK PPOK (kriteria keparahan mana yang memang manage-at-FKTP
vs wajib-rujuk) — SAYA TIDAK BOLEH mengarang kriteria itu dari asumsi.
Kalau Anda ingin Tingkat B untuk kasus ini, langkah pertamanya riset
literatur/pedoman dulu (pola sama M11.5 Phase B: kutipan verbatim wajib),
baru tatalaksana varian ringannya ditulis — bukan langsung ditulis dari
pengetahuan umum.

## 7. Cakupan awal yang diusulkan (bila disetujui)

Bukan seluruh ~230 kasus sekaligus. Usul: mulai dari **top-10 kasus
`prevalensi: 'tinggi'`** (yang paling sering ketarik ulang di 90 hari,
jadi paling besar manfaat anti-hafalannya), Tingkat A saja, 2 varian per
kasus. Setelah itu di-playtest dan Anda menilai nilainya, baru diputuskan
lanjut ke kasus lain atau ke Tingkat B.

## 8. Pertanyaan untuk Anda putuskan (dijawab via "yes mulai Tingkat A saja dulu")

1. ~~Setuju mulai dari Tingkat A saja...~~ **Ya** — diimplementasikan.
   Tingkat B tetap ditunda, tak disentuh sama sekali.
2. Cakupan awal (top-10/15 kasus prevalensi tinggi, 2 varian
   masing-masing) — **BELUM dieksekusi**, lihat §9. Mekanik engine dulu,
   konten menyusul.
3. Skema field di §3 — dipakai APA ADANYA, kecuali `temuanBerubah` yang
   di implementasi bertipe `Partial<Record<RegionFisik, string>>` (§3
   tertulis `Record<RegionFisik, string>` tanpa `Partial` — typo draf,
   maksudnya sama: hanya region yang disebut yang berubah). Mekanik RNG
   di §4 **dikoreksi**, lihat §9.

## 9. Status implementasi Tingkat A (2026-07-16)

### 9a. Selesai — mekanik engine

- `KasusKlinis.varianPresentasi?: VarianPresentasiTingkatA[]` (`types.ts`)
  — tipe baru tanpa satu pun field kunci-jawaban, persis §3.
- `PasienAktif.varianId?: string` (`state.ts`) — dipilih sekali saat
  pasien dibuat, bertahan seumur hidup pasien itu (antrian → ruang
  periksa → debrief).
- `kasusEfektif(kasus, varianId)` (`clinic.ts`) — fungsi merge murni,
  satu titik kanonik. Identity-return (referensi objek sama) bila
  `varianId` undefined/`'_dasar'`/tak dikenal → nol biaya untuk kasus
  tanpa varian. Diuji `clinic.test.ts` (termasuk regresi eksplisit:
  `harusDirujuk`/`tatalaksana`/`konsekuensi`/`diagnosisBanding`/`skdi`/
  `icd10`/`spesialisRujukan` WAJIB `.toBe()` sama persis — kunci jawaban
  mustahil berubah, bukan cuma "biasanya tak berubah").
- `buatPasienDariKasus` (`director.ts`) memilih `varianId` via
  `rng.pick(['_dasar', ...ids])`. Diuji `director.test.ts` (determinisme,
  distribusi 3-hasil, dan dibuktikan bukan test kosong: sempat dimatikan
  sementara, persis 2 dari 3 test varian gagal, lalu dipulihkan).
- `reducer.ts` (2 titik) + `Klinik.tsx`/`RuangTunggu.tsx`/`MejaKerja.tsx`
  (3 titik renderer) semua dipetakan lewat `kasusEfektif` — surface
  lengkap dikonfirmasi via grep semua pembaca `pack.kasus[...]` yang
  menyentuh field yang bisa divarian, bukan ditebak.
- Guard `validasiPack` (`pack.ts`) menolak: id varian `'_dasar'` terpakai,
  id varian duplikat, `jawabanBerubah`/`temuanBerubah` mengacu id/region
  yang TAK ADA di kasus dasar, dan varian kosong (tak mengubah apa pun).
  Diuji `pack.test.ts` (7 test baru, semua hijau).
- REVISI_ENGINE 40→41 (komentar lengkap di `verifikasi.ts`), 4 hash
  `freeze.test.ts` diperbarui (`reducer.ts`/`clinic.ts`/`director.ts`/
  `state.ts`) + `verifikasi.ts` sendiri (REVISI_ENGINE hidup di situ).
  Suite penuh 926/927 hijau (1 gagal = flake timeout `m13ExamBlueprint`
  pra-eksisten di beban paralel penuh, lolos bersih saat diisolasi —
  bukan regresi dari perubahan ini), `tsc --noEmit` bersih.

### 9b. Koreksi terhadap §4 — RNG stream yang dipakai BUKAN `seedKurikulum`

Draf §4 mengusulkan varian harus dipilih dari `Rng` turunan
`seedKurikulum` (stream yang sama yang memilih KASUS itu sendiri), demi
keadilan lintas-mahasiswa paket Ujian sama.

Saat implementasi, penelusuran pola RNG existing di codebase menunjukkan
ini **berlebihan**: kodebase sudah punya pembedaan eksplisit dua stream —
`rng` (turunan `seedKurikulum`, WAJIB adil lintas paket-mate Mode Ujian,
menentukan kasus APA yang muncul) vs `rngFlavor` (stream personal per-
mahasiswa, secara eksplisit didokumentasikan TIDAK wajib adil lintas
paket-mate — dipakai untuk nama/usia/persona/BPJS pasien, "wajah"-nya
bukan substansinya).

Karena Tingkat A secara struktural TAK BISA mengubah kunci jawaban (§3),
varian termasuk kategori "wajah", bukan "substansi kurikulum" — jadi
`buatPasienDariKasus` memakai ulang `rng`/`rngFlavor` yang SUDAH diteruskan
ke fungsi itu di tiap 4 titik panggilnya (`director.ts` ×2 pakai
`rngFlavor`, `init.ts` tutorial, `reducer.ts` follow-up "kembali"), TANPA
skema derivasi seed baru. Lebih sederhana dari usulan draf, dan tetap
memenuhi maksud aslinya (kasus APA yang muncul tetap 100% adil lintas
paket — hanya "wajah kosmetik"-nya yang boleh beda, dan itu memang sudah
jadi kontrak `rngFlavor` sejak awal, bukan pelanggaran baru).

### 9c. BELUM dikerjakan — fase konten

Cakupan §7 (top-10/15 kasus `prevalensi: 'tinggi'`, 2 varian per kasus)
belum ditulis. Rencana: fan-out multi-agen (Workflow) dengan verifikasi
adversarial plausibilitas klinis per varian, menyusul instruksi
"ultracode" sesi ini — BELUM dimulai per penulisan bagian ini.
