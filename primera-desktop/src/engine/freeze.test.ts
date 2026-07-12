/**
 * FREEZE (M10.5 Q-D, Golden Master, 2026-07-12; diperluas 2026-07-13 per
 * CODEX audit temuan #10) — hash-lock 12 file yang menentukan replay/skor:
 * reducer.ts, clinic.ts, scoring.ts, director.ts, core/rng.ts, igd.ts,
 * kader.ts, init.ts, kegiatan.ts, kunjungan.ts, paketUjian.ts, verifikasi.ts.
 * Ini bukan pagar regresi biasa — ia SENGAJA GAGAL bila salah satu file
 * berubah walau cuma satu karakter, termasuk perubahan yang "kelihatannya
 * aman" (refactor, komentar, rename variabel lokal).
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
 *   2. Jalankan skrip di bawah komentar ini (cara cepat: jalankan file test
 *      ini, baca pesan error yang menyertakan hash BARU, salin ke
 *      `HASH_DIBEKUKAN`).
 *   3. Bump `REVISI_ENGINE` (verifikasi.ts) — perubahan salah satu file
 *      ini HAMPIR PASTI score/replay-affecting.
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
  'reducer.ts': '60cac9935b2c4ca65da53c70bb0298436bf114cd8996a3580188c09ebf2f317e',
  'clinic.ts': '5a67e6dd6a4e73af83b6f9cf7e6638ea652844c4e78b2fccc9858787fb373606',
  'scoring.ts': '87c04591b554c62cce71afae0ff7f4fe0f8c73fdbf220d780244ccec9f11e0b8',
  'director.ts': '400f168a3ecb381113fe252ef1d81c1c62d81edb3aca0e3141d124fb213d1812',
  'core/rng.ts': '3a60dde2ff1fd06262549623f0a1ed92447102dc7d55df988c100ba89afcb4e1',
  'igd.ts': '519b7cfc4098fa2e4d6c0567875ba797d3074d14cbbe8b9a48afaf12704c09b4',
  'kader.ts': 'fff1c7c055d1526f1e9632e64a3f72939840412c0f148e201444d6a7353aa646',
  'init.ts': 'ce06d32aced0adeffb38672199738080448c98fedd613165d424c3de016f02ca',
  'kegiatan.ts': '61004bed15e5f8095214205aff69da6be55556d329552bc6a691cc0e4bf62d52',
  'kunjungan.ts': '4ec29cba2af05c8befec99921fe0cf8fc4d93950546c08121ded7f82efa66517',
  'paketUjian.ts': 'b7127ca427c24fea81a840f51d1933aa5eb4025384fdfac9857fa3498aa59e5d',
  'verifikasi.ts': '4f0b1c29f1182a62eb6f9a9109f1562604ab708c1bb1a573ccfe96693d518f97',
}

describe('GOLDEN MASTER FREEZE (M10.5 Q-D) — 12 file penentu replay/skor terkunci', () => {
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
