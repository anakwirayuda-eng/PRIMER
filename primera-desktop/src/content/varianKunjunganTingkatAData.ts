/**
 * DATA VARIAN KUNJUNGAN TINGKAT-A (M11 #5 B1) — file GENERATED.
 *
 * Diisi dari pipeline draf->verifikasi-adversarial (workflow
 * `m11-varian-kunjungan-tingkat-a`) lalu ditulis deterministik dari JSON
 * hasil verifikasi oleh skrip — jangan edit manual kecuali koreksi klinis/
 * naratif yang diadjudikasi. Ringkasan per varian:
 * docs/M11_VARIAN_KUNJUNGAN_TINGKAT_A_HASIL.md.
 *
 * Kunci = id skenario kunjungan (unik lintas 16 keluarga, diverifikasi
 * pack.test.ts). Diterapkan ke katalog oleh
 * `terapkanVarianKunjunganTingkatA()` (varianKunjunganTingkatA.ts) saat
 * PACK dirakit; integritas isi dijaga `validasiPack` (pack.ts).
 */
import type { VarianKunjunganTingkatA } from './types'

export const VARIAN_KUNJUNGAN_TINGKAT_A: Record<string, VarianKunjunganTingkatA[]> = {}
