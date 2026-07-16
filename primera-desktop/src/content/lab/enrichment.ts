/**
 * LAPISAN PENGAYAAN PROTOTIPE LAB (2026-07-16).
 *
 * Audit 4-dimensi menemukan 103 kasus lab jauh lebih "tipis" dari 67 kasus
 * orisinal pada dimensi INTERAKTIF: variasi suara persona 0% vs 95.9%,
 * distraktor anamnesis 0% vs 76.7%, jebakan resep 21% vs 96%, konsekuensi
 * follow-up 1% vs 85%. Akibatnya pasien lab bersuara datar, klik-semua
 * anamnesis jadi optimal tanpa hukuman, fase farmasi nyaris tanpa perangkap,
 * dan salah kelola tak pernah berbuntut.
 *
 * Pengayaan ditaruh di LAPISAN TERPISAH (bukan menyunting literal kasus di
 * batch*.ts) agar: (a) 3 batch bisa dikerjakan paralel tanpa konflik file,
 * (b) konten pengayaan mudah ditinjau/diadjudikasi terpisah saat porting ke
 * repo produksi, (c) kasus dasar tetap satu sumber. Merge bersifat aditif dan
 * konservatif: field yang SUDAH diisi kasus dasar tidak ditimpa.
 */

import type {
  KasusKlinis,
  KonsekuensiKlinis,
  PertanyaanAnamnesis,
  Persona,
} from '../types'
import { LAB_ENRICHMENT_1 } from './enrichmentData1'
import { LAB_ENRICHMENT_2 } from './enrichmentData2'
import { LAB_ENRICHMENT_3 } from './enrichmentData3'

export interface LabDistraktorSpec {
  id: string
  kategori: PertanyaanAnamnesis['kategori']
  tanya: string
  jawab: string
  hanyaUntuk?: 'L' | 'P'
  /** Variasi suara persona untuk jawaban distraktor (opsional). */
  variasi?: Partial<Record<Persona, string>>
}

/** Pertanyaan anamnesis SUBSTANTIF tambahan (bukan distraktor). */
export interface LabPertanyaanSpec {
  id: string
  kategori: PertanyaanAnamnesis['kategori']
  tanya: string
  jawab: string
  /** Wajib ditanya untuk skor anamnesis penuh. Default true. */
  esensial?: boolean
  oldcarts?: PertanyaanAnamnesis['oldcarts']
  hanyaUntuk?: 'L' | 'P'
  variasi?: Partial<Record<Persona, string>>
}

export interface LabEnrichmentSpec {
  /**
   * Pertanyaan distraktor tambahan — tidak relevan untuk kasus ini; menanyakannya
   * menggerus kesabaran pasien (engine: clinic.ts). Membuat "klik-semua" bukan
   * lagi strategi optimal tanpa risiko.
   */
  distraktor?: LabDistraktorSpec[]
  /**
   * M13 Batch 5 (2026-07-16): pertanyaan SUBSTANTIF tambahan untuk kasus lab
   * yang anamnesisnya masih dangkal (median lab 4 vs 8 pada kasus orisinal).
   * Beda dari `distraktor` — yang ini RELEVAN, esensial secara default, dan
   * menutup dimensi OLDCARTS yang belum tergali. Sebelum field ini ada, lapisan
   * pengayaan hanya bisa menambah pertanyaan yang SALAH ditanya, tak pernah
   * memperdalam yang benar.
   */
  pertanyaan?: LabPertanyaanSpec[]
  /** Jebakan resep tambahan: obat plausibel-tapi-salah, ber-alasan pedagogis. */
  obatSalahUmum?: { id: string; alasan: string; bahaya?: 'kontraindikasi' | 'nonPrimer' }[]
  /** Konsekuensi follow-up bila salah kelola (pasien kembali memburuk). */
  konsekuensi?: KonsekuensiKlinis
  /** Variasi suara pasien untuk pertanyaan pembuka (q_keluhan). */
  variasiPembuka?: Partial<Record<Persona, string>>
  /** Variasi suara untuk pertanyaan lain, dikunci per id pertanyaan. */
  variasi?: Record<string, Partial<Record<Persona, string>>>
  /** Kasus kronis-stabil eligible Program Rujuk Balik (9 kelompok Perpres JKN). */
  bisaPrb?: boolean
  /** Mutiara EBM tambahan untuk debrief (murni pedagogis). */
  mutiaraEbm?: string
}

/** Peta pengayaan gabungan dari tiga data-file per-batch. */
export const LAB_ENRICHMENT: Record<string, LabEnrichmentSpec> = {
  ...LAB_ENRICHMENT_1,
  ...LAB_ENRICHMENT_2,
  ...LAB_ENRICHMENT_3,
}

function gabungObatSalah(
  dasar: KasusKlinis['tatalaksana']['obatSalahUmum'],
  tambahan: NonNullable<LabEnrichmentSpec['obatSalahUmum']>,
): NonNullable<KasusKlinis['tatalaksana']['obatSalahUmum']> {
  const ada = new Map((dasar ?? []).map((o) => [o.id, o]))
  for (const o of tambahan) if (!ada.has(o.id)) ada.set(o.id, o)
  return [...ada.values()]
}

/**
 * Terapkan pengayaan ke satu kasus (pure). Aditif + konservatif: konsekuensi/
 * bisaPrb/mutiaraEbm hanya diisi bila kasus dasar belum punya; obatSalahUmum
 * di-merge dedup-by-id; distraktor di-append (dengan bukaSetelah q_keluhan).
 */
export function applyLabEnrichment(kasus: KasusKlinis, e: LabEnrichmentSpec | undefined): KasusKlinis {
  if (!e) return kasus

  let anamnesis = kasus.anamnesis

  // Pertanyaan substantif lebih dulu, supaya urutannya di UI tetap: pembuka →
  // penggalian relevan → distraktor di ekor.
  if (e.pertanyaan?.length) {
    const idsAda = new Set(anamnesis.map((q) => q.id))
    const tambahan: PertanyaanAnamnesis[] = []
    for (const p of e.pertanyaan) {
      if (idsAda.has(p.id)) {
        throw new Error(`Pengayaan lab ${kasus.id}: id pertanyaan '${p.id}' bentrok dengan pertanyaan yang sudah ada`)
      }
      idsAda.add(p.id)
      tambahan.push({
        id: p.id,
        kategori: p.kategori,
        tanya: p.tanya,
        jawab: p.jawab,
        esensial: p.esensial ?? true,
        bukaSetelah: ['q_keluhan'],
        ...(p.oldcarts ? { oldcarts: p.oldcarts } : {}),
        ...(p.hanyaUntuk ? { hanyaUntuk: p.hanyaUntuk } : {}),
        ...(p.variasi ? { variasi: p.variasi } : {}),
      })
    }
    anamnesis = [...anamnesis, ...tambahan]
  }

  if (e.distraktor?.length) {
    const idsAda = new Set(anamnesis.map((q) => q.id))
    const tambahan: PertanyaanAnamnesis[] = []
    for (const d of e.distraktor) {
      if (idsAda.has(d.id)) {
        throw new Error(`Pengayaan lab ${kasus.id}: id distraktor '${d.id}' bentrok dengan pertanyaan yang sudah ada`)
      }
      idsAda.add(d.id)
      tambahan.push({
        id: d.id,
        kategori: d.kategori,
        tanya: d.tanya,
        jawab: d.jawab,
        distraktor: true,
        esensial: false,
        bukaSetelah: ['q_keluhan'],
        ...(d.hanyaUntuk ? { hanyaUntuk: d.hanyaUntuk } : {}),
        ...(d.variasi ? { variasi: d.variasi } : {}),
      })
    }
    anamnesis = [...anamnesis, ...tambahan]
  }

  if (e.variasiPembuka || e.variasi) {
    anamnesis = anamnesis.map((q) => {
      if (q.id === 'q_keluhan' && e.variasiPembuka) {
        return { ...q, variasi: { ...q.variasi, ...e.variasiPembuka } }
      }
      const v = e.variasi?.[q.id]
      return v ? { ...q, variasi: { ...q.variasi, ...v } } : q
    })
  }

  const tatalaksana = e.obatSalahUmum?.length
    ? { ...kasus.tatalaksana, obatSalahUmum: gabungObatSalah(kasus.tatalaksana.obatSalahUmum, e.obatSalahUmum) }
    : kasus.tatalaksana

  return {
    ...kasus,
    anamnesis,
    tatalaksana,
    konsekuensi: kasus.konsekuensi ?? e.konsekuensi,
    bisaPrb: kasus.bisaPrb ?? e.bisaPrb,
    mutiaraEbm: kasus.mutiaraEbm ?? e.mutiaraEbm,
  }
}
