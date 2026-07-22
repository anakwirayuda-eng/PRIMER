# M13-14 IGD - Snapshot Implementasi Pasca-Adjudikasi

**Tanggal kompilasi:** 2026-07-22

**Status:** **14/14 keputusan dokter tercatat dan patch telah diterapkan ke gameplay Karier**

**Snapshot:** d360abc3d7b2+working-tree; content release `igd-adjudication-2026-07-22`; `REVISI_ENGINE=57`

**Fingerprint:** `c5587e95e46ba4989713c8f562dfe1fc42761979ecc54ebb7f15a35939949a66`

## Tujuan

Dokumen ini adalah snapshot yang dapat diaudit dari 14 kasus IGD setelah adjudikasi dokter dan implementasi patch. Seluruh kasus aktif di mode Karier pada release ini dan tetap dikeluarkan dari mode Ujian sampai ada keputusan kurikulum tersendiri.

## Cara verifikasi ulang

1. Buka [M13_14_IGD_ADJUDICATION.html](M13_14_IGD_ADJUDICATION.html).
2. Baca vignette, algoritma tiap langkah, disposisi, mutiara klinis, dan tautan sumber.
3. Gunakan enam pertanyaan checklist yang sama untuk audit ulang bila diperlukan.
4. Kontrol **Setuju**, **Perlu edit**, **Tolak**, atau **Nanti** kini hanya mencatat re-review opsional; keputusan resmi tetap berada di decision log.
5. Ekspor `M13_14_IGD_DECISIONS.json` bila audit ulang menghasilkan koreksi baru.

Pilihan **Setuju** berarti seluruh keputusan material pada kasus diterima untuk target pembelajaran FKTP. Flag kompilator hanya pemeriksaan struktur/provenance; flag kosong bukan bukti klinis benar.

## Ringkasan

- Kasus: **14**
- Kasus dengan flag kompilator: **0**
- Kasus berstatus `physician_approved`: **14**

| # | ID | Diagnosis | ICD-10 | SKDI | Sumber terikat | Flag kompilator |
|---:|---|---|---|---|---|---|
| 1 | `igd_asfiksia_neonatorum` | Asfiksia Neonatorum | P21.0 | 3B | IDAI - Panduan Provider Resusitasi Neonatus Resneo ID 2024 (2024); AHA/AAP Neonatal Resuscitation Guidelines 2025 (2025); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 2 | `igd_cedera_kepala_sedang` | Cedera Kepala Sedang dengan Perburukan Neurologis | S06.9 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); ACS Best Practices Guidelines - Traumatic Brain Injury 2024 (2024); NICE NG232 - Head Injury: Assessment and Early Management (2023); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 3 | `igd_eklampsia` | Eklampsia | O15.0 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); WHO Pre-eclampsia Fact Sheet and Recommendations 2025 (2025); NICE NG133 - Hypertension in Pregnancy (2023); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 4 | `igd_gigitan_ular_berbisa` | Gigitan Ular Berbisa | T63.0 | 3B | BKPK Kemenkes - Pedoman Gigitan dan Sengatan Hewan Berbisa 2025 (2025); Kementerian Kesehatan - Portal Program GHBTB (2026); Kementerian Kesehatan - Investigasi dan Perlindungan Nakes Kasus dr. Icha (2026); WHO SEARO Guidelines for Management of Snakebites (2016); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 5 | `igd_keracunan_organofosfat` | Keracunan Organofosfat | T60.0 | 3B | BKPK Kemenkes - Buku Pedoman Keracunan Alami dan Non Alami 2024 (2024); KMK 1199/2025 - Formularium Nasional (2025); AHA Special Circumstances of Resuscitation 2025 (2025); WHO Clinical Management of Acute Pesticide Intoxication (2008); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 6 | `igd_ketoasidosis_diabetik` | Suspek Ketoasidosis Diabetik Berat pada Dewasa dengan DM Tipe 1 | E10.1 | 3B | PERKENI - Petunjuk Praktis Terapi Insulin 2021 (2021); Hyperglycemic Crises in Adults - International Consensus Report 2024 (2024); ADA Standards of Care - Diabetes Care in the Hospital 2026 (2026); KMK 1199/2025 - Formularium Nasional (2025); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 7 | `igd_luka_bakar_luas` | Luka Bakar Mayor 25% TBSA dengan Suspek Cedera Inhalasi | T31.2 | 3B | KMK 555/2019 - PNPK Tata Laksana Luka Bakar (2019); KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); American Burn Association - Burn Shock Resuscitation 2024 (2024); WHO/ICRC Basic Emergency Care (2018); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 8 | `igd_perdarahan_pascasalin` | Perdarahan Pascasalin Primer dengan Syok, Kemungkinan Atonia Uteri | O72.1 | 3B | KMK 91/2017 - PNPK Tata Laksana Komplikasi Kehamilan (2017); KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); WHO/FIGO/ICM Postpartum Haemorrhage Guideline 2025 (2025); WHO/FIGO/ICM - PPH Implementation Guide 2026 (2026); KMK 1199/2025 - Formularium Nasional (2025); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 9 | `igd_pneumotoraks_tension_trauma` | Pneumotoraks Tensi Traumatik dengan Syok Obstruktif | S27.0 | 3B | KMK 132/2017 - PNPK Tata Laksana Trauma (2017); KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); WHO/ICRC Basic Emergency Care (2018); NICE NG39 - Major Trauma: Assessment and Initial Management (2016); WSES-AAST Thoracic Trauma Guidelines 2025 (2025); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 10 | `igd_status_epileptikus` | Status Epileptikus Konvulsif pada Dewasa | G41.9 | 3B | PNPK Tata Laksana Epilepsi Dewasa 2026 (2026); ILAE Definition and Classification of Status Epilepticus (2015); WHO - Antiseizure Medicines for Established Status Epilepticus 2023 (2023); NICE NG217 - Treating Status Epilepticus, updated 2025 (2025); KMK 1199/2025 - Formularium Nasional (2025); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 11 | `igd_stroke_iskemik_window` | Suspek Stroke Akut dalam Jendela Reperfusi | I64 | 3B | KMK 304/2026 - PNPK Tata Laksana Stroke (2026); AHA/ASA Guideline for Acute Ischemic Stroke 2026 (2026); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 12 | `igd_sumbatan_jalan_napas_anak` | Aspirasi Benda Asing dengan Sumbatan Jalan Napas Berat pada Anak | T17.9 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); AHA/AAP Pediatric Basic Life Support 2025 (2025); Queensland Paediatric Guideline - Inhaled Foreign Body 2025 (2025); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 13 | `igd_syok_sepsis` | Suspek Sepsis dengan Syok, Kemungkinan Sumber Urin | A41.9 | 3B | KMK 342/2017 - PNPK Tata Laksana Sepsis (2017); KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); Surviving Sepsis Campaign Adult Guidelines 2026 (2026); Sepsis-3 International Consensus Definitions (2016); KMK 1199/2025 - Formularium Nasional (2025); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |
| 14 | `igd_tenggelam` | Tenggelam Nonfatal dengan Gagal Napas dan Hipotermia Ringan | T75.1 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); AHA Special Circumstances of Resuscitation 2025 (2025); ANZCOR 11.10 - Resuscitation in Special Circumstances 2026 (2026); Wilderness Medical Society Drowning Guideline 2024 (2024); WHO Global Status Report on Drowning Prevention 2024 (2024); UU 29/2014 - Pencarian dan Pertolongan (2014); Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan (2024) | Tidak ada flag struktur/provenance otomatis. |

## Enam pertanyaan tetap

1. Apakah diagnosis, ICD-10, SKDI, populasi, dan derajat kegawatan konsisten?
2. Apakah urutan ABC/stabilisasi awal benar, tidak menunda tindakan penyelamat nyawa, dan masuk akal di FKTP?
3. Apakah tepat satu opsi benar pada tiap langkah, sedangkan distraktor salah tetapi tetap realistis dan umpan baliknya aman?
4. Apakah disposisi, urgensi, spesialisasi, dan kapabilitas RS tujuan sesuai?
5. Apakah mutiara klinis, panduan resmi, dan sumber cukup mutakhir serta tidak melebih-lebihkan kemampuan Puskesmas Sukamaju?
6. Apakah bahasa vignette, pilihan, dan umpan balik jelas, manusiawi, dan cocok untuk mahasiswa kedokteran?

## Batasan

- Registry sumber membuktikan dokumen mana yang dimaksud, tetapi belum menyediakan locator halaman/paragraf untuk setiap klaim.
- Kesesuaian alat/obat harus dibaca dengan baseline `sukamaju_middle_v1`; ketersediaan nasional bukan jaminan kesiapan setiap hari.
- Keputusan resmi 14/14 tercatat di `M13_14_IGD_DECISION_LOG.md`; kontrol interaktif dalam HTML adalah sarana re-audit, bukan pengganti rekam sign-off.
- Kasus aktif hanya di Karier melalui `reviewStatus`, mode policy, dan `CONTENT_RELEASE`; mode Ujian tetap memakai pool terpisah.

## Regenerasi

```powershell
npm run m13:igd-adjudication
```
