import type {
  KasusKlinis,
  KategoriAnamnesis,
  PertanyaanAnamnesis,
} from '../types'

type Oldcarts = NonNullable<PertanyaanAnamnesis['oldcarts']>

export interface LabQuestionSpec {
  id: string
  kategori: Exclude<KategoriAnamnesis, 'keluhan_utama'> | 'keluhan_utama'
  tanya: string
  jawab: string
  esensial?: boolean
  distraktor?: boolean
  oldcarts?: Oldcarts
  hanyaUntuk?: 'L' | 'P'
}
export type LabCaseSpec = Omit<KasusKlinis, 'activationStatus' | 'anamnesis'> & {
  pembuka: {
    tanya: string
    jawab: string
    oldcarts?: Oldcarts
  }
  pertanyaan: LabQuestionSpec[]
}

/**
 * Factory kecil untuk batch lab. Semua pertanyaan spesifik dibuka setelah
 * keluhan utama agar percakapan tidak melompat langsung ke hipotesis dokter.
 */
export function buatKasusLab(spec: LabCaseSpec): KasusKlinis {
  const ids = ['q_keluhan', ...spec.pertanyaan.map((item) => item.id)]
  if (new Set(ids).size !== ids.length) {
    throw new Error(`Kasus lab '${spec.id}' memiliki id anamnesis duplikat`)
  }

  const anamnesis: PertanyaanAnamnesis[] = [
    {
      id: 'q_keluhan',
      kategori: 'keluhan_utama',
      tanya: spec.pembuka.tanya,
      jawab: spec.pembuka.jawab,
      esensial: true,
      oldcarts: spec.pembuka.oldcarts ?? ['karakter', 'durasi'],
    },
    ...spec.pertanyaan.map((item) => ({
      ...item,
      bukaSetelah: ['q_keluhan'],
    })),
  ]

  const { pembuka: _pembuka, pertanyaan: _pertanyaan, ...kasus } = spec
  return {
    ...kasus,
    activationStatus: 'lab_prototype_unadjudicated',
    anamnesis,
  }
}
