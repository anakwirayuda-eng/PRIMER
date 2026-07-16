/**
 * KATALOG BATCH 4 (M13 lab, 2026-07-16) — item tambahan yang dibutuhkan
 * 34 kasus tier-rujuk (3A/3B/2) di batch4*.ts.
 *
 * Prinsip pemilihan (lihat M13_LAB_DECISION_LEDGER.md):
 *  - Obat: dipilih dari Fornas 1199/2025 sejauh dapat dipastikan; item yang
 *    memang bukan lingkup FKTP (mis. antitiroid, tamsulosin) tetap dimasukkan
 *    KARENA kasusnya berakhir dirujuk — pemain perlu MENGENALI namanya di
 *    debrief, dan `catatanRealita` kasus terkait menjelaskan celahnya.
 *  - Penunjang: game sengaja idealis (semua alat ada) demi mengajar breadth;
 *    USG (program USG ANC Kemenkes sejak 2022) & radiografi polos memang ada
 *    di sebagian Puskesmas, TIDAK di semua — `catatanRealita` menyebut ini.
 *  - Tindakan: dua entri terakhir SENGAJA salah/nonPrimer (dipakai sebagai
 *    `tindakanSalahUmum`), bukan tindakan benar mana pun.
 *
 * Kosakata TERTUTUP: kasus batch4 hanya boleh memakai id dari file ini +
 * katalog yang sudah ada. Menambah id baru = edit file ini, bukan improvisasi
 * di file kasus (validasiPack akan menolak id yang tak terdaftar).
 */

import type { ItemLab, Obat, Tindakan, TopikEdukasi } from '../types'

export const OBAT_LAB_BATCH4: Record<string, Obat> = {
  ketorolak_30_inj: {
    id: 'ketorolak_30_inj',
    nama: 'Ketorolak 30 mg Injeksi',
    kelas: 'NSAID parenteral',
    sinonim: ['ketorolac', 'toradol'],
    golonganAlergi: 'nsaid',
    sediaan: 'ampul 30 mg/mL',
    hargaBeli: 6000,
    hargaJual: 12000,
    fornas: true,
  },
  hyoscine_butilbromida_20_inj: {
    id: 'hyoscine_butilbromida_20_inj',
    nama: 'Hiosin Butilbromida 20 mg Injeksi',
    kelas: 'antispasmodik',
    sinonim: ['buscopan', 'hyoscine', 'skopolamin butilbromida'],
    sediaan: 'ampul 20 mg/mL',
    hargaBeli: 7000,
    hargaJual: 14000,
    fornas: true,
  },
  metronidazol_inj_500: {
    id: 'metronidazol_inj_500',
    nama: 'Metronidazol 500 mg Infus',
    kelas: 'antibiotik nitroimidazol parenteral',
    golonganAlergi: 'nitroimidazol',
    sinonim: ['metronidazole infus'],
    sediaan: 'botol infus 500 mg/100 mL',
    hargaBeli: 8000,
    hargaJual: 16000,
    fornas: true,
    antibiotik: true,
  },
  nacl_09_inf: {
    id: 'nacl_09_inf',
    nama: 'Natrium Klorida 0,9% Infus',
    kelas: 'cairan kristaloid',
    sinonim: ['nacl', 'normal saline', 'garam fisiologis'],
    sediaan: 'kolf 500 mL',
    hargaBeli: 7000,
    hargaJual: 13000,
    fornas: true,
  },
  ringer_laktat_inf: {
    id: 'ringer_laktat_inf',
    nama: 'Ringer Laktat Infus',
    kelas: 'cairan kristaloid',
    sinonim: ['rl', 'ringer lactate'],
    sediaan: 'kolf 500 mL',
    hargaBeli: 7500,
    hargaJual: 14000,
    fornas: true,
  },
  asetazolamid_250: {
    id: 'asetazolamid_250',
    nama: 'Asetazolamid 250 mg',
    kelas: 'penghambat karbonik anhidrase',
    sinonim: ['acetazolamide', 'diamox'],
    sediaan: 'tablet 250 mg',
    hargaBeli: 1200,
    hargaJual: 2500,
    fornas: true,
  },
  pilokarpin_tetes_2: {
    id: 'pilokarpin_tetes_2',
    nama: 'Pilokarpin 2% Tetes Mata',
    kelas: 'miotik kolinergik',
    sinonim: ['pilocarpine'],
    sediaan: 'botol tetes 5 mL',
    hargaBeli: 12000,
    hargaJual: 22000,
    fornas: true,
  },
  propranolol_10: {
    id: 'propranolol_10',
    nama: 'Propranolol 10 mg',
    kelas: 'beta-blocker non-selektif',
    sinonim: ['inderal'],
    sediaan: 'tablet 10 mg',
    hargaBeli: 200,
    hargaJual: 500,
    fornas: true,
  },
  propiltiourasil_100: {
    id: 'propiltiourasil_100',
    nama: 'Propiltiourasil 100 mg',
    kelas: 'antitiroid tionamid',
    sinonim: ['ptu', 'propylthiouracil'],
    sediaan: 'tablet 100 mg',
    hargaBeli: 700,
    hargaJual: 1500,
    fornas: true,
  },
  furosemid_inj_20: {
    id: 'furosemid_inj_20',
    nama: 'Furosemid 20 mg Injeksi',
    kelas: 'diuretik loop parenteral',
    sinonim: ['lasix injeksi', 'furosemide iv'],
    sediaan: 'ampul 20 mg/2 mL',
    hargaBeli: 3000,
    hargaJual: 6000,
    fornas: true,
  },
  spironolakton_25: {
    id: 'spironolakton_25',
    nama: 'Spironolakton 25 mg',
    kelas: 'diuretik hemat kalium',
    sinonim: ['spironolactone', 'aldactone'],
    sediaan: 'tablet 25 mg',
    hargaBeli: 500,
    hargaJual: 1200,
    fornas: true,
  },
  omeprazol_inj_40: {
    id: 'omeprazol_inj_40',
    nama: 'Omeprazol 40 mg Injeksi',
    kelas: 'penghambat pompa proton parenteral',
    sinonim: ['omeprazole iv', 'ppi injeksi'],
    sediaan: 'vial 40 mg',
    hargaBeli: 14000,
    hargaJual: 26000,
    fornas: true,
  },
  asam_traneksamat_500_inj: {
    id: 'asam_traneksamat_500_inj',
    nama: 'Asam Traneksamat 500 mg Injeksi',
    kelas: 'antifibrinolitik',
    sinonim: ['tranexamic acid', 'kalnex'],
    sediaan: 'ampul 500 mg/5 mL',
    hargaBeli: 6500,
    hargaJual: 13000,
    fornas: true,
  },
  vitamin_k_inj: {
    id: 'vitamin_k_inj',
    nama: 'Fitomenadion (Vitamin K1) 10 mg Injeksi',
    kelas: 'antihemoragik',
    sinonim: ['vitamin k', 'phytomenadione', 'konakion'],
    sediaan: 'ampul 10 mg/mL',
    hargaBeli: 4000,
    hargaJual: 8000,
    fornas: true,
  },
  tamsulosin_04: {
    id: 'tamsulosin_04',
    nama: 'Tamsulosin 0,4 mg',
    kelas: 'penghambat alfa-1 selektif',
    sinonim: ['harnal', 'tamsulosin hcl'],
    sediaan: 'kapsul lepas lambat 0,4 mg',
    hargaBeli: 2500,
    hargaJual: 5000,
    fornas: true,
  },
  tenofovir_300: {
    id: 'tenofovir_300',
    nama: 'Tenofovir Disoproksil Fumarat 300 mg',
    kelas: 'antivirus nukleotida',
    sinonim: ['tdf', 'tenofovir'],
    sediaan: 'tablet 300 mg',
    hargaBeli: 3000,
    hargaJual: 6000,
    fornas: true,
  },
  natrium_bikarbonat_500: {
    id: 'natrium_bikarbonat_500',
    nama: 'Natrium Bikarbonat 500 mg',
    kelas: 'alkalinisasi/koreksi asidosis oral',
    sinonim: ['bicnat', 'sodium bicarbonate'],
    sediaan: 'tablet 500 mg',
    hargaBeli: 300,
    hargaJual: 700,
    fornas: true,
  },
  kalsium_karbonat_500: {
    id: 'kalsium_karbonat_500',
    nama: 'Kalsium Karbonat 500 mg',
    kelas: 'pengikat fosfat/suplemen kalsium',
    sinonim: ['calcium carbonate', 'caco3'],
    sediaan: 'tablet 500 mg',
    hargaBeli: 350,
    hargaJual: 800,
    fornas: true,
  },
  asam_folat_5: {
    id: 'asam_folat_5',
    nama: 'Asam Folat 5 mg',
    kelas: 'vitamin hematopoietik dosis tinggi',
    sinonim: ['folic acid 5 mg'],
    sediaan: 'tablet 5 mg',
    hargaBeli: 200,
    hargaJual: 500,
    fornas: true,
  },
  deferipron_500: {
    id: 'deferipron_500',
    nama: 'Deferipron 500 mg',
    kelas: 'kelator besi',
    sinonim: ['deferiprone', 'ferriprox'],
    sediaan: 'tablet 500 mg',
    hargaBeli: 9000,
    hargaJual: 17000,
    fornas: true,
  },
}

export const LAB_LAB_BATCH4: Record<string, ItemLab> = {
  usg_abdomen: {
    id: 'usg_abdomen',
    nama: 'USG Abdomen',
    biaya: 60000,
    nilaiNormal: 'Organ intraabdomen dalam batas normal; tak ada cairan bebas',
  },
  usg_obstetri: {
    id: 'usg_obstetri',
    nama: 'USG Obstetri',
    biaya: 60000,
    nilaiNormal: 'Kantong gestasi intrauterin sesuai usia kehamilan; plasenta tak menutup ostium',
  },
  foto_toraks: {
    id: 'foto_toraks',
    nama: 'Foto Toraks PA',
    biaya: 70000,
    nilaiNormal: 'Corakan bronkovaskular normal; CTR <0,5; sinus & diafragma baik',
  },
  foto_polos_abdomen: {
    id: 'foto_polos_abdomen',
    nama: 'Foto Polos Abdomen 3 Posisi',
    biaya: 85000,
    nilaiNormal: 'Distribusi udara usus normal; tak ada air-fluid level bertingkat/udara bebas',
  },
  foto_ekstremitas: {
    id: 'foto_ekstremitas',
    nama: 'Foto Polos Ekstremitas 2 Proyeksi',
    biaya: 65000,
    nilaiNormal: 'Kontinuitas korteks utuh; tak tampak garis fraktur/dislokasi',
  },
  tonometri: {
    id: 'tonometri',
    nama: 'Tonometri (Tekanan Intraokular)',
    biaya: 25000,
    nilaiNormal: '10-21 mmHg',
  },
  keton_urin: {
    id: 'keton_urin',
    nama: 'Keton Urin (Dipstik)',
    biaya: 12000,
    nilaiNormal: 'Negatif',
  },
  hbsag: {
    id: 'hbsag',
    nama: 'HBsAg (Rapid)',
    biaya: 30000,
    nilaiNormal: 'Non-reaktif',
  },
  hitung_retikulosit: {
    id: 'hitung_retikulosit',
    nama: 'Hitung Retikulosit',
    biaya: 35000,
    nilaiNormal: '0,5-2,5%',
  },
}

export const TINDAKAN_LAB_BATCH4: Record<string, Tindakan> = {
  pemasangan_kateter_urin: {
    id: 'pemasangan_kateter_urin',
    nama: 'Pemasangan Kateter Urin',
    icd9: '57.94',
    biaya: 45000,
  },
  resusitasi_cairan_kristaloid: {
    id: 'resusitasi_cairan_kristaloid',
    nama: 'Resusitasi Cairan Kristaloid',
    icd9: '99.18',
    biaya: 40000,
  },
  pemantauan_ketat_vital: {
    id: 'pemantauan_ketat_vital',
    nama: 'Pemantauan Ketat Tanda Vital Pra-Rujuk',
    icd9: '89.65',
    biaya: 20000,
  },
  imobilisasi_servikal: {
    id: 'imobilisasi_servikal',
    nama: 'Imobilisasi Servikal (Collar Neck)',
    icd9: '93.52',
    biaya: 35000,
  },
  // --- Dua entri di bawah SENGAJA salah/di luar lingkup FKTP; dipakai hanya
  // sebagai `tindakanSalahUmum`, tidak pernah sebagai `prosedur` benar. ---
  reduksi_manual_hernia: {
    id: 'reduksi_manual_hernia',
    nama: 'Reduksi Manual Paksa Hernia',
    icd9: '96.27',
    biaya: 30000,
  },
  bilas_lambung: {
    id: 'bilas_lambung',
    nama: 'Bilas Lambung',
    icd9: '96.33',
    biaya: 40000,
  },
  pungsi_pleura: {
    id: 'pungsi_pleura',
    nama: 'Pungsi Pleura (Torakosentesis)',
    icd9: '34.91',
    biaya: 90000,
  },
  transfusi_darah_fktp: {
    id: 'transfusi_darah_fktp',
    nama: 'Transfusi Darah di Puskesmas',
    icd9: '99.04',
    biaya: 120000,
  },
}

export const EDUKASI_LAB_BATCH4: Record<string, TopikEdukasi> = {
  diet_tinggi_serat: {
    id: 'diet_tinggi_serat',
    nama: 'Serat & cairan cukup — cegah mengejan',
    kategori: 'diet',
    sinonim: ['serat', 'konstipasi', 'fiber'],
  },
  hindari_mengejan: {
    id: 'hindari_mengejan',
    nama: 'Hindari mengejan & angkat beban berat',
    kategori: 'gaya_hidup',
    sinonim: ['mengejan', 'angkat berat'],
  },
  persiapan_rujukan_operatif: {
    id: 'persiapan_rujukan_operatif',
    nama: 'Persiapan rujukan operatif — puasa & dokumen',
    kategori: 'tindakan',
    sinonim: ['persiapan operasi', 'puasa pra-bedah', 'rujuk bedah'],
  },
  diet_rendah_protein_ginjal: {
    id: 'diet_rendah_protein_ginjal',
    nama: 'Diet ginjal — protein & garam terkendali',
    kategori: 'diet',
    sinonim: ['diet ginjal', 'rendah protein', 'ckd'],
  },
  hindari_obat_nefrotoksik: {
    id: 'hindari_obat_nefrotoksik',
    nama: 'Hindari obat perusak ginjal (NSAID & jamu)',
    kategori: 'kepatuhan',
    sinonim: ['nefrotoksik', 'nsaid ginjal', 'jamu'],
  },
  kepatuhan_antitiroid: {
    id: 'kepatuhan_antitiroid',
    nama: 'Kepatuhan antitiroid & kenali demam-sariawan',
    kategori: 'kepatuhan',
    sinonim: ['antitiroid', 'ptu', 'agranulositosis'],
  },
  perawatan_kaki_diabetik: {
    id: 'perawatan_kaki_diabetik',
    nama: 'Perawatan kaki diabetes sehari-hari',
    kategori: 'higiene',
    sinonim: ['kaki diabetik', 'ulkus kaki', 'alas kaki'],
  },
  dukungan_transfusi_rutin: {
    id: 'dukungan_transfusi_rutin',
    nama: 'Transfusi rutin & kelasi besi — jangan putus',
    kategori: 'kepatuhan',
    sinonim: ['talasemia', 'transfusi', 'kelasi besi'],
  },
  pemantauan_tekanan_bola_mata: {
    id: 'pemantauan_tekanan_bola_mata',
    nama: 'Kontrol tekanan bola mata seumur hidup',
    kategori: 'kepatuhan',
    sinonim: ['glaukoma', 'tekanan bola mata', 'tio'],
  },
  tanda_bahaya_mata: {
    id: 'tanda_bahaya_mata',
    nama: 'Tanda bahaya mata — segera ke IGD',
    kategori: 'gaya_hidup',
    sinonim: ['tirai hitam', 'kilatan cahaya', 'buta mendadak'],
  },
  cegah_penularan_hepatitis_b: {
    id: 'cegah_penularan_hepatitis_b',
    nama: 'Cegah penularan hepatitis B ke keluarga',
    kategori: 'higiene',
    sinonim: ['hepatitis b', 'hbsag', 'vaksin keluarga'],
  },
  pantang_alkohol_hati: {
    id: 'pantang_alkohol_hati',
    nama: 'Pantang alkohol & obat pembebani hati',
    kategori: 'gaya_hidup',
    sinonim: ['alkohol', 'sirosis', 'hati'],
  },
}
