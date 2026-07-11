# Katalog PNPK Kemenkes (2015-2026) — hasil pemetaan 2026-07-10

Sumber: https://kemkes.go.id/id/media/subfolder/pedoman/pedoman-nasional-pelayanan-kedokteran-pnpk/1
(dan /2). Dikatalogkan sekali supaya sesi berikutnya tak perlu scraping ulang untuk tahu
apa saja yang tersedia — hanya perlu update kalau Kemenkes menambah PNPK baru.

83 dokumen individual + 1 bundle "Koleksi Pedoman" (belum dibuka, kemungkinan arahan ke
`repository.kemkes.go.id`, isi belum diverifikasi).

Tier: **1** = match langsung ke kasus PRIMERA (67 kasus + 5 IGD) | **2** = latar/kriteria-rujukan,
tak match 1:1 | **3** = penyakit yang PRIMERA belum punya (kandidat ekspansi M11/M12) |
**4** = di luar skop FKTP (onkologi/gigi/bedah spesialistik/ICU/kongenital).

Tier 1 dan 2 (31 dokumen) sedang diproses oleh workflow `pnpk-crosscheck` (2026-07-10):
unduh → ekstrak teks penuh → distilasi FKTP-relevant → cross-check vs kode PRIMERA aktual.
Hasil ekstraksi tiap dokumen (kalau berhasil) disimpan di `docs/references/pnpk/<slug>/`.

## Tier 1 — match langsung (22, diproses)

| PNPK | Tahun | Kasus PRIMERA | Slug lokal |
|---|---|---|---|
| Tata Laksana Hipertensi Dewasa | 2021 | hipertensi_esensial, mm_hipertensi_urgensi | hipertensi-dewasa |
| Tata Laksana Diabetes Melitus Tipe 2 Dewasa | 2020 | dm_tipe2 | dm-tipe2-dewasa |
| Tata Laksana Gagal Jantung | 2021 | mm_gagal_jantung_kongestif | gagal-jantung |
| Tata Laksana Stroke | 2019 | stroke_iskemik | stroke |
| Tata Laksana Tuberkulosis | 2019 | tb_paru | tuberkulosis |
| Tata Laksana Infeksi Saluran Kemih | 2025 | mm_isk_bawah, kia_isk_kehamilan | infeksi-saluran-kemih |
| Tata Laksana Malaria | 2019 | kia_malaria_falsiparum | malaria |
| Tata Laksana Osteoartritis | 2025 | mm_osteoartritis_lutut | osteoartritis |
| Tata Laksana Obesitas Dewasa | 2025 | mm_obesitas | obesitas-dewasa |
| Tata Laksana Penyakit Paru Obstruktif (PPOK) | 2019 | ppok_eksaserbasi | ppok |
| Tata Laksana Skizofrenia | 2025 | jiwa_skizofrenia | skizofrenia |
| Kedokteran Jiwa | 2015 | jiwa_gangguan_cemas, jiwa_depresi_ringan, jiwa_insomnia | kedokteran-jiwa-2015 |
| Tata Laksana Epilepsi Pada Anak | 2017 | saraf_epilepsi_kejang, igd_kejang_demam | epilepsi-anak |
| Infeksi Dengue Anak dan Remaja | 2021 | dengue_df, igd_dengue_syok | dengue-anak-remaja |
| Tata Laksana Infeksi Dengue Pada Dewasa | 2020 | dengue_df, igd_dengue_syok | dengue-dewasa |
| Tata Laksana Stunting | 2022 | (UKM/keluarga binaan) | stunting |
| Tata Laksana Rinosinusitis Kronik | 2022 | tht_rinosinusitis_akut | rinosinusitis-kronik |
| Tata Laksana Glaukoma | 2023 | mata_glaukoma_akut | glaukoma |
| Tata Laksana Tonsilitis | 2018 | tonsilitis_akut | tonsilitis |
| Tata Laksana Otitis Media Supuratif Kronik | 2018 | otitis_media_akut | omsk |
| Tata Laksana Komplikasi Kehamilan | 2017 | kia_preeklampsia_berat, kia_abortus_iminens | komplikasi-kehamilan |
| Tata Laksana Infeksi Intraabdominal | 2017 | apendisitis_akut | infeksi-intraabdominal |

## Tier 2 — latar/kriteria-rujukan (9, diproses)

| PNPK | Tahun | Kasus terkait (tak langsung) | Slug lokal |
|---|---|---|---|
| Tata Laksana Nyeri | 2019 | mm_mialgia, mm_low_back_pain, apendisitis_akut | nyeri |
| Tata Laksana Sepsis | 2017 | (latar umum) | sepsis-dewasa |
| Tata Laksana Sepsis Pada Anak | 2021 | (latar umum) | sepsis-anak |
| Tata Laksana Trauma | 2017 | (latar IGD) | trauma |
| Tata Laksana Sindroma Koroner Akut | 2019 | mm_hipertensi_urgensi, mm_gagal_jantung_kongestif | sindroma-koroner-akut |
| Tata Laksana Angina Pectoris Stabil | 2023 | mm_hipertensi_urgensi, mm_gagal_jantung_kongestif | angina-pectoris-stabil |
| Tata Laksana Batu Saluran Kemih | 2022 | mm_isk_bawah | batu-saluran-kemih |
| Tata Laksana Perdarahan Saluran Cerna | 2023 | gastritis, gerd, dispepsia_fungsional | perdarahan-saluran-cerna |
| Tata Laksana Osteoporosis | 2023 | mm_osteoartritis_lutut | osteoporosis |

## Tier 3 — kandidat ekspansi M11/M12 (penyakit yang PRIMERA belum punya)

| PNPK | Tahun | Catatan |
|---|---|---|
| Tata Laksana Dermatitis Seboroik | 2019 | Berdekatan dengan klaster kulit_* yang sudah ada |
| Tata Laksana Hepatitis B | 2019 | Tak ada kasus hepatitis di PRIMERA saat ini |
| Tata Laksana Hepatitis C | 2019 | idem |
| Tata Laksana Sirosis Hati pada Dewasa | 2025 | Komplikasi jangka panjang hepatitis/alkohol |
| Tata Laksana Penyakit Ginjal Kronik | 2023 | Komplikasi jangka panjang DM/HT — relevan sbg edukasi lanjutan |
| Tata Laksana Penyakit Ginjal Tahap Akhir | 2017 | idem, tahap lanjut |
| Tata Laksana Retinopati Diabetika | 2023 | Komplikasi mata DM — spesialistik tapi relevan utk edukasi skrining FKTP |

## Tier 4 — di luar skop FKTP (~45, katalog judul saja, tak diproses)

Onkologi: Kanker Payudara (2018), Kanker Serviks (2018), Kanker Prostat (2018), Kanker
Kolorektal (2018), Kanker Paru (2023), Karsinoma Sel Hati (2022), Kanker Nasofaring (2019),
Retinoblastoma (2022), Leukemia Limfoblastik Akut pada Anak (2025), Osteosarkoma (2019),
Kanker Laring (2026).

Gigi/mulut: Karies Gigi (2024), Impaksi Gigi (2022), Pulpa Periradikuler (2023), Penyakit
Periodontal (2025).

Bedah spesialistik/ortopedi/ENT/mata (di luar kompetensi 4A FKTP): Katarak pada Anak (2020),
Katarak pada Dewasa (2018 & 2026), Ulkus Kornea Bakteri (2025), Bibir Sumbing (2019), Fraktur
Kraniomaksilofasial (2021), Skoliosis Idiopatik Remaja (2021), Tuli Sensorineural Kongenital
(2022), Cidera Otak Traumatik (2022), Tumor Otak (2020), Penatalaksanaan Fraktur (2019),
Penyakit Hirschprung (2017).

Hematologi/genetik anak: Hemofilia (2021), Thalasemia (2018).

ICU/anestesi/prosedur: Anestesiologi dan Terapi Intensif (2015 & 2022), Akupunktur Medik (2024),
Tindakan Resusitasi Stabilitasi dan Transpor Bayi Berat Lahir Rendah (2018), Asfiksia (2019).

Lain: Kusta (2019, tak ada kasus di PRIMERA — batas antara Tier 3/4, dianggap rendah-prioritas
krn epidemiologi Kusta terkonsentrasi di wilayah tertentu), Malnutrisi Pada Dewasa (2019),
Sarkopenia (2026).

## Belum dibuka

- **Koleksi Pedoman Kementerian Kesehatan** (link: `/id/koleksi-pedoman-kementerian-kesehatan`,
  mengarah ke `repository.kemkes.go.id`) — kemungkinan bundle/index lebih besar, bisa jadi
  berisi pedoman DI LUAR PNPK (protokol program, pedoman UKM, dst). Belum diverifikasi isinya.
  Cek jika suatu saat butuh referensi Kemenkes di luar PNPK murni.
