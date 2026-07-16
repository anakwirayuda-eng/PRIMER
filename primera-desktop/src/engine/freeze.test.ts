/**
 * FREEZE (M10.5 Q-D, Golden Master, 2026-07-12; diperluas 2026-07-13 per
 * CODEX audit temuan #10, lagi 2026-07-13 per audit CODEX pasca-GM temuan
 * #19, lagi 2026-07-13 per fix pass M10.6 §2/§3/§9/§11, dan M13-0D pada
 * 2026-07-14) — hash-lock 17
 * file yang menentukan replay/skor: reducer.ts, clinic.ts, scoring.ts,
 * director.ts, core/rng.ts, igd.ts, kader.ts, init.ts, kegiatan.ts,
 * kunjungan.ts, paketUjian.ts, verifikasi.ts, state.ts, save.ts, pispk.ts,
 * surveilans.ts, examBlueprint.ts. Ini bukan pagar regresi biasa — ia SENGAJA GAGAL bila salah
 * satu file berubah walau cuma satu karakter, termasuk perubahan yang
 * "kelihatannya aman" (refactor, komentar, rename variabel lokal).
 *
 * M10.6 fix pass (2026-07-13, REVISI_ENGINE 28→29) — 4 unfreeze SEKALIGUS,
 * semua score/replay-affecting sesuai bar yang sama ("apakah mengedit file
 * INI SENDIRI mengubah output replay?"):
 *  - clinic.ts (§2 obatSalahUmum severity + §3 konfirmasiWajib→capGrade):
 *    obatSalahUmum kini punya tier kontraindikasi/nonPrimer dgn penalti
 *    berbeda (skorTerapi berubah utk kasus ber-nonPrimer); konfirmasiWajib
 *    tak terpenuhi kini meng-cap grade huruf (bukan cuma skorPemeriksaan).
 *  - reducer.ts (§3 Dex kuasai gate + §9 igdKodeBiruTerjadi tally +
 *    §11 bed-retry pasif): Dex "kuasai" kini butuh konfirmasiWajib terpenuhi;
 *    Kode Biru ditally saat terjadi; jadwal bed-penuh (`bedRetry`) resolve
 *    sendiri tanpa re-enter PANGGIL_PASIEN/DISPOSISI.
 *  - scoring.ts (§9): `efekIgd` kini -0.5/kejadian Kode Biru, terlepas hasil
 *    akhirnya — nyaris mati tak lagi skornya identik dgn manajemen mulus.
 *  - state.ts (§9/§11): field tally baru `igdKodeBiruTerjadi` + field jadwal
 *    baru `bedRetry`/`rumahSakitId`/`bedRetryKe` + `konfirmasiTakTerpenuhi`
 *    pada PenilaianEncounter.
 *  - init.ts (§9): backfill `igdKodeBiruTerjadi: 0` di tally awal.
 *  - save.ts (§9): migrasi-lite `igdKodeBiruTerjadi` utk save versi lama +
 *    ditambahkan ke KUNCI_TALLY exhaustive-check.
 *
 * CODEX audit pasca-GM (2026-07-13, temuan #19) — commit yang MEMPERLUAS
 * freeze ke 12 file itu SENDIRI mengedit state.ts/actions.ts/save.ts sambil
 * freeze tetap hijau (dibuktikan `git show --stat` atas commit itu). Diaudit
 * satu per satu terhadap bar yang sama dipakai utk 7 file sebelumnya ("apakah
 * mengedit file INI SENDIRI mengubah output replay?"):
 *  - state.ts: LOLOS bar — `musimDariHari()` (dipanggil director.ts yg sudah
 *    dibekukan) terbukti mengubah komposisi antrian kasus lintas batas hari
 *    hujan/kemarau, murni dari perubahan di state.ts saja.
 *  - save.ts: LOLOS bar — migrasi-lite tally menentukan `klaim.tally`
 *    baseline yg diklaim dossier; terbukti bisa membalik status verifikasi
 *    jujur "tidak_dapat_diverifikasi" jadi "tidak_sah" palsu (temuan #12).
 *  - pispk.ts: LOLOS bar — formula IKS (`hitungIksKeluarga`/`klasifikasiIks`)
 *    dipakai kader.ts yg sudah dibekukan; REVISI_ENGINE historis sudah
 *    menganggap perubahan formula IKS sbg score-affecting (rev 26/27).
 *  - surveilans.ts: LOLOS bar — `kasusMenular`/`hitungCluster` dipanggil
 *    reducer.ts di jalur replay aktual.
 *  - actions.ts: TIDAK lolos bar — murni tipe TypeScript (union `Action`),
 *    nol kode runtime, dihapus compiler; logika aksi baru SELALU tinggal di
 *    reducer.ts (yg sudah dibekukan). Sengaja TIDAK ditambahkan.
 *
 * KENAPA sekeras ini: begitu semester berjalan, mahasiswa menandatangani
 * Dossier HMAC yang direplay lawan build engine SAAT ITU (verifikasi.ts).
 * Bump `REVISI_ENGINE` tak terjadwal di tengah semester membuat build lama
 * & baru berselisih sidik jari — dossier jujur bisa jatuh ke
 * "tidak_dapat_diverifikasi" tanpa peringatan. Freeze ini memaksa setiap
 * niat mengubah salah satu file di atas SADAR bahwa itu "membuka" Golden
 * Master, bukan tambal-sulam santai.
 *
 * CODEX audit (2026-07-12, temuan #10) — DUA celah pada versi 5-file awal:
 *  (a) Cakupan kurang: igd.ts/kader.ts/init.ts/kegiatan.ts/kunjungan.ts/
 *      paketUjian.ts/verifikasi.ts semuanya score/replay-affecting (masing-
 *      masing dibuktikan via reproduksi langsung — mis. mengubah
 *      AMBANG_STABIL_RUJUK di igd.ts atau seed di paketUjian.ts tetap
 *      LOLOS freeze lama) tapi tak ikut dikunci.
 *  (b) CRLF vs LF: working tree Windows (`core.autocrlf=true`, tanpa
 *      `.gitattributes`) menyimpan file sbg CRLF, tapi git blob & CI
 *      ubuntu-latest menyimpan/membaca LF — hash CRLF-lokal != hash LF-CI,
 *      jadi freeze GAGAL PALSU begitu commit menyentuh CI Linux. Ditambal
 *      dua lapis: `.gitattributes` (`* text=auto eol=lf`, memaksa blob git
 *      selalu LF) DAN `hashFile()` di bawah menormalkan CRLF→LF sebelum
 *      hash (defense-in-depth — freeze tetap benar walau `.gitattributes`
 *      entah bagaimana tak aktif, mis. clone lama sebelum file ini ada).
 *
 * CARA UNFREEZE (sengaja manual, bukan `--update-snapshot`):
 *   1. Ubah file yang perlu diubah.
 *   2. Bump `REVISI_ENGINE` (verifikasi.ts) dan selesaikan migrasi/test terkait.
 *   3. Jalankan skrip di bawah komentar ini (cara cepat: jalankan file test
 *      ini, baca pesan error yang menyertakan hash BARU, salin ke
 *      `HASH_DIBEKUKAN`).
 *   4. Dokumentasikan alasan unfreeze di commit message + memori proyek.
 * Freeze TIDAK dimaksudkan mencegah perubahan selamanya — ia memaksa
 * perubahan lewat langkah sadar di atas, bukan lolos diam-diam.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'

function hashFile(relPath: string): string {
  const isiMentah = readFileSync(resolve(__dirname, relPath), 'utf8')
  // CODEX audit (2026-07-12, temuan #10): normalisasi CRLF→LF sebelum hash —
  // defense-in-depth di samping `.gitattributes`, supaya hash tetap identik
  // lintas working-tree Windows (CRLF) dan git blob/CI Linux (LF) apa pun
  // penyebabnya (autocrlf, clone lama sebelum .gitattributes ada, dst).
  const isi = isiMentah.replace(/\r\n/g, '\n')
  return createHash('sha256').update(isi).digest('hex')
}

/** Sha-256 hex per file (isi dinormalisasi LF), dikunci saat tag Golden Master. */
const HASH_DIBEKUKAN: Record<string, string> = {
  // REVISI 35 (2026-07-15 - M13-1a): pilot Career-only menambah usia
  // bulan, bundel stabilisasi, tindakan berbahaya, dan routing RS berbasis
  // kapabilitas. Ujian tetap terisolasi oleh modePolicy.
  // Unfreeze 2026-07-16 KETIGA (audit CODEX UKM item desain, REVISI_ENGINE 38):
  // outcome-window PIS-PK (janji→verifikasi), ekonomi IKS reframe (posyandu
  // verifikasi KIA + program perisai drift), kader isi bertahap, ambang KLB
  // ground Permenkes 1/2026 — state/kader/kunjungan/reducer/surveilans.
  // Unfreeze 2026-07-16 KEDUA (audit CODEX UKM, REVISI_ENGINE 37): arc
  // kunjungan mode-aware, program per-RW, drift ex-kunjungan, GDP Prolanis,
  // catatanPedagogis debrief — reducer/kunjungan/state/kegiatan/scoring.
  // Unfreeze 2026-07-16 (audit CODEX #1/#2/#4): gerbang terapiKritis (terapi
  // penyelamat nyawa) + Dex "kuasai" kini menuntut keselamatan resep + terapi
  // kritis + konsekuensi hanya untuk obat kontraindikasi (bukan nonPrimer).
  // Lihat REVISI_ENGINE bump di verifikasi.ts.
  // Unfreeze 2026-07-16 KELIMA (audit CODEX pasca-Batch4, REVISI_ENGINE 39→40):
  // kontradiksi ambang Prolanis DM ditutup — kartuProlanis (kegiatan.ts) &
  // rasioProlanisTerkontrol (scoring.ts) masih memakai ambang GDS lama <200
  // setelah skala DM pindah ke GDP <130 di rev 37, sehingga kartu/skor bilang
  // "terkendali" untuk peserta yang justru diperlakukan memburuk oleh drift.
  // Ketiganya kini memanggil `prolanisTerkendali()` — satu konstanta bersama.
  // Unfreeze 2026-07-16 KEEMPAT (M13 Batch 4+6, REVISI_ENGINE 38→39): sumber
  // ambang kluster pindah dari AMBANG_CLUSTER hardcoded ke KasusKlinis.ambangKluster
  // (surveilans.ts kontrak fungsi berubah; reducer.ts/director.ts call-site).
  // 14 kasus infeksi lab kini bisa berkluster → komposisi KLB & bobot Director
  // bergeser pada jejak yang menyentuhnya. Kanal IGD baca activationStatus
  // (blueprint) — tak menyentuh file beku. Detail di verifikasi.ts REVISI 39.
  'reducer.ts': 'f03d9a4f43607987207119b0299dd14a2aefb2dbb7ff2881a4b9c97fa8a63b67',
  'clinic.ts': '9dbdd1492bf4c76bd628f04b0affd8c974cb28dd7352fdce3abdf2952f212592',
  'scoring.ts': 'c1b5de6fc2c194e8b8a70b8d802a29980002ee2059ea487821e9e59fc0540d8d',
  'director.ts': 'fa4c269cd001eb2e019f18507ac5e024ff38784bb6181cfa41cb5f87cd1a340d',
  'core/rng.ts': '3a60dde2ff1fd06262549623f0a1ed92447102dc7d55df988c100ba89afcb4e1',
  'igd.ts': 'fe0b4bcbeb07fe7fca564614597cca6a65730d2f844c4a99337201924f2767da',
  'kader.ts': '43e227f54f8f586ce7bfa324cc7e33591a6210590423412384e4fb25bc6df207',
  'init.ts': '19b2d372c730406a14ac96afc3497fc8e8f418b0694271a5bff1df41ad778afb',
  'kegiatan.ts': 'c2f0bddb9d8e1b3a3a4f60cd04c79be9d6d447c6db58c147f873f67e6d6d6b06',
  'kunjungan.ts': 'b7288526abd342b909b94905c6040907d5c78854a5d2545f0a0c829362321eb2',
  'paketUjian.ts': 'aaa854b409b12f52c0f588401de10a6a00e03f3c3e80582015968f3a64afcf38',
  // Unfreeze 2026-07-16 (audit CODEX #1/#2/#4): REVISI_ENGINE di-bump untuk
  // gerbang terapiKritis + Dex "kuasai" ketat + konsekuensi hanya-kontraindikasi.
  'verifikasi.ts': '94dac8877b553c73227cdd0d5b8ea2045b052af6e3c43ab2dd09fa29e82ddb74',
  'state.ts': '3224553d62b71b27924c63749b6253ca5a240d05f7bcaccac9ab195c9b32a4b6',
  'save.ts': '8c75672d5ff27efa243ce2f87d3ad92ff22c5c851f010566e1c4090b43449c8a',
  'pispk.ts': '052b8a14590c8dd42eac2269e18ee02b0e38cb6ba6f6259b77f6a667b37b0784',
  'surveilans.ts': '7ee33537f9a2d982f6ac82590e50e77046e82bfffe73e7127a656f18d41ecc36',
  'examBlueprint.ts': 'b25f942d9f642244ee1b42d058b7c262de8a88f8c155661c254e0795834d2b9a',
}

describe('GOLDEN MASTER FREEZE (M10.5 Q-D) — 17 file penentu replay/skor terkunci', () => {
  for (const [file, hashDiharapkan] of Object.entries(HASH_DIBEKUKAN)) {
    it(`${file} tak berubah sejak freeze`, () => {
      const hashSekarang = hashFile(file)
      expect(
        hashSekarang,
        `${file} BERUBAH sejak Golden Master freeze (2026-07-12). Bila ini disengaja: ` +
          `bump REVISI_ENGINE (verifikasi.ts), perbarui HASH_DIBEKUKAN['${file}'] ke ` +
          `'${hashSekarang}', dan dokumentasikan alasan unfreeze-nya.`,
      ).toBe(hashDiharapkan)
    })
  }
})
