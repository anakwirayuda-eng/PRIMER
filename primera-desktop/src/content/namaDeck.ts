/**
 * LABEL DECK DIAGNOSIS — nama yang dipakai HANYA sebagai label pilihan jawaban
 * benar di Deck Diagnosis, Lembar Periksa, dan Panel Hasil.
 *
 * Kenapa ada: label DISTRAKTOR berasal dari sumber kurasi netral (SKDI-144 /
 * NAMA_ICD), sedangkan label JAWABAN BENAR memakai `kasus.nama`. Nama kasus
 * ditulis kaya — memuat derajat, demografi, etiologi dugaan, bahkan narasi
 * temuan — karena ia juga jadi judul di Buku Saku dan debrief. Akibatnya di
 * deck, jawaban benar MENONJOL secara gaya: audit 2026-08-22 menemukan 78 dari
 * 210 kasus di mana hanya jawaban benar yang bergaya begitu, mis. "Penyakit
 * Radang Panggul Berat dengan Curiga Abses Tubo-Ovarium" (62 karakter) melawan
 * "Apendisitis Akut" (16) dan "Kista Ovarium" (13). Mahasiswa bisa memilih opsi
 * TERPANJANG tanpa menalar klinis sama sekali.
 *
 * Kamus ini memotong hiasan itu di deck saja. Nama kasus aslinya TETAP UTUH dan
 * tetap dipakai di Buku Saku/Dex, debrief, rapor, dan laporan — kekayaan
 * naratifnya tidak hilang, hanya berhenti menjadi bocoran saat memilih.
 *
 * Aturan menulis entri baru:
 * - Tetap diagnosis yang BENAR & presisi; jangan generalisir sampai jadi
 *   entitas lain (preseden 2026-07-04: "Hipertensi Urgensi" pernah tertampil
 *   "Hipertensi Esensial" — dua penyakit berbeda).
 * - Buang: penanda demografi, narasi temuan, embel tata laksana, penanda
 *   dugaan/derajat yang tidak membedakan dari distraktor mana pun.
 * - Pertahankan kualifikasi yang MEMBEDAKAN dari distraktor kasus itu.
 * - Setara gaya & panjang dengan distraktornya; Title Case; tanpa em-dash.
 * - Harus SETIA pada kode ICD-10 kasus itu — label yang benar untuk kode
 *   tetangga adalah kesalahan koding yang tercetak di layar (kode ikut tampil
 *   di DeckDiagnosis).
 * - Kasus yang nama aslinya sudah netral & setara TIDAK perlu entri di sini.
 *
 * Dijaga oleh util.test.ts (gaya, tak tertukar distraktor, kunci valid).
 */
export const NAMA_DECK: Record<string, string> = {
  asma_eksaserbasi_berat_anak: 'Asma Eksaserbasi Berat',
  benda_asing_hidung_anak: 'Benda Asing Hidung',
  demam_tifoid: 'Demam Tifoid',
  diare_akut_anak: 'Gastroenteritis Akut',
  diare_akut_bayi_dehidrasi_berat: 'Diare Akut Dehidrasi Berat',
  faringitis_akut: 'Faringitis Akut',
  gerd: 'Refluks Gastroesofagus (GERD)',
  hipoglikemia_ringan_dewasa: 'Hipoglikemia Ringan',
  ispa_common_cold: 'Nasofaringitis Akut (Common Cold)',
  kulit_kandidiasis_kutis: 'Kandidiasis Kutis',
  kulit_pedikulosis_kapitis: 'Pedikulosis Kapitis',
  kulit_pioderma_impetigo: 'Impetigo Krustosa',
  lab_ablasio_retina: 'Ablasio Retina Regmatogen',
  lab_abses_perianal: 'Abses Perianal',
  lab_alergi_makanan_ringan: 'Alergi Makanan',
  lab_anafilaksis_makanan: 'Reaksi Anafilaktik',
  lab_anemia_berat_perlu_transfusi: 'Anemia Defisiensi Besi',
  lab_anemia_defisiensi_besi_nonhamil: 'Anemia Defisiensi Besi',
  lab_apendisitis_akut_anak: 'Apendisitis Akut',
  lab_benda_asing_esofagus: 'Benda Asing Esofagus',
  lab_bronkiolitis_berat: 'Bronkiolitis Akut',
  lab_defisiensi_mineral_zinc: 'Defisiensi Zinc',
  lab_defisiensi_vitamin_b_kompleks: 'Defisiensi Riboflavin',
  lab_dermatitis_kontak_iritan_tangan: 'Dermatitis Kontak Iritan',
  lab_dermatitis_seboroik_dewasa: 'Dermatitis Seboroik',
  lab_dm_tipe1_stabil_prb: 'Diabetes Melitus Tipe 1',
  lab_ektima_tungkai: 'Ektima',
  lab_filariasis_terkonfirmasi: 'Filariasis Limfatik',
  lab_fimosis_patologis_ringan: 'Fimosis Patologis',
  lab_fraktur_tertutup_antebrachii_anak: 'Fraktur Tertutup Lengan Bawah',
  lab_gagal_jantung_dekompensasi: 'Gagal Jantung Akut',
  lab_gizi_buruk_komplikasi: 'Gizi Buruk dengan Komplikasi',
  lab_hemoroid_interna_derajat4: 'Hemoroid Interna Derajat IV',
  lab_herpes_simpleks_labialis: 'Herpes Simpleks Labialis',
  lab_hipertiroid_graves: 'Penyakit Graves',
  lab_ileus_obstruktif: 'Obstruksi Usus Mekanik',
  lab_intoleransi_makanan_laktosa: 'Intoleransi Laktosa',
  lab_katarak_matur: 'Katarak Senilis',
  lab_kehamilan_ektopik_terganggu_suspek: 'Kehamilan Ektopik Terganggu',
  lab_kolik_ureter_obstruksi: 'Batu Ureter Obstruktif',
  lab_leptospirosis_tanpa_komplikasi: 'Leptospirosis',
  lab_malnutrisi_energi_protein_sedang: 'Malnutrisi Energi-Protein Sedang',
  lab_mastoiditis_akut: 'Mastoiditis Akut',
  lab_meningitis_bakterial_suspek: 'Meningitis Bakterial',
  lab_mola_hidatidosa: 'Mola Hidatidosa (Hamil Anggur)',
  lab_moluskum_kontagiosum_anak: 'Moluskum Kontagiosum',
  lab_otitis_media_supuratif_kronik_komplikata: 'OMSK Tipe Bahaya',
  lab_penyakit_radang_panggul_berat: 'Penyakit Radang Panggul',
  lab_perdarahan_gi_atas: 'Perdarahan Saluran Cerna Atas',
  lab_perdarahan_subkonjungtiva: 'Perdarahan Subkonjungtiva',
  lab_pertusis_remaja: 'Pertusis',
  lab_pielonefritis_tanpa_komplikasi: 'Pielonefritis Akut',
  lab_pneumonia_komunitas_dewasa: 'Pneumonia Komunitas',
  lab_pneumotoraks_spontan: 'Pneumotoraks Spontan',
  lab_ppok_eksaserbasi_berat: 'PPOK Eksaserbasi dengan Infeksi',
  lab_puting_lecet: 'Puting Lecet',
  lab_retensio_urin_akut: 'Retensi Urin Akut',
  lab_retinopati_diabetik_proliferatif: 'Retinopati Diabetik',
  lab_sindrom_duh_genital_servisitis: 'Servisitis',
  lab_skistosomiasis_sulteng: 'Skistosomiasis',
  lab_skrofuloderma_suspek: 'Skrofuloderma',
  lab_taeniasis_intestinal: 'Taeniasis',
  lab_talasemia_beta_mayor_anak: 'Talasemia Beta Mayor',
  lab_tb_paru_putus_obat_suspek_mdr: 'TB Paru Resistan Rifampisin',
  lab_tia_serangan_iskemik_sesaat: 'Transient Ischemic Attack (TIA)',
  lab_trauma_abdomen_tumpul: 'Cedera Organ Intraabdomen',
  lab_trauma_tajam_kulit_kepala: 'Trauma Tajam Kulit Kepala',
  lab_trauma_tumpul_kepala_ringan: 'Cedera Superfisial Kulit Kepala',
  lab_trikiasis: 'Trikiasis',
  mata_glaukoma_akut: 'Glaukoma Akut',
  mm_hipertensi_urgensi: 'Hipertensi Urgensi',
  mm_isk_bawah: 'Sistitis Akut',
  mm_low_back_pain: 'Nyeri Punggung Bawah Mekanik',
  pneumonia_balita: 'Pneumonia Berat',
  saraf_epilepsi_kejang: 'Epilepsi, Tidak Spesifik',
  saraf_tension_headache: 'Nyeri Kepala Tipe Tegang',
  saraf_vertigo_bppv: 'Vertigo Posisional Jinak (BPPV)',
  stroke_iskemik: 'Stroke Akut',
  tonsilitis_akut: 'Tonsilitis Akut',
}
