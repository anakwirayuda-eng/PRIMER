# M3 CONTENT SPEC — batch kasus + UI SISRUTE

Baca dulu: `src/content/types.ts` (kontrak `KasusKlinis` + `SpesialisasiRs`),
`docs/BUILD_SPECS.md` (skema kasus lama, masih berlaku), `src/content/kasus/kasusInfeksi.ts`
(CONTOH GAYA — tiru struktur & kualitas naratifnya).

## Aturan keras (semua agen konten)

1. TypeScript strict. File-mu `export const KASUS_<X>: KasusKlinis[] = [...]`.
2. **Hanya pakai id dari palet** (obat/lab/edukasi/tindakan) di daftar bawah. Dilarang
   mengarang id baru — kalau butuh yang tak ada, pilih alternatif terdekat dari palet.
3. Tiap kasus WAJIB: `id` (snake_case unik, TIDAK bentrok dgn 16 kasus lama +
   kasus agen lain — pakai prefiks kategorimu), `nama`, `icd10` (asli & benar),
   `skdi`, `kategori`, `fktp144`, `harusDirujuk`, `prevalensi`, `keluhanUtama`,
   `demografi`, `vital`, `anamnesis` (6-9 pertanyaan, 3-5 esensial ber-`oldcarts`,
   1-2 `distraktor`, variasi persona minimal 2-3 pertanyaan kunci: polos+terpelajar
   +cemas/lansia), `pemeriksaanFisik` (4-6, 2-4 relevan), `lab` (0-4, `relevan` jujur),
   `diagnosisBanding` (3-4 ICD-10, SALAH SATUNYA icd10 kasus), `tatalaksana`
   (obatBenar + obatSalahUmum bila ada jebakan klasik + edukasi wajib + prosedur bila
   relevan), `clue` (ber-tag guideline nyata: PPK/Permenkes/PNPK/WHO/Kemenkes).
4. **Kasus wajib-rujuk (`harusDirujuk: true`)**: WAJIB set `spesialisRujukan` (salah
   satu: penyakit_dalam | bedah | anak | obgyn | saraf | mata | tht | jiwa | paru),
   `obatBenar` boleh berisi obat STABILISASI pra-rujuk (mis. ISDN sublingual, O2 via
   prosedur) atau `[]`; sertakan `konsekuensi` (memburuk bila tidak dirujuk).
   `prevalensi: 'rendah'` untuk kasus rujukan (jarang di FKTP).
5. **Prevalensi**: penyakit SANGAT sering di FKTP → `'tinggi'` (mis. ISPA, mialgia,
   dermatitis, dispepsia); sedang → `'sedang'` (default); jarang/rujukan → `'rendah'`.
6. **Akurasi medis P0**: dosis/indikasi/kontraindikasi harus benar. Jebakan klasik jadi
   `obatSalahUmum` dengan `alasan` pedagogis (mis. antibiotik pada viral, NSAID pada
   dispepsia/asma-aspirin, kortikosteroid oral sembarangan). Dialog bahasa Indonesia
   HANGAT & kolokial (boleh bahasa daerah Jawa/Bali ringan) — ASET UTAMA, jangan hambar.
7. **Kedalaman bertingkat** (guardrail): kasus `prevalensi: 'tinggi'` = full depth
   (anamnesis 8-9, variasi kaya, konsekuensi). Kasus `'rendah'` boleh lebih ringkas
   (anamnesis 6, fokus kenali-dan-rujuk/tatalaksana-baku).
8. Hanya tulis file milikmu. Jangan sentuh index.ts/pack/types/katalog (sudah wired).

## PALET — obat (id valid; pilih yang sesuai)
Lama: paracetamol_500, paracetamol_sirup, ibuprofen_400, amoxicillin_500,
amoxicillin_sirup, eritromisin_500, ciprofloxacin_500, kloramfenikol_250,
cotrimoxazole_480, metformin_500, glibenclamide_5, amlodipine_5, amlodipine_10,
captopril_25, hct_25, omeprazole_20, antasida_doen, ranitidin_150, oralit, zinc_20,
salbutamol_2, salbutamol_inhaler, cetirizine_10, ctm_4, dexamethasone_05, prednison_5,
hidrokortison_krim, permetrin_krim, ketokonazol_krim, kloramfenikol_tetes_mata, oat_kdt,
tablet_fe, asam_folat, vitamin_b_kompleks, ambroxol_30, domperidon_10.
M3: natrium_diklofenak_50, asam_mefenamat_500, meloksikam_15, allopurinol_100,
kolkisin_500, tramadol_50, amoxiclav_625, cefadroxil_500, cefixime_100, azitromisin_500,
doksisiklin_100, metronidazol_500, tiamfenikol_500, griseofulvin_500, mikonazol_krim,
asiklovir_400, asiklovir_krim, albendazol_400, pirantel_pamoat,
dihidroartemisinin_piperakuin, simvastatin_20, furosemid_40, bisoprolol_5,
isosorbid_dinitrat_5, ramipril_5, loperamid_2, attapulgit, lansoprazol_30, sukralfat_syr,
ondansetron_4, bisakodil_5, amitriptilin_25, fluoksetin_20, diazepam_2, haloperidol_5,
betahistin_6, flunarizin_5, karbamazepin_200, gentamisin_tetes_mata, timolol_tetes_mata,
air_mata_buatan, oksimetazolin_spray, pseudoefedrin_30, loratadin_10, karbogliserin_tetes,
asam_salisilat_bedak, gentamisin_krim, betametason_krim, kalamin_losion, kalsium_laktat,
metildopa_250, nifedipin_10, mgso4_inj, vitamin_a_kapsul, garam_oralit_zinc.

## PALET — lab
Lama: darah_rutin, widal, ns1_dengue, bta_sputum, gds, gdp, urinalisis, tes_kehamilan,
hb, golongan_darah, asam_urat, kolesterol, malaria_rdt, feses_rutin.
M3: asam_urat_darah, profil_lipid, hba1c, fungsi_ginjal, sgot_sgpt, igm_dengue,
mikroskopis_bta, ekg, proteinuria, tsh.

## PALET — edukasi
Lama: kepatuhan_obat, diet_rendah_garam, diet_dm, cairan_oralit, tanda_bahaya, psn_3m,
kompres_demam, etika_batuk, cuci_tangan, asi_eksklusif, gizi_seimbang, berhenti_merokok,
aktivitas_fisik, kontrol_rutin, minum_oat_tuntas, kebersihan_kulit, hindari_alergen,
istirahat_cukup.
M3: diet_purin, diet_lambung, posisi_tidur_gerd, latihan_bppv, kompres_mata,
jaga_kelembapan_kulit, cuci_seprai_panas, postur_ergonomi, peregangan_sendi,
manajemen_stres, higiene_tidur, kenali_kambuh_jiwa, anc_rutin, tanda_bahaya_kehamilan,
minum_air_cukup, cuci_tangan_makanan, hindari_pencetus_asma, teknik_inhaler,
kepatuhan_kontrol_ptm.

## PALET — tindakan (prosedur)
ekstraksi_serumen, tampon_epistaksis, insisi_abses, hecting_luka, nebulisasi,
pasang_infus, ekstraksi_kuku, manuver_epley.

## PEMBAGIAN FILE (target ±9 kasus/agen, ±45 total)

### `kasus/kasusRespGi.ts` → KASUS_RESPIRASI_GI (respirasi & pencernaan)
bronkitis_akut(4A,tinggi), rinitis_alergi(4A,tinggi), tonsilitis_akut(4A,sedang),
ppok_eksaserbasi(3B,rujuk paru,rendah), gerd(4A,tinggi), dispepsia_fungsional(4A,tinggi),
disentri_basiler(4A,sedang), askariasis(4A,sedang), hemoroid_grade1(4A,sedang),
apendisitis_akut(3B,rujuk bedah,rendah).

### `kasus/kasusKulit.ts` → KASUS_KULIT (dermatologi)
dermatitis_kontak(4A,tinggi), tinea_korporis(4A,tinggi), pioderma_impetigo(4A,sedang),
urtikaria_akut(4A,sedang), herpes_zoster(4A,sedang), varisela(4A,sedang),
kandidiasis_kutis(4A,sedang), pedikulosis_kapitis(4A,sedang), veruka_vulgaris(4A,rendah),
morbili(4A,sedang).

### `kasus/kasusSarafMataTht.ts` → KASUS_SARAF_MATA_THT
tension_headache(4A,tinggi), migrain(4A,sedang), vertigo_bppv(4A,sedang),
bells_palsy(4A,rendah), epilepsi_kejang(3A,rujuk saraf,rendah),
konjungtivitis_alergi(4A,tinggi), hordeolum(4A,sedang), serumen_prop(4A,tinggi),
epistaksis_anterior(4A,sedang), rinosinusitis_akut(4A,sedang),
glaukoma_akut(3B,rujuk mata,rendah).

### `kasus/kasusMetabolikMsk.ts` → KASUS_METABOLIK_MSK (metabolik & muskuloskeletal)
gout_artritis_akut(4A,tinggi), dislipidemia(4A,tinggi), obesitas(4A,sedang),
osteoartritis_lutut(4A,tinggi), low_back_pain(4A,tinggi), mialgia(4A,tinggi),
artritis_reumatoid(3A,rujuk penyakit_dalam,rendah),
hipertensi_urgensi(3B,rujuk penyakit_dalam,rendah),
gagal_jantung_kongestif(3B,rujuk penyakit_dalam,rendah), isk_bawah(4A,tinggi).

### `kasus/kasusKiaJiwa.ts` → KASUS_KIA_JIWA (KIA & jiwa)
anc_kehamilan_normal(4A,tinggi), isk_kehamilan(4A,sedang),
preeklampsia_berat(3B,rujuk obgyn,rendah), abortus_iminens(3B,rujuk obgyn,rendah),
kb_konseling(4A,sedang), gangguan_cemas(4A,sedang), depresi_ringan(4A,sedang),
insomnia(4A,tinggi), skizofrenia(3A,rujuk jiwa,rendah),
malaria_falsiparum(4A,rendah).

Setiap agen: pastikan minimal 2 kasus wajib-rujuk di filemu punya `spesialisRujukan`
yang tersedia di RS (penyakit_dalam/bedah/anak/obgyn/saraf/mata/tht/jiwa/paru — semua
ada di jejaring). Jangan pakai kategori 'gawat' (itu untuk IGD M3.14).
