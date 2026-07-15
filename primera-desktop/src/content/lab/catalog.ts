import type { ItemLab, Obat, Tindakan, TopikEdukasi } from '../types'

export const OBAT_LAB: Record<string, Obat> = {
  dimenhidrinat_50: {
    id: 'dimenhidrinat_50',
    nama: 'Dimenhidrinat 50 mg',
    kelas: 'antiemetik-antivertigo',
    sediaan: 'tablet',
    hargaBeli: 300,
    hargaJual: 700,
    fornas: true,
  },
  flutikason_semprot_hidung: {
    id: 'flutikason_semprot_hidung',
    nama: 'Flutikason Semprot Hidung 50 mcg/dosis',
    kelas: 'kortikosteroid intranasal',
    sediaan: 'semprot hidung',
    hargaBeli: 45000,
    hargaJual: 65000,
    fornas: false,
  },
  triamcinolone_orabase: {
    id: 'triamcinolone_orabase',
    nama: 'Triamsinolon Asetonid 0,1% Orabase',
    kelas: 'kortikosteroid topikal oral',
    sediaan: 'pasta oral',
    hargaBeli: 15000,
    hargaJual: 25000,
    fornas: false,
  },
  nistatin_suspensi: {
    id: 'nistatin_suspensi',
    nama: 'Nistatin Suspensi 100.000 IU/mL',
    kelas: 'antijamur orofaringeal',
    sediaan: 'suspensi oral',
    hargaBeli: 12000,
    hargaJual: 22000,
    fornas: true,
  },
  ivermektin_3: {
    id: 'ivermektin_3',
    nama: 'Ivermektin 3 mg',
    kelas: 'antihelmintik',
    sediaan: 'tablet',
    hargaBeli: 2500,
    hargaJual: 5000,
    fornas: true,
  },
  prazikuantel_600: {
    id: 'prazikuantel_600',
    nama: 'Prazikuantel 600 mg',
    kelas: 'antihelmintik',
    sediaan: 'tablet',
    hargaBeli: 2500,
    hargaJual: 5000,
    fornas: true,
  },
}
export const LAB_LAB: Record<string, ItemLab> = {
  anti_hav_igm: {
    id: 'anti_hav_igm',
    nama: 'IgM Anti-HAV',
    biaya: 160000,
    nilaiNormal: 'Nonreaktif',
    hasilBesok: true,
  },
}

export const EDUKASI_LAB: Record<string, TopikEdukasi> = {
  istirahat_suara: {
    id: 'istirahat_suara',
    nama: '[THT] Istirahat suara, cukup minum, dan hindari asap',
    kategori: 'tindakan',
    sinonim: ['laringitis', 'serak', 'vocal rest'],
  },
  cegah_mabuk_perjalanan: {
    id: 'cegah_mabuk_perjalanan',
    nama: '[Perjalanan] Duduk stabil, lihat horizon, dan waspadai kantuk obat',
    kategori: 'tindakan',
    sinonim: ['mabuk kendaraan', 'dimenhidrinat', 'motion sickness'],
  },
  jangan_pencet_furunkel_hidung: {
    id: 'jangan_pencet_furunkel_hidung',
    nama: '[Hidung] Jangan pencet atau insisi sendiri furunkel hidung',
    kategori: 'higiene',
    sinonim: ['bisul hidung', 'furunkel', 'segitiga wajah'],
  },
  hindari_iritan_hidung: {
    id: 'hindari_iritan_hidung',
    nama: '[Hidung] Hindari asap, parfum tajam, dan perubahan suhu pemicu',
    kategori: 'gaya_hidup',
    sinonim: ['rinitis vasomotor', 'iritan', 'asap'],
  },
  higiene_mulut: {
    id: 'higiene_mulut',
    nama: '[Mulut] Jaga higiene mulut dan hindari trauma mukosa',
    kategori: 'higiene',
    sinonim: ['aftosa', 'sariawan', 'kandidiasis oral'],
  },
  eliminasi_makanan_terarah: {
    id: 'eliminasi_makanan_terarah',
    nama: '[Makanan] Catat pemicu, baca label, dan eliminasi terarah',
    kategori: 'diet',
    sinonim: ['alergi makanan', 'intoleransi', 'food diary'],
  },
  cegah_cacing_tanah: {
    id: 'cegah_cacing_tanah',
    nama: '[Parasit] Pakai alas kaki, jamban sehat, dan cuci tangan',
    kategori: 'higiene',
    sinonim: ['cacing tambang', 'strongiloidiasis', 'tanah'],
  },
  hindari_air_tawar_endemis: {
    id: 'hindari_air_tawar_endemis',
    nama: '[Skistosomiasis] Hindari kontak air tawar di fokus endemis',
    kategori: 'gaya_hidup',
    sinonim: ['schistosoma', 'Sulawesi Tengah', 'danau'],
  },
  masak_daging_matang: {
    id: 'masak_daging_matang',
    nama: '[Taeniasis] Masak daging sampai matang dan gunakan jamban',
    kategori: 'higiene',
    sinonim: ['cacing pita', 'babi', 'sapi'],
  },
  cegah_hepatitis_a: {
    id: 'cegah_hepatitis_a',
    nama: '[Hepatitis A] Cuci tangan, air aman, dan jangan berbagi makanan',
    kategori: 'higiene',
    sinonim: ['HAV', 'jaundice', 'ikterus'],
  },
  cegah_pertusis: {
    id: 'cegah_pertusis',
    nama: '[Pertusis] Etika batuk, batasi kontak rentan, dan cek imunisasi',
    kategori: 'higiene',
    sinonim: ['batuk rejan', 'droplet', 'whooping cough'],
  },
  puasa_sambil_rujuk: {
    id: 'puasa_sambil_rujuk',
    nama: '[Rujukan bedah] Jangan makan/minum sampai evaluasi lanjutan',
    kategori: 'tindakan',
    sinonim: ['NPO', 'ileus', 'operasi'],
  },
}

export const TINDAKAN_LAB: Record<string, Tindakan> = {
  akses_iv_resusitasi: {
    id: 'akses_iv_resusitasi',
    nama: 'Akses IV dan cairan resusitasi terukur',
    icd9: '38.93',
    biaya: 50000,
  },
  dekompresi_ngt: {
    id: 'dekompresi_ngt',
    nama: 'Pasang NGT untuk dekompresi',
    icd9: '96.07',
    biaya: 45000,
  },
  posisi_semifowler: {
    id: 'posisi_semifowler',
    nama: 'Posisikan duduk atau semi-Fowler',
    icd9: '93.59',
    biaya: 0,
  },
}
