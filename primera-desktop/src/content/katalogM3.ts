/**
 * KATALOG M3 — perluasan formularium/lab/edukasi untuk kasus batch M3.
 * Dipisah dari katalog.ts agar penulis kasus M3 punya palet lebih luas tanpa
 * menyentuh file inti. Digabung di content/index.ts.
 * Semua obat mengikuti Formularium Nasional (Fornas) tingkat FKTP.
 */

import type { Obat, ItemLab, TopikEdukasi, Tindakan } from './types'

export const OBAT_M3: Record<string, Obat> = {
  // -- Analgetik / antiinflamasi / rematik --
  natrium_diklofenak_50: { id: 'natrium_diklofenak_50', nama: 'Natrium Diklofenak 50 mg', kelas: 'NSAID', golonganAlergi: 'nsaid', sediaan: 'tablet', hargaBeli: 250, hargaJual: 600, fornas: true },
  asam_mefenamat_500: { id: 'asam_mefenamat_500', nama: 'Asam Mefenamat 500 mg', kelas: 'NSAID', golonganAlergi: 'nsaid', sediaan: 'kaplet', hargaBeli: 200, hargaJual: 500, fornas: true },
  meloksikam_15: { id: 'meloksikam_15', nama: 'Meloksikam 15 mg', kelas: 'NSAID', golonganAlergi: 'nsaid', sediaan: 'tablet', hargaBeli: 400, hargaJual: 900, fornas: true },
  allopurinol_100: { id: 'allopurinol_100', nama: 'Alopurinol 100 mg', kelas: 'antihiperurisemia', sediaan: 'tablet', hargaBeli: 150, hargaJual: 400, fornas: true },
  kolkisin_500: { id: 'kolkisin_500', nama: 'Kolkisin 0,5 mg', kelas: 'antigout akut', sediaan: 'tablet', hargaBeli: 900, hargaJual: 1800, fornas: true },
  tramadol_50: { id: 'tramadol_50', nama: 'Tramadol 50 mg', kelas: 'analgetik opioid lemah', sediaan: 'kapsul', hargaBeli: 500, hargaJual: 1100, fornas: true },

  // -- Antibiotik tambahan --
  amoxiclav_625: { id: 'amoxiclav_625', nama: 'Amoksisilin-Klavulanat 625 mg', kelas: 'antibiotik penisilin', golonganAlergi: 'penisilin', sediaan: 'kaplet', hargaBeli: 1200, hargaJual: 2500, fornas: true, antibiotik: true },
  cefadroxil_500: { id: 'cefadroxil_500', nama: 'Sefadroksil 500 mg', kelas: 'antibiotik sefalosporin', golonganAlergi: 'sefalosporin', sediaan: 'kapsul', hargaBeli: 600, hargaJual: 1300, fornas: true, antibiotik: true },
  cefixime_100: { id: 'cefixime_100', nama: 'Sefiksim 100 mg', kelas: 'antibiotik sefalosporin', golonganAlergi: 'sefalosporin', sediaan: 'kapsul', hargaBeli: 900, hargaJual: 1900, fornas: true, antibiotik: true },
  azitromisin_500: { id: 'azitromisin_500', nama: 'Azitromisin 500 mg', kelas: 'antibiotik makrolida', golonganAlergi: 'makrolida', sediaan: 'tablet', hargaBeli: 1500, hargaJual: 3000, fornas: true, antibiotik: true },
  doksisiklin_100: { id: 'doksisiklin_100', nama: 'Doksisiklin 100 mg', kelas: 'antibiotik tetrasiklin', sediaan: 'kapsul', hargaBeli: 400, hargaJual: 900, fornas: true, antibiotik: true },
  metronidazol_500: { id: 'metronidazol_500', nama: 'Metronidazol 500 mg', kelas: 'antibiotik-antiprotozoa', sediaan: 'tablet', hargaBeli: 300, hargaJual: 700, fornas: true, antibiotik: true },
  tiamfenikol_500: { id: 'tiamfenikol_500', nama: 'Tiamfenikol 500 mg', kelas: 'antibiotik', sediaan: 'kapsul', hargaBeli: 500, hargaJual: 1100, fornas: true, antibiotik: true },

  // -- Antijamur / antivirus / antiparasit --
  griseofulvin_500: { id: 'griseofulvin_500', nama: 'Griseofulvin 500 mg', kelas: 'antijamur sistemik', sediaan: 'tablet', hargaBeli: 700, hargaJual: 1500, fornas: true },
  mikonazol_krim: { id: 'mikonazol_krim', nama: 'Mikonazol Krim 2%', kelas: 'antijamur topikal', sediaan: 'krim', hargaBeli: 3000, hargaJual: 6000, fornas: true },
  asiklovir_400: { id: 'asiklovir_400', nama: 'Asiklovir 400 mg', kelas: 'antivirus', sediaan: 'tablet', hargaBeli: 600, hargaJual: 1300, fornas: true },
  asiklovir_krim: { id: 'asiklovir_krim', nama: 'Asiklovir Krim 5%', kelas: 'antivirus topikal', sediaan: 'krim', hargaBeli: 4000, hargaJual: 8000, fornas: true },
  albendazol_400: { id: 'albendazol_400', nama: 'Albendazol 400 mg', kelas: 'antihelmintik', sediaan: 'tablet kunyah', hargaBeli: 500, hargaJual: 1100, fornas: true },
  pirantel_pamoat: { id: 'pirantel_pamoat', nama: 'Pirantel Pamoat 125 mg', kelas: 'antihelmintik', sediaan: 'tablet', hargaBeli: 400, hargaJual: 900, fornas: true },
  dihidroartemisinin_piperakuin: { id: 'dihidroartemisinin_piperakuin', nama: 'DHP (Dihidroartemisinin-Piperakuin)',
    sinonim: ['DHP','ACT','artemisinin'], kelas: 'antimalaria ACT', sediaan: 'tablet', hargaBeli: 0, hargaJual: 0, fornas: true },

  // -- Kardiovaskular / metabolik --
  // golonganAlergi ditambahkan (audit CODEX 2026-07-04): mm_dislipidemia
  // alergiTrap.kelas='statin' menghukum resep ini via SKOR saat alergi, tapi
  // TANPA field ini firewall poka-yoke (clinic.ts TAMBAH_OBAT) tak pernah
  // memblokirnya — pemain bisa meresepkan lolos tanpa peringatan kontraindikasi.
  simvastatin_20: { id: 'simvastatin_20', nama: 'Simvastatin 20 mg', kelas: 'statin', golonganAlergi: 'statin', sediaan: 'tablet', hargaBeli: 200, hargaJual: 500, fornas: true },
  furosemid_40: { id: 'furosemid_40', nama: 'Furosemid 40 mg', kelas: 'diuretik loop', sediaan: 'tablet', hargaBeli: 150, hargaJual: 400, fornas: true },
  bisoprolol_5: { id: 'bisoprolol_5', nama: 'Bisoprolol 5 mg', kelas: 'beta-blocker', sediaan: 'tablet', hargaBeli: 300, hargaJual: 700, fornas: true },
  isosorbid_dinitrat_5: { id: 'isosorbid_dinitrat_5', nama: 'ISDN 5 mg (sublingual)', kelas: 'nitrat', sediaan: 'tablet sublingual', hargaBeli: 200, hargaJual: 500, fornas: true },
  ramipril_5: { id: 'ramipril_5', nama: 'Ramipril 5 mg', kelas: 'ACE-inhibitor', sediaan: 'tablet', hargaBeli: 350, hargaJual: 800, fornas: true },

  // -- Saluran cerna --
  loperamid_2: { id: 'loperamid_2', nama: 'Loperamid 2 mg', kelas: 'antidiare', sediaan: 'tablet', hargaBeli: 200, hargaJual: 500, fornas: true },
  attapulgit: { id: 'attapulgit', nama: 'Attapulgit', kelas: 'adsorben', sediaan: 'tablet', hargaBeli: 150, hargaJual: 400, fornas: true },
  lansoprazol_30: { id: 'lansoprazol_30', nama: 'Lansoprazol 30 mg', kelas: 'PPI', sediaan: 'kapsul', hargaBeli: 500, hargaJual: 1100, fornas: true },
  sukralfat_syr: { id: 'sukralfat_syr', nama: 'Sukralfat Sirup', kelas: 'sitoprotektif', sediaan: 'sirup', hargaBeli: 8000, hargaJual: 15000, fornas: true },
  ondansetron_4: { id: 'ondansetron_4', nama: 'Ondansetron 4 mg', kelas: 'antiemetik', sediaan: 'tablet', hargaBeli: 700, hargaJual: 1500, fornas: true },
  bisakodil_5: { id: 'bisakodil_5', nama: 'Bisakodil 5 mg', kelas: 'laksatif', sediaan: 'tablet salut', hargaBeli: 200, hargaJual: 500, fornas: true },

  // -- Saraf / jiwa --
  amitriptilin_25: { id: 'amitriptilin_25', nama: 'Amitriptilin 25 mg', kelas: 'antidepresan trisiklik', sediaan: 'tablet', hargaBeli: 250, hargaJual: 600, fornas: true },
  fluoksetin_20: { id: 'fluoksetin_20', nama: 'Fluoksetin 20 mg', kelas: 'antidepresan SSRI', sediaan: 'kapsul', hargaBeli: 400, hargaJual: 900, fornas: true },
  diazepam_2: { id: 'diazepam_2', nama: 'Diazepam 2 mg', kelas: 'benzodiazepin', sediaan: 'tablet', hargaBeli: 200, hargaJual: 500, fornas: true },
  haloperidol_5: { id: 'haloperidol_5', nama: 'Haloperidol 5 mg', kelas: 'antipsikotik', sediaan: 'tablet', hargaBeli: 300, hargaJual: 700, fornas: true },
  betahistin_6: { id: 'betahistin_6', nama: 'Betahistin Mesilat 6 mg', kelas: 'antivertigo', sediaan: 'tablet', hargaBeli: 300, hargaJual: 700, fornas: true },
  flunarizin_5: { id: 'flunarizin_5', nama: 'Flunarizin 5 mg', kelas: 'profilaksis migrain', sediaan: 'tablet', hargaBeli: 400, hargaJual: 900, fornas: true },
  karbamazepin_200: { id: 'karbamazepin_200', nama: 'Karbamazepin 200 mg', kelas: 'antiepilepsi', sediaan: 'tablet', hargaBeli: 300, hargaJual: 700, fornas: true },

  // -- Mata / THT / kulit --
  gentamisin_tetes_mata: { id: 'gentamisin_tetes_mata', nama: 'Gentamisin Tetes Mata 0,3%', kelas: 'antibiotik mata', sediaan: 'tetes mata', hargaBeli: 4000, hargaJual: 8000, fornas: true, antibiotik: true },
  timolol_tetes_mata: { id: 'timolol_tetes_mata', nama: 'Timolol Tetes Mata 0,5%', kelas: 'antiglaukoma', sediaan: 'tetes mata', hargaBeli: 9000, hargaJual: 18000, fornas: true },
  air_mata_buatan: { id: 'air_mata_buatan', nama: 'Air Mata Buatan (Hipromelosa)', kelas: 'lubrikan mata', sediaan: 'tetes mata', hargaBeli: 6000, hargaJual: 12000, fornas: true },
  oksimetazolin_spray: { id: 'oksimetazolin_spray', nama: 'Oksimetazolin Semprot Hidung', kelas: 'dekongestan topikal', sediaan: 'semprot hidung', hargaBeli: 7000, hargaJual: 14000, fornas: true },
  pseudoefedrin_30: { id: 'pseudoefedrin_30', nama: 'Pseudoefedrin 30 mg', kelas: 'dekongestan oral', sediaan: 'tablet', hargaBeli: 200, hargaJual: 500, fornas: true },
  loratadin_10: { id: 'loratadin_10', nama: 'Loratadin 10 mg', kelas: 'antihistamin non-sedatif', sediaan: 'tablet', hargaBeli: 250, hargaJual: 600, fornas: true },
  karbogliserin_tetes: { id: 'karbogliserin_tetes', nama: 'Karbogliserin Tetes Telinga 10%', kelas: 'serumenolitik', sediaan: 'tetes telinga', hargaBeli: 5000, hargaJual: 10000, fornas: true },
  asam_salisilat_bedak: { id: 'asam_salisilat_bedak', nama: 'Bedak Salisilat 2%', kelas: 'keratolitik topikal', sediaan: 'bedak', hargaBeli: 3000, hargaJual: 6000, fornas: true },
  gentamisin_krim: { id: 'gentamisin_krim', nama: 'Gentamisin Krim 0,1%', kelas: 'antibiotik topikal', sediaan: 'krim', hargaBeli: 4000, hargaJual: 8000, fornas: true, antibiotik: true },
  betametason_krim: { id: 'betametason_krim', nama: 'Betametason Valerat Krim 0,1%', kelas: 'kortikosteroid topikal', sediaan: 'krim', hargaBeli: 3500, hargaJual: 7000, fornas: true },
  kalamin_losion: { id: 'kalamin_losion', nama: 'Losio Kalamin', kelas: 'antipruritus topikal', sediaan: 'losion', hargaBeli: 4000, hargaJual: 8000, fornas: true },

  // -- KIA / lain --
  kalsium_laktat: { id: 'kalsium_laktat', nama: 'Kalsium Laktat 500 mg', kelas: 'suplemen', sediaan: 'tablet', hargaBeli: 150, hargaJual: 400, fornas: true },
  metildopa_250: { id: 'metildopa_250', nama: 'Metildopa 250 mg', kelas: 'antihipertensi kehamilan', sediaan: 'tablet', hargaBeli: 400, hargaJual: 900, fornas: true },
  nifedipin_10: { id: 'nifedipin_10', nama: 'Nifedipin 10 mg', kelas: 'CCB', sediaan: 'tablet', hargaBeli: 200, hargaJual: 500, fornas: true },
  mgso4_inj: { id: 'mgso4_inj', nama: 'Magnesium Sulfat 40% Injeksi',
    sinonim: ['magnesium sulfat','magnesium sulfate','MgSO4'], kelas: 'antikonvulsan preeklampsia', sediaan: 'ampul', hargaBeli: 8000, hargaJual: 15000, fornas: true },
  vitamin_a_kapsul: { id: 'vitamin_a_kapsul', nama: 'Vitamin A 200.000 IU', kelas: 'suplemen', sediaan: 'kapsul', hargaBeli: 0, hargaJual: 0, fornas: true },
  garam_oralit_zinc: { id: 'garam_oralit_zinc', nama: 'Paket Oralit + Zinc (program)', kelas: 'rehidrasi', sediaan: 'sachet', hargaBeli: 0, hargaJual: 0, fornas: true },

  // -- Tambahan hasil audit medis M3 --
  laktulosa_syr: { id: 'laktulosa_syr', nama: 'Laktulosa Sirup', kelas: 'laksatif osmotik/pelunak tinja', sediaan: 'sirup', hargaBeli: 9000, hargaJual: 17000, fornas: true },
  diazepam_rektal_10: { id: 'diazepam_rektal_10', nama: 'Diazepam Rektal 10 mg', kelas: 'antikonvulsan (rescue bangkitan)', sediaan: 'rektal tube', hargaBeli: 12000, hargaJual: 22000, fornas: true },
  nitrofurantoin_100: { id: 'nitrofurantoin_100', nama: 'Nitrofurantoin 100 mg', kelas: 'antibiotik saluran kemih', sediaan: 'kapsul', hargaBeli: 600, hargaJual: 1300, fornas: true, antibiotik: true },
  primakuin_15: { id: 'primakuin_15', nama: 'Primakuin 15 mg', kelas: 'antimalaria gametosidal', sediaan: 'tablet', hargaBeli: 0, hargaJual: 0, fornas: true },
  ezetimibe_10: { id: 'ezetimibe_10', nama: 'Ezetimibe 10 mg', kelas: 'penghambat absorpsi kolesterol', sediaan: 'tablet', hargaBeli: 1500, hargaJual: 3000, fornas: true },
}

export const LAB_M3: Record<string, ItemLab> = {
  asam_urat_darah: { id: 'asam_urat_darah', nama: 'Asam Urat Darah', biaya: 20000, nilaiNormal: 'L <7 · P <6 mg/dL' },
  profil_lipid: { id: 'profil_lipid', nama: 'Profil Lipid', biaya: 55000, nilaiNormal: 'LDL <100, HDL >40, TG <150' },
  hba1c: { id: 'hba1c', nama: 'HbA1c', biaya: 90000, nilaiNormal: '< 6,5%', hasilBesok: true },
  fungsi_ginjal: { id: 'fungsi_ginjal', nama: 'Ureum/Kreatinin', biaya: 45000, nilaiNormal: 'Kreatinin 0,6-1,2 mg/dL' },
  sgot_sgpt: { id: 'sgot_sgpt', nama: 'SGOT/SGPT', biaya: 45000, nilaiNormal: '< 40 U/L' },
  igm_dengue: { id: 'igm_dengue', nama: 'IgM/IgG Anti-Dengue', biaya: 120000, nilaiNormal: 'Negatif', hasilBesok: true },
  mikroskopis_bta: { id: 'mikroskopis_bta', nama: 'Mikroskopis Gram/KOH', biaya: 25000, nilaiNormal: 'Sesuai klinis' },
  ekg: { id: 'ekg', nama: 'EKG 12 Sadapan', biaya: 40000, nilaiNormal: 'Irama sinus, tanpa iskemia' },
  proteinuria: { id: 'proteinuria', nama: 'Protein Urin (dipstik)', biaya: 10000, nilaiNormal: 'Negatif' },
  tsh: { id: 'tsh', nama: 'TSH', biaya: 85000, nilaiNormal: '0,4-4,0 mIU/L', hasilBesok: true },
}

/**
 * M7 (34b): front-loading + kategori — lihat catatan di katalog.ts.
 * kepatuhan_kontrol_ptm DIHAPUS (kembar sejati kontrol_rutin — dilebur;
 * sinonim "kontrol PTM" pindah ke sana); kasus pemakainya sudah diganti.
 */
export const EDUKASI_M3: Record<string, TopikEdukasi> = {
  diet_purin: {
    id: 'diet_purin', nama: 'Diet rendah purin — batasi jeroan & seafood', kategori: 'diet',
    sinonim: ['asam urat', 'gout'],
  },
  diet_lambung: {
    id: 'diet_lambung', nama: '[Lambung] Hindari pedas, asam & kopi', kategori: 'diet',
    sinonim: ['maag', 'dispepsia', 'gastritis'],
  },
  posisi_tidur_gerd: {
    id: 'posisi_tidur_gerd', nama: '[Lambung] Tinggikan kepala tidur & jangan langsung berbaring', kategori: 'tindakan',
    sinonim: ['refluks', 'GERD', 'head elevation'],
  },
  latihan_bppv: {
    id: 'latihan_bppv', nama: 'Manuver Epley / latihan Brandt-Daroff', kategori: 'tindakan',
    sinonim: ['vertigo', 'pusing berputar', 'reposisi kanalit'],
  },
  kompres_mata: {
    id: 'kompres_mata', nama: '[Mata] Kompres hangat kelopak & jaga higiene', kategori: 'tindakan',
    sinonim: ['hordeolum', 'timbilan', 'bintitan'],
  },
  jaga_kelembapan_kulit: {
    id: 'jaga_kelembapan_kulit', nama: '[Kulit] Jaga kelembapan & hindari garuk', kategori: 'higiene',
    sinonim: ['pelembap', 'moisturizer', 'emolien'],
  },
  cuci_seprai_panas: {
    id: 'cuci_seprai_panas', nama: '[Skabies/kutu] Rendam seprai & handuk air panas', kategori: 'higiene',
    sinonim: ['gudik', 'tungau', 'dekontaminasi'],
  },
  postur_ergonomi: {
    id: 'postur_ergonomi', nama: '[Punggung] Postur & ergonomi angkat beban', kategori: 'tindakan',
    sinonim: ['LBP', 'low back pain', 'cara mengangkat'],
  },
  peregangan_sendi: {
    id: 'peregangan_sendi', nama: '[Sendi] Peregangan & penguatan ringan', kategori: 'tindakan',
    sinonim: ['stretching', 'penguatan otot', 'latihan lutut'],
  },
  manajemen_stres: {
    id: 'manajemen_stres', nama: '[Stres] Relaksasi & manajemen stres', kategori: 'gaya_hidup',
    sinonim: ['napas dalam', 'relaksasi', 'coping'],
  },
  higiene_tidur: {
    id: 'higiene_tidur', nama: '[Tidur] Higiene tidur — jadwal, kurangi layar & kafein', kategori: 'gaya_hidup',
    sinonim: ['insomnia', 'sleep hygiene', 'susah tidur'],
  },
  kenali_kambuh_jiwa: {
    id: 'kenali_kambuh_jiwa', nama: '[Jiwa] Kenali tanda kekambuhan dini', kategori: 'kepatuhan',
    sinonim: ['relaps', 'gejala kambuh'],
  },
  anc_rutin: {
    id: 'anc_rutin', nama: '[Kehamilan] ANC rutin & tablet tambah darah', kategori: 'kia',
    sinonim: ['periksa hamil', 'antenatal', 'TTD'],
  },
  tanda_bahaya_kehamilan: {
    id: 'tanda_bahaya_kehamilan', nama: '[Kehamilan] Tanda bahaya — P4K', kategori: 'kia',
    sinonim: ['preeklamsia', 'perdarahan', 'persiapan persalinan'],
  },
  minum_air_cukup: {
    id: 'minum_air_cukup', nama: 'Minum air cukup & jangan menahan kencing', kategori: 'diet',
    sinonim: ['hidrasi', 'ISK', 'anyang-anyangan'],
  },
  cuci_tangan_makanan: {
    id: 'cuci_tangan_makanan', nama: '[Makanan] Higiene makanan & air matang', kategori: 'higiene',
    sinonim: ['jajan sembarangan', 'air mentah', 'food safety'],
  },
  hindari_pencetus_asma: {
    id: 'hindari_pencetus_asma', nama: '[Napas] Hindari pencetus — debu, dingin, asap', kategori: 'gaya_hidup',
    sinonim: ['asma', 'PPOK', 'tungau debu'],
  },
  hindari_pencetus_migrain: {
    id: 'hindari_pencetus_migrain', nama: '[Migrain] Hindari pencetus — kurang tidur, telat makan, stres, haid', kategori: 'gaya_hidup',
    sinonim: ['nyeri kepala sebelah', 'trigger'],
  },
  teknik_inhaler: {
    id: 'teknik_inhaler', nama: '[Napas] Teknik pakai inhaler yang benar', kategori: 'tindakan',
    sinonim: ['MDI', 'spacer', 'asma', 'semprot'],
  },
}

export const TINDAKAN_M3: Record<string, Tindakan> = {
  ekstraksi_serumen: { id: 'ekstraksi_serumen', nama: 'Ekstraksi serumen', icd9: '96.52', biaya: 30000 },
  tampon_epistaksis: { id: 'tampon_epistaksis', nama: 'Tampon anterior epistaksis', icd9: '21.01', biaya: 45000 },
  insisi_abses: { id: 'insisi_abses', nama: 'Insisi & drainase abses', icd9: '86.04', biaya: 60000 },
  hecting_luka: { id: 'hecting_luka', nama: 'Penjahitan luka (hecting)', icd9: '86.59', biaya: 75000 },
  nebulisasi: { id: 'nebulisasi', nama: 'Nebulisasi bronkodilator', icd9: '93.94', biaya: 40000 },
  pasang_infus: { id: 'pasang_infus', nama: 'Pemasangan infus + rehidrasi', icd9: '38.93', biaya: 50000 },
  ekstraksi_kuku: { id: 'ekstraksi_kuku', nama: 'Ekstraksi kuku (cantengan)', icd9: '86.23', biaya: 55000 },
  manuver_epley: { id: 'manuver_epley', nama: 'Manuver reposisi kanalit (Epley)', icd9: '93.99', biaya: 25000 },
}
