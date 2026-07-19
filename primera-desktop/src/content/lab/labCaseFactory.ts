import type {
  KasusKlinis,
  KategoriAnamnesis,
  KategoriKasus,
  PemeriksaanLab,
  PertanyaanAnamnesis,
  RegionFisik,
  SpesialisasiRs,
  TandaVital,
  Tatalaksana,
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
  /**
   * M13 Batch 4 (2026-07-16): variasi suara per persona untuk jawaban. Factory
   * sudah meneruskannya (`...item`) & `bahasaPasien.test.ts` mengujinya, tetapi
   * tipe ringkas ini semula tak mendeklarasikannya — memaksa file batch4
   * memakai shim tipe lokal. Diangkat ke sini supaya semua penulis kasus lab
   * konsisten menulis variasi inline tanpa akrobat tipe.
   */
  variasi?: PertanyaanAnamnesis['variasi']
}
export type LabCaseSpec = Omit<KasusKlinis, 'activationStatus' | 'anamnesis'> & {
  pembuka: {
    tanya: string
    jawab: string
    oldcarts?: Oldcarts
    /**
     * M13 Batch 4: variasi suara persona untuk keluhan pembuka. Sebelumnya
     * variasi pembuka HANYA bisa lewat lapisan enrichment (`variasiPembuka`);
     * kini penulis kasus bisa menuliskannya inline pada kasus barunya.
     */
    variasi?: PertanyaanAnamnesis['variasi']
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
      ...(spec.pembuka.variasi ? { variasi: spec.pembuka.variasi } : {}),
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

type PertanyaanRingkas = readonly [
  id: string,
  kategori: Exclude<KategoriAnamnesis, 'keluhan_utama'>,
  tanya: string,
  jawab: string,
  esensial?: boolean,
  hanyaUntuk?: 'L' | 'P',
]
type FisikRingkas = readonly [region: RegionFisik, temuan: string, relevan?: boolean]
type LabRingkas = readonly [
  id: string,
  hasil: string,
  flag: PemeriksaanLab['flag'],
  relevan?: boolean,
]

export interface FktpLabSpec {
  id: string
  nama: string
  icd10: string
  kategori: KategoriKasus
  keluhanUtama: string
  keluhanUtamaOlehPendamping?: boolean
  usia: readonly [min: number, max: number]
  jenisKelamin?: 'L' | 'P'
  usiaBulan?: readonly [min: number, max: number]
  vital: TandaVital
  pembuka: readonly [tanya: string, jawab: string]
  pertanyaan: readonly PertanyaanRingkas[]
  fisik: readonly FisikRingkas[]
  lab?: readonly LabRingkas[]
  diagnosisBanding: string[]
  tatalaksana: Tatalaksana
  clue: string
  panduanResmi?: string
  catatanRealita?: string
  mutiaraEbm?: string
  prevalensi?: 'tinggi' | 'sedang' | 'rendah'
  harusDirujuk?: boolean
  spesialisRujukan?: SpesialisasiRs
  stabilisasiWajib?: string[]
  konfirmasiWajib?: string
  /**
   * M13 Batch 6 (2026-07-16): dua field di bawah sebelumnya TIDAK diteruskan
   * bentuk padat ini, sehingga 103 kasus lab terputus dari dua sistem
   * longitudinal — nol di antaranya bisa membentuk kluster surveilans
   * (`ambangKluster`) atau masuk kontrol PRB (`bisaPrb`), bukan karena
   * keputusan klinis melainkan semata karena factory-nya bocor. Lihat
   * `KasusKlinis` di types.ts untuk semantik keduanya.
   */
  ambangKluster?: number
  bisaPrb?: boolean
}

/**
 * Bentuk authoring padat untuk ekspansi katalog 4A. Hasilnya tetap memakai
 * kontrak KasusKlinis lengkap; ringkasan ini hanya menghapus boilerplate yang
 * identik pada puluhan kasus lab.
 */
export function buatKasusFktpLab(spec: FktpLabSpec): KasusKlinis {
  return buatKasusLab({
    id: spec.id,
    nama: spec.nama,
    icd10: spec.icd10,
    skdi: '4A',
    kategori: spec.kategori,
    fktp144: true,
    harusDirujuk: spec.harusDirujuk ?? false,
    prevalensi: spec.prevalensi ?? 'rendah',
    spesialisRujukan: spec.spesialisRujukan,
    ambangKluster: spec.ambangKluster,
    bisaPrb: spec.bisaPrb,
    keluhanUtama: spec.keluhanUtama,
    keluhanUtamaOlehPendamping: spec.keluhanUtamaOlehPendamping,
    demografi: {
      usiaMin: spec.usia[0],
      usiaMax: spec.usia[1],
      jenisKelamin: spec.jenisKelamin,
      usiaBulanMin: spec.usiaBulan?.[0],
      usiaBulanMax: spec.usiaBulan?.[1],
    },
    vital: spec.vital,
    pembuka: { tanya: spec.pembuka[0], jawab: spec.pembuka[1] },
    pertanyaan: spec.pertanyaan.map(([id, kategori, tanya, jawab, esensial, hanyaUntuk]) => ({
      id,
      kategori,
      tanya,
      jawab,
      esensial,
      hanyaUntuk,
    })),
    pemeriksaanFisik: spec.fisik.map(([region, temuan, relevan = true]) => ({
      region,
      temuan,
      relevan,
    })),
    lab: (spec.lab ?? []).map(([id, hasil, flag, relevan = true]) => ({
      id,
      hasil,
      flag,
      relevan,
    })),
    diagnosisBanding: spec.diagnosisBanding,
    tatalaksana: spec.tatalaksana,
    clue: spec.clue,
    panduanResmi: spec.panduanResmi,
    catatanRealita: spec.catatanRealita,
    mutiaraEbm: spec.mutiaraEbm,
    stabilisasiWajib: spec.stabilisasiWajib,
    konfirmasiWajib: spec.konfirmasiWajib,
  })
}
