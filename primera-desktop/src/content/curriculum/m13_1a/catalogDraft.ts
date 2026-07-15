import type { Obat, Tindakan, TopikEdukasi } from '../../types'

// Nilai harga/biaya adalah parameter ekonomi simulasi yang dikalibrasi terhadap
// rentang katalog game. Angka ini bukan klaim harga pengadaan atau tarif nasional.
export const M13_1A_OBAT_DRAFT: Record<string, Obat> = {
  asam_asetat_tetes_telinga_2: {
    id: 'asam_asetat_tetes_telinga_2',
    nama: 'Asam Asetat Tetes Telinga 2%',
    kelas: 'Antiseptik/acidifying agent otik',
    sediaan: 'Tetes telinga 2%',
    hargaBeli: 5000,
    hargaJual: 9000,
    fornas: true,
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
  nebulisasi_burst_asma_anak: {
    id: 'nebulisasi_burst_asma_anak',
    nama: 'Burst asma anak: salbutamol 5 mg + ipratropium 0,5 mg tiap 20 menit x3',
    icd9: '93.94',
    biaya: 75000,
  },
  koreksi_hipoglikemia_oral_15g: {
    id: 'koreksi_hipoglikemia_oral_15g',
    nama: 'Koreksi hipoglikemia: glukosa oral 15-20 g + GDS ulang 15 menit',
    icd9: '99.18',
    biaya: 5000,
  },
  ekstraksi_benda_hidung_tekanan_positif: {
    id: 'ekstraksi_benda_hidung_tekanan_positif',
    nama: 'Tekanan positif terarah untuk benda asing hidung anterior',
    icd9: '98.12',
    biaya: 20000,
  },
  ekstraksi_benda_hidung_blind_probing: {
    id: 'ekstraksi_benda_hidung_blind_probing',
    nama: 'Korek/jepit buta benda asing hidung',
    icd9: '98.12',
    biaya: 25000,
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
  antibiotik_parenteral_fraktur_protokol: {
    id: 'antibiotik_parenteral_fraktur_protokol',
    nama: 'Antibiotik parenteral fraktur terbuka sesuai protokol jejaring',
    icd9: '99.21',
    biaya: 30000,
  },
  irigasi_luka_fraktur_terbuka: {
    id: 'irigasi_luka_fraktur_terbuka',
    nama: 'Irigasi/mini-washout fraktur terbuka di FKTP',
    icd9: '96.59',
    biaya: 30000,
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
