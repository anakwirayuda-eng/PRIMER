import type { Obat, Tindakan, TopikEdukasi } from '../../types'

// Nilai harga/biaya masih placeholder authoring; manifest memblokir aktivasi sampai dikalibrasi.
export const M13_1A_OBAT_DRAFT: Record<string, Obat> = {
  glukosa_oral_15g: {
    id: 'glukosa_oral_15g',
    nama: 'Glukosa Oral 15 g',
    kelas: 'Koreksi hipoglikemia oral',
    sediaan: 'Gel/tablet/larutan setara 15 g glukosa',
    hargaBeli: 1500,
    hargaJual: 2500,
    fornas: false,
  },
  ipratropium_salbutamol_neb: {
    id: 'ipratropium_salbutamol_neb',
    nama: 'Ipratropium 0,5 mg + Salbutamol 2,5 mg',
    kelas: 'Bronkodilator kombinasi SAMA + SABA',
    sediaan: 'Cairan inhalasi unit-dose untuk nebulisasi',
    hargaBeli: 8500,
    hargaJual: 15000,
    fornas: true,
  },
  asam_asetat_tetes_telinga_2: {
    id: 'asam_asetat_tetes_telinga_2',
    nama: 'Asam Asetat Tetes Telinga 2%',
    kelas: 'Antiseptik/acidifying agent otik',
    sediaan: 'Tetes telinga 2%',
    hargaBeli: 5000,
    hargaJual: 9000,
    fornas: true,
  },
  sefazolin_inj_1g: {
    id: 'sefazolin_inj_1g',
    nama: 'Sefazolin Injeksi 1 g',
    kelas: 'Antibiotik sefalosporin generasi pertama',
    golonganAlergi: 'sefalosporin',
    sediaan: 'Serbuk injeksi 1 g',
    hargaBeli: 12000,
    hargaJual: 22000,
    fornas: true,
    antibiotik: true,
  },
  vaksin_td: {
    id: 'vaksin_td',
    nama: 'Vaksin Tetanus-Difteri (Td)',
    kelas: 'Vaksin toksoid',
    sediaan: 'Injeksi intramuskular 0,5 mL',
    hargaBeli: 0,
    hargaJual: 0,
    fornas: true,
  },
  tetanus_imunoglobulin_250: {
    id: 'tetanus_imunoglobulin_250',
    nama: 'Human Tetanus Immunoglobulin 250 IU',
    kelas: 'Imunoglobulin',
    sediaan: 'Injeksi intramuskular 250 IU',
    hargaBeli: 150000,
    hargaJual: 175000,
    fornas: true,
  },
}

export const M13_1A_TINDAKAN_DRAFT: Record<string, Tindakan> = {
  rehidrasi_plan_c_bayi: {
    id: 'rehidrasi_plan_c_bayi',
    nama: 'Plan C bayi: cairan IV 100 mL/kg + penilaian ulang serial',
    icd9: '99.18',
    biaya: 65000,
  },
  ekstraksi_benda_asing_hidung: {
    id: 'ekstraksi_benda_asing_hidung',
    nama: 'Ekstraksi benda asing hidung dengan instrumen sesuai bentuk',
    icd9: '98.12',
    biaya: 35000,
  },
  irigasi_luka_fraktur_terbuka: {
    id: 'irigasi_luka_fraktur_terbuka',
    nama: 'Irigasi singkat luka fraktur terbuka dengan NaCl tanpa debridement',
    icd9: '96.59',
    biaya: 30000,
  },
  balut_luka_steril: {
    id: 'balut_luka_steril',
    nama: 'Balut luka terbuka secara steril',
    icd9: '93.57',
    biaya: 30000,
  },
  imobilisasi_bidai: {
    id: 'imobilisasi_bidai',
    nama: 'Imobilisasi ekstremitas dengan bidai',
    icd9: '93.54',
    biaya: 45000,
  },
}

export const M13_1A_EDUKASI_DRAFT: Record<string, TopikEdukasi> = {
  cegah_benda_asing_hidung: {
    id: 'cegah_benda_asing_hidung',
    nama: '[Anak] Jauhkan benda kecil dan jangan mengorek hidung secara buta',
    kategori: 'tindakan',
    sinonim: ['benda asing hidung', 'manik-manik', 'baterai kancing'],
  },
  jaga_telinga_kering: {
    id: 'jaga_telinga_kering',
    nama: '[Telinga] Jaga liang telinga kering dan jangan dikorek',
    kategori: 'higiene',
    sinonim: ['otitis eksterna', 'swimmer ear', 'cotton bud'],
  },
  tinjau_obat_hipoglikemia: {
    id: 'tinjau_obat_hipoglikemia',
    nama: '[DM] Tinjau sulfonilurea dan sesuaikan regimen dengan pola makan',
    kategori: 'kepatuhan',
    sinonim: ['glimepirid', 'sulfonilurea', 'hipoglikemia berulang'],
  },
  keselamatan_fraktur_rujuk: {
    id: 'keselamatan_fraktur_rujuk',
    nama: '[Trauma] Jangan dorong tulang masuk; jaga balutan dan bidai saat rujuk',
    kategori: 'tindakan',
    sinonim: ['fraktur terbuka', 'bidai', 'rujuk trauma'],
  },
}
