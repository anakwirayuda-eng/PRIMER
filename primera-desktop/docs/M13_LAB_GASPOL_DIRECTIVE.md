# DIREKTIF LAB GAS-POL — FULL-FLEDGE ±225 KASUS (2026-07-16)

**Dari**: dr. Anak Agung Bagus Wirayuda (keputusan langsung user; dioperasionalkan oleh Claude)
**Untuk**: CODEX (builder penuh di lab clone `D:\Dev\PRIMER-CODEX-lab`)
**Status**: MENGGANTIKAN struktur milestone M13-1b → M13-5 di `M13_KICKOFF_PROMPT.md`
**KHUSUS untuk lab clone ini.** Decision Lock 1–5 tetap berlaku sebagai prinsip
authoring, tetapi SELURUH gerbang blocking-nya (physician sign-off per kasus,
playtest gate, review envelope) dipindah ke repo produksi (`D:\Dev\PRIMER`).

## 1. Pernyataan misi (kata user sendiri, verbatim)

> "ini kan sebenernya lab saya bangun justru utk menguji seandainya game ini
> full fledge, kayak apakah jadinya, sehingga kamu dan saya sama2 tau. Lah
> sekarang malah jadi kayak poco2 dan lambat sekali. Belum berdiri dengan
> 200 an lebih kasus... berarti dari kemarin hanya brainstorm dan tulis2 aja,
> ga ada efek ke gameplay yg diperbaharui... Utk gerbang testing2 dll kita
> coba di main folder development aja, lab ini untuk supaya SAYA TAU feel dan
> grasp nya sebagai pembelajaran saya sehingga saya develop berikutnya lebih
> bagus."

Terjemahan operasional: lab ini **BUKAN repo produksi mini** dengan seluruh
seremoni governance-nya. Lab ini = **prototipe skala penuh**. Ukuran
keberhasilan satu-satunya: **user bisa menginstal dan MEMAINKAN game dengan
±225 kasus, secepat mungkin.** Setiap jam yang dihabiskan menulis dokumen
perencanaan/review alih-alih konten playable adalah kegagalan terhadap misi
ini. Berhenti menunggu; mulai memproduksi.

## 2. Target akhir

| Komponen | Jumlah | Checklist |
|---|---|---|
| Kasus poli SKDI-4A | 144 | katalog `fktp144-1186-2022` (M13-0A); gap saat ini ±99 |
| Kasus wajib-rujuk (3A/3B/2) | ±60 | katalog klinis M13-0A + porting repo lama |
| Kasus IGD | ±20 | pool IGD saat ini + porting repo lama |
| **Total aktif di mode Karier** | **±225** | |

## 3. Yang DIHENTIKAN di lab (pindah ke repo produksi, bukan dihapus dari dunia)

1. **Physician sign-off per kasus.** TIDAK ADA record `physicianSignoff` baru
   di lab. Dan sebaliknya juga mutlak: **JANGAN PERNAH memfabrikasi record
   sign-off** — kalau tidak ada gerbangnya, tidak ada recordnya, titik.
2. Review packet per kasus, review envelope + hash SHA-256 per kasus,
   EvidenceBinding per-facet per kasus baru. (Yang sudah ada utk 8 kasus
   M13-1a dibiarkan; jangan diperluas.)
3. Gerbang playtest manusia (M13-1b) sebagai blocker antar-batch. User akan
   main kapan pun beliau mau — build harus selalu siap, tapi tidak menunggu.
4. Ping-pong verifikasi per-milestone dengan Claude. Verifikasi terjadi
   per-batch, cepat, dan perbaikan kontradiksi dilakukan LANGSUNG.

## 4. Yang TETAP berlaku (lantai kualitas minimum)

Ini bukan seremoni — ini yang mencegah prototipe jadi sampah yang tak bisa
dimainkan (yang justru menggagalkan tujuan "merasakan full-fledge"):

1. **Build hijau setiap batch**: `validasiPack` 0 masalah, `tsc --noEmit`
   bersih, full test suite lulus. Softlock/crash = bug misi-kritis, prioritas
   di atas konten baru.
2. **Grounding klinis best-effort, tanpa blocking**: PPK 1186/2022
   (+amandemen 1936/2022) / PNPK terkini / Fornas 1199/2025, prinsip
   floor + graceful degradation seperti biasa; kutip sumber singkat di
   `panduanResmi`. **TAPI**: konflik material yang dulu memblokir aktivasi →
   sekarang **pilih opsi paling aman yang defensible, catat SATU BARIS di
   ledger, lanjut jalan.** Ledger: `docs/M13_LAB_DECISION_LEDGER.md`
   (format: `kasusId | konflik | opsi dipilih | alasan 1 kalimat | sumber`).
   Ledger ini nanti jadi daftar kerja adjudikasi di repo produksi.
3. **Kejujuran status**: seluruh konten batch lab diberi satu status murah,
   mis. `activationStatus: 'lab_prototype_unadjudicated'`. Konten lab TIDAK
   boleh diklaim "reviewed/approved" di manapun. Saat porting ke produksi,
   SEMUA konten lab melewati gerbang asli dari nol.
4. **Engine integrity tetap utuh**: allergy firewall, dangerous-action
   scoring, determinisme seed, mode isolation. Ini identitas game-nya —
   tanpa ini yang dirasakan user bukan "game full-fledge" tapi game lain.
5. **modePolicy karier-only** untuk semua konten baru. Pool Ujian + exam
   blueprint M13-0D tidak disentuh sama sekali (opsional dibahas SETELAH
   225 tercapai, sebagai satu keputusan terpisah).

## 5. Cara kerja gas-pol

- **Reuse repo lama secara agresif.** `D:\Dev\PRIMER` commit `6aa7436`
  memuat 255 kasus rawat jalan + 34 IGD. Keputusan shell-factory sudah
  terkunci lama: narasi/persona/struktur boleh diambil sebagai draf; fakta
  klinis (answer key: `tatalaksana`, `icd10`, `harusDirujuk`, dosis,
  `alergiTrap`) dibangun ulang dari sumber. **Pakai ini.** Mengarang 225
  kasus dari halaman kosong adalah cara paling lambat yang mungkin.
- **Batch besar per kluster sistem**: 20–40 kasus per batch (respirasi, GI,
  kulit, mata-THT, muskuloskeletal, neuro-jiwa, KIA, infeksi tropis, dst).
  Alur per batch: author → aktifkan ke `PACK` → test hijau → build → lapor.
  Jangan menyisakan batch "setengah aktif".
- **Playable build per batch**: akhiri setiap batch dengan `npm run dist`
  (installer NSIS penuh, bukan hanya `--dir`). User harus bisa memainkan
  game yang membesar di setiap batch — itulah satu-satunya alasan lab ini
  ada. Catat SHA-256 installer di laporan batch.
- **Laporan batch = satu pesan pendek**: jumlah kasus baru + kumulatif,
  kluster, test count, hash installer, baris ledger baru. Tanpa esai,
  tanpa dokumen laporan terpisah.
- **Dokumen baru yang diizinkan = ledger saja.** Dilarang membuat dokumen
  perencanaan/blueprint/review-packet/analisis baru. Seluruh energi ke
  konten + engine yang dibutuhkan konten itu.
- **Engine mengikuti konten, bukan sebaliknya**: bila sebuah kasus butuh
  mekanik kecil yang belum ada (tindakan baru, item lab baru, field kecil),
  tambahkan langsung beserta test-nya di batch yang sama. Jangan menunda
  konten demi "keputusan desain" — pilih desain paling sederhana yang
  bekerja, catat di ledger bila material.
- **Bookkeeping rilis tidak boleh memblokir batch**: cukup satu id rilis
  lab (mis. `m13-lab-fullfledge`) yang dipakai seluruh batch, atau bump
  sederhana per batch — pilih yang paling murah dan konsisten dengan
  `releasePolicyAktif`. Jangan bangun mesin rilis baru.

## 6. Definisi selesai

`PACK` memuat ±225 kasus aktif di mode Karier; installer NSIS terbaru di
`dist/`; full suite hijau; `M13_LAB_DECISION_LEDGER.md` terisi jujur; user
menginstal, memainkan game full-fledge, dan menarik pelajaran untuk siklus
pengembangan berikutnya di repo produksi. Itu saja. Tidak ada gerbang lain.
