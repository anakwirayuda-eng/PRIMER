# M13-14 IGD - Paket Adjudikasi Dokter

**Tanggal kompilasi:** 2026-07-22

**Status:** research + compilation only; **bukan persetujuan medis dan tidak mengubah gameplay**

**Snapshot:** 4299c48e6b13+working-tree; content release `class-readiness-2026-07-22`; `REVISI_ENGINE=57`

**Fingerprint:** `92e7300a353df480f12bb2a3a6172d7ec95a011c873dbf83f9658603ee48eb9e`

## Tujuan

Empat belas kasus IGD prototipe sudah tersedia di mode Karier, tetapi sengaja ditandai `lab_prototype_unadjudicated` dan dikeluarkan dari mode Ujian. Paket ini memperkecil pekerjaan dokter menjadi 14 keputusan yang dapat dikerjakan satu per satu tanpa membaca source code.

## Cara review

1. Buka [M13_14_IGD_ADJUDICATION.html](M13_14_IGD_ADJUDICATION.html).
2. Baca vignette, algoritma tiap langkah, disposisi, mutiara klinis, dan tautan sumber.
3. Jawab enam pertanyaan checklist yang sama untuk setiap kasus.
4. Pilih **Setuju**, **Perlu edit**, **Tolak**, atau **Nanti**. Isi catatan bila ada koreksi.
5. Ekspor `M13_14_IGD_DECISIONS.json` sebagai rekam keputusan.

Pilihan **Setuju** berarti seluruh keputusan material pada kasus diterima untuk target pembelajaran FKTP. Flag kompilator hanya pemeriksaan struktur/provenance; flag kosong bukan bukti klinis benar.

## Ringkasan

- Kasus: **14**
- Kasus dengan flag kompilator: **5**
- Semua kasus masih memerlukan adjudikasi manusia: **14**

| # | ID | Diagnosis | ICD-10 | SKDI | Sumber terikat | Flag kompilator |
|---:|---|---|---|---|---|---|
| 1 | `igd_asfiksia_neonatorum` | Asfiksia Neonatorum | P21.0 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); AHA/AAP Neonatal Resuscitation Guidelines 2025 (2025) | Tidak ada flag struktur/provenance otomatis. |
| 2 | `igd_cedera_kepala_sedang` | Cedera Kepala Sedang | S06.9 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); NICE NG232 - Head Injury: Assessment and Early Management (2023) | Belum ada sumber 2024 atau lebih baru pada registry kasus |
| 3 | `igd_eklampsia` | Eklampsia | O15.0 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); WHO Pre-eclampsia Fact Sheet and Recommendations 2025 (2025) | Tidak ada flag struktur/provenance otomatis. |
| 4 | `igd_gigitan_ular_berbisa` | Gigitan Ular Berbisa | T63.0 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); WHO SEARO Guidelines for Management of Snakebites (2016) | Belum ada sumber 2024 atau lebih baru pada registry kasus |
| 5 | `igd_keracunan_organofosfat` | Keracunan Organofosfat | T60.0 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); WHO Clinical Management of Acute Pesticide Intoxication (2008) | Belum ada sumber 2024 atau lebih baru pada registry kasus |
| 6 | `igd_ketoasidosis_diabetik` | Ketoasidosis Diabetik | E10.1 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); Hyperglycemic Crises in Adults - International Consensus Report 2024 (2024) | Tidak ada flag struktur/provenance otomatis. |
| 7 | `igd_luka_bakar_luas` | Luka Bakar Luas | T31.2 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); WHO/ICRC Basic Emergency Care (2018) | Belum ada sumber 2024 atau lebih baru pada registry kasus |
| 8 | `igd_perdarahan_pascasalin` | Perdarahan Pascasalin | O72.1 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); WHO/FIGO/ICM Postpartum Haemorrhage Guideline 2025 (2025) | Tidak ada flag struktur/provenance otomatis. |
| 9 | `igd_pneumotoraks_tension_trauma` | Pneumotoraks Tension Traumatik | S27.0 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); NICE NG39 - Major Trauma: Assessment and Initial Management (2016) | Belum ada sumber 2024 atau lebih baru pada registry kasus |
| 10 | `igd_status_epileptikus` | Status Epileptikus | G41.9 | 3B | PNPK Tata Laksana Epilepsi Dewasa 2026 (2026); ILAE Definition and Classification of Status Epilepticus (2015) | Tidak ada flag struktur/provenance otomatis. |
| 11 | `igd_stroke_iskemik_window` | Stroke Iskemik dalam Jendela Terapi | I63.9 | 3B | KMK 304/2026 - PNPK Tata Laksana Stroke (2026); AHA/ASA Guideline for Acute Ischemic Stroke 2026 (2026) | Tidak ada flag struktur/provenance otomatis. |
| 12 | `igd_sumbatan_jalan_napas_anak` | Sumbatan Jalan Napas Anak | T17.9 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); AHA/AAP Pediatric Basic Life Support 2025 (2025) | Tidak ada flag struktur/provenance otomatis. |
| 13 | `igd_syok_sepsis` | Syok Sepsis | A41.9 | 3B | KMK 342/2017 - PNPK Tata Laksana Sepsis (2017); Surviving Sepsis Campaign Adult Guidelines 2026 (2026) | Tidak ada flag struktur/provenance otomatis. |
| 14 | `igd_tenggelam` | Tenggelam | T75.1 | 3B | KMK 1186/2022 - PPK Dokter di FKTP (indeks publik) (2022); AHA/AAP Focused Update on Drowning 2024 (2024) | Tidak ada flag struktur/provenance otomatis. |

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
- Artefak ini tidak mengubah `activationStatus`. Aktivasi akademik baru boleh dilakukan dari ekspor keputusan dokter yang fingerprint-nya cocok.

## Regenerasi

```powershell
npm run m13:igd-adjudication
```
