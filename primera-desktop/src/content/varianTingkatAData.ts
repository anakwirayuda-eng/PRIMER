/**
 * DATA VARIAN PRESENTASI TINGKAT-A (M11 #4) — file GENERATED.
 *
 * Diisi dari pipeline draf→verifikasi-adversarial (workflow
 * `m11-varian-tingkat-a`, 2026-07-16) lalu ditulis deterministik dari JSON
 * hasil verifikasi — jangan edit manual kecuali koreksi klinis yang
 * diadjudikasi; sumber kebenarannya dokumen keputusan M11 #4.
 *
 * Kunci = id kasus. Diterapkan ke katalog oleh `terapkanVarianTingkatA()`
 * (varianTingkatA.ts) saat PACK dirakit; integritas referensial (id
 * pertanyaan/region harus ada di kasus dasar, id varian unik & bukan
 * '_dasar', varian tak boleh kosong) dijaga `validasiPack` (pack.ts).
 */
import type { VarianPresentasiTingkatA } from './types'

export const VARIAN_TINGKAT_A: Record<string, VarianPresentasiTingkatA[]> = {}
