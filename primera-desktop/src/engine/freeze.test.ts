/**
 * FREEZE (M10.5 Q-D, Golden Master, 2026-07-12; diperluas 2026-07-13 per
 * CODEX audit temuan #10, lagi 2026-07-13 per audit CODEX pasca-GM temuan
 * #19, dan lagi 2026-07-13 per fix pass M10.6 §2/§3/§9/§11) — hash-lock 16
 * file yang menentukan replay/skor: reducer.ts, clinic.ts, scoring.ts,
 * director.ts, core/rng.ts, igd.ts, kader.ts, init.ts, kegiatan.ts,
 * kunjungan.ts, paketUjian.ts, verifikasi.ts, state.ts, save.ts, pispk.ts,
 * surveilans.ts. Ini bukan pagar regresi biasa — ia SENGAJA GAGAL bila salah
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
  // REVISI 33 (2026-07-14 — M13-0C): identitas content release masuk
  // save+dossier, runtime policy mengisolasi mode/release, IGD disortir,
  // dan tie-break karma menjadi eksplisit.
  'reducer.ts': '556950e90db303d0960aafb0eb97da2936bfab93bd1e45d73ddef322bb231df3',
  'clinic.ts': '55de3a23bb8c1024901848ba5f61c89590e9a0bcf526c32f7446f2d008aab3d2',
  'scoring.ts': '146c3012075cad2e0fad60e2139f7efe04aeb8bea84ac5a1ffdafb676cc2e1d8',
  'director.ts': '01155a5250b7236872b79e510a992bdfb90b508c200a01b4c947630ace5a6361',
  'core/rng.ts': '3a60dde2ff1fd06262549623f0a1ed92447102dc7d55df988c100ba89afcb4e1',
  'igd.ts': '519b7cfc4098fa2e4d6c0567875ba797d3074d14cbbe8b9a48afaf12704c09b4',
  'kader.ts': 'fff1c7c055d1526f1e9632e64a3f72939840412c0f148e201444d6a7353aa646',
  'init.ts': 'c3dad6275c8dfeca7627e49caa9de396134a7ef2b45a7c76cc0c53f82e299835',
  'kegiatan.ts': '61004bed15e5f8095214205aff69da6be55556d329552bc6a691cc0e4bf62d52',
  'kunjungan.ts': '4ec29cba2af05c8befec99921fe0cf8fc4d93950546c08121ded7f82efa66517',
  'paketUjian.ts': 'b7127ca427c24fea81a840f51d1933aa5eb4025384fdfac9857fa3498aa59e5d',
  'verifikasi.ts': 'f4326d00fa4667603a6c1e3b1de073dc052b546128b0e2ce2c9a7e4458444260',
  'state.ts': '1b8ddce19ff60346ffa377788fc59422f4d8d48f89e3282feac522589fa7681e',
  'save.ts': '7ad199a80dfa85bcf7b2f6fa7d15ff231edcf174e63fb1232576b54d5092070c',
  'pispk.ts': '052b8a14590c8dd42eac2269e18ee02b0e38cb6ba6f6259b77f6a667b37b0784',
  'surveilans.ts': '34bdfd80c9ebd2ae5a261118e9154cdfeb670b06b029e96013e2b26ef9a86a80',
}

describe('GOLDEN MASTER FREEZE (M10.5 Q-D) — 16 file penentu replay/skor terkunci', () => {
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
