/**
 * PENJAGA KELAS — kasus bervital jelas abnormal WAJIB menulis regio 'umum';
 * kasus berdiagnosis kulit WAJIB menulis regio 'kulit'.
 *
 * Latar (audit CODEX 2026-08-04, temuan 1/3/4): `temuanUntukRegion` (clinic.ts)
 * menjawab "dalam batas normal" untuk regio yang tak ditulis kasusnya. Untuk
 * regio yang memang tak relevan, jawaban itu jujur. Tapi pada anak bersuhu 39
 * atau pasien bersaturasi 92, "Keadaan Umum dalam batas normal" adalah karangan
 * yang bertentangan dengan tanda vital di layar yang sama — persis kelas bug
 * yang sudah disapu di sisi laboratorium (labTumpangTindih.ts).
 *
 * Sapuan itu menemukan 3 kasus bervital abnormal tanpa regio 'umum'
 * (kulit_morbili, mm_gagal_jantung_kongestif, lab_limfadenitis_servikal_akut)
 * dan 1 kasus TB kulit tanpa regio 'kulit' (lab_skrofuloderma_suspek). Semuanya
 * sudah ditulis. Test ini menjaga agar kasus BARU tidak mengulanginya diam-diam.
 *
 * Ambangnya sengaja konservatif — hanya nilai yang tak diperdebatkan lintas usia,
 * supaya penjaga ini tidak memaksa penulis menambah kalimat pada kasus yang
 * vitalnya memang wajar. Batas napas dan nadi dibiarkan longgar karena keduanya
 * bergantung usia; demam dan saturasi tidak.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from './index'

/** Demam >=38,0 dan saturasi <95% abnormal pada semua usia — dua ini saja yang dipakai. */
function vitalJelasAbnormal(kasus: (typeof PACK.kasus)[string]): string[] {
  const alasan: string[] = []
  const v = kasus.vital
  if (v === undefined) return alasan
  if (v.suhu !== undefined && v.suhu >= 38) alasan.push(`suhu ${v.suhu}`)
  if (v.spo2 !== undefined && v.spo2 < 95) alasan.push(`SpO2 ${v.spo2}%`)
  return alasan
}

describe('regio pemeriksaan fisik yang wajib ditulis', () => {
  it('vital jelas abnormal → regio "umum" harus ditulis, bukan dikarang normal', () => {
    const pelanggar = Object.values(PACK.kasus)
      .filter((k) => vitalJelasAbnormal(k).length > 0)
      .filter((k) => !k.pemeriksaanFisik.some((p) => p.region === 'umum'))
      .map((k) => `${k.id} (${vitalJelasAbnormal(k).join(', ')})`)

    expect(
      pelanggar,
      `Kasus berikut punya tanda vital jelas abnormal tetapi tak menulis temuan Keadaan Umum, ` +
        `sehingga memeriksanya dijawab "dalam batas normal" — bertentangan dengan vital di layar ` +
        `yang sama. Tulis satu kalimat 'umum' yang ditranskrip dari data kasus itu sendiri:\n` +
        pelanggar.join('\n'),
    ).toEqual([])
  })

  it('kasus berkategori kulit → regio "kulit" harus ditulis', () => {
    const pelanggar = Object.values(PACK.kasus)
      .filter((k) => k.kategori === 'kulit')
      .filter((k) => !k.pemeriksaanFisik.some((p) => p.region === 'kulit'))
      .map((k) => k.id)

    expect(
      pelanggar,
      `Kasus kulit berikut tak punya satu pun temuan regio kulit, sehingga memeriksa kulit ` +
        `dijawab "dalam batas normal" pada pasien yang justru datang karena keluhan kulit:\n` +
        pelanggar.join('\n'),
    ).toEqual([])
  })
})
