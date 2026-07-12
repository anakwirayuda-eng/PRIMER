/**
 * FREEZE (M10.5 Q-D, Golden Master, 2026-07-12) — hash-lock lima file yang
 * menentukan replay/skor: reducer.ts, clinic.ts, scoring.ts, director.ts,
 * core/rng.ts. Ini bukan pagar regresi biasa — ia SENGAJA GAGAL bila salah
 * satu file berubah walau cuma satu karakter, termasuk perubahan yang
 * "kelihatannya aman" (refactor, komentar, rename variabel lokal).
 *
 * KENAPA sekeras ini: begitu semester berjalan, mahasiswa menandatangani
 * Dossier HMAC yang direplay lawan build engine SAAT ITU (verifikasi.ts).
 * Bump `REVISI_ENGINE` tak terjadwal di tengah semester membuat build lama
 * & baru berselisih sidik jari — dossier jujur bisa jatuh ke
 * "tidak_dapat_diverifikasi" tanpa peringatan. Freeze ini memaksa setiap
 * niat mengubah salah satu file di atas SADAR bahwa itu "membuka" Golden
 * Master, bukan tambal-sulam santai.
 *
 * CARA UNFREEZE (sengaja manual, bukan `--update-snapshot`):
 *   1. Ubah file yang perlu diubah.
 *   2. Jalankan skrip di bawah komentar ini (cara cepat: jalankan file test
 *      ini, baca pesan error yang menyertakan hash BARU, salin ke
 *      `HASH_DIBEKUKAN`).
 *   3. Bump `REVISI_ENGINE` (verifikasi.ts) — perubahan salah satu 5 file
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
  const isi = readFileSync(resolve(__dirname, relPath), 'utf8')
  return createHash('sha256').update(isi).digest('hex')
}

/** Sha-256 hex per file, dikunci saat tag Golden Master (2026-07-12). */
const HASH_DIBEKUKAN: Record<string, string> = {
  'reducer.ts': '0a65af80d9b8195bbb1a611977e3d409f5d674aba6299ef4f10acc5f6eb94d3c',
  'clinic.ts': 'a748763de84332d9ed3ca66e7cf675b281a55294354054d56b1e96c3863ce94a',
  'scoring.ts': 'b4e14455d765d90f47d3c189ce4eb61e0211bd5d8939d70f17f93ac68acdd6eb',
  'director.ts': '04292d71927280eba01a6c1e8467bea8f72eeead96684980102cf4dbd24ce5ed',
  'core/rng.ts': '3a60dde2ff1fd06262549623f0a1ed92447102dc7d55df988c100ba89afcb4e1',
}

describe('GOLDEN MASTER FREEZE (M10.5 Q-D) — 5 file penentu replay/skor terkunci', () => {
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
