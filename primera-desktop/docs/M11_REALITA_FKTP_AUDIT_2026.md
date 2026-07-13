# M11 Item 7 — Audit Realita FKTP 67/67

**Tanggal keputusan:** 2026-07-13
**Status:** SELESAI untuk 67 kasus playable saat ini
**Sifat perubahan:** lapisan debrief display-only (`catatanRealita`), tanpa perubahan skor, jawaban benar, fingerprint konten, atau `REVISI_ENGINE`.

## Tujuan dan batas

Audit ini menjawab satu pertanyaan sempit: kapan tata laksana ideal yang diajarkan game perlu diberi konteks operasional Puskesmas Indonesia agar pemain tidak menyamakan standar klinis, daftar Fornas, dan stok/fasilitas aktual.

Audit ini **bukan** alasan untuk menurunkan standar keselamatan. Ketiadaan alat, obat, SDM, atau jaringan rujukan harus menghasilkan dokumentasi, jejaring, kontrol lebih ketat, atau rujukan yang sesuai — bukan tebakan, penundaan, maupun substitusi improvisasi.

Hasil akhir:

- 67/67 kasus dinilai satu per satu.
- 14 `catatanRealita` lama direvisi karena terlalu absolut, lekas usang, atau dapat menormalisasi praktik tidak aman.
- 5 catatan baru ditambahkan pada gap yang benar-benar mengubah keputusan pemain.
- 1 kasus (`tb_paru`) sudah cukup dijelaskan oleh `mutiaraEbm`; panel kedua akan duplikatif.
- 47 kasus sengaja tidak diberi catatan tambahan karena tidak memiliki gap struktural unik di luar clue/panduan yang sudah ada.

## Sumber primer yang dipakai

1. [KMK HK.01.07/MENKES/1199/2025 tentang Formularium Nasional](https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/) — sumber Fornas yang berlaku saat audit.
2. [Permenkes 19/2024 tentang Penyelenggaraan Puskesmas](https://jdih.kemkes.go.id/storage/documents/pdfs/2024permenkes019.pdf) — standar alat, laboratorium, dan SDM serta ketentuan pemenuhan bertahap.
3. [Kemenkes: Percepatan Pemenuhan Alat Skrining dan Diagnostik Puskesmas](https://www.kemkes.go.id/id/percepat-penuhi-alat-skrining-dan-diagnostik-di-puskesmas) — rollout alat 2024–2028 dan gap aktual.
4. [Petunjuk Teknis Rencana Kebutuhan Obat](https://farmalkes.kemkes.go.id/wp-content/uploads/2024/03/Petunjuk-Teknis-Rencana-Kebutuhan-Obat.pdf) — stok kosong, lead time, dan ketidakmerataan sebagai masalah perencanaan nyata.
5. [DIPA Kementerian Kesehatan 2025](https://ppid.kemkes.go.id/wp-content/uploads/2024/10/DIPA-Kemenkes-2025.pdf) — target ketersediaan obat esensial Puskesmas 96%, bukan jaminan stok universal.
6. [Dashboard SDM Kesehatan SATUSEHAT](https://satusehat.kemkes.go.id/data/dashboard/c8b80eb9-07bd-4ac9-82c9-13993a360a34) dan [Rencana Kemenkes 2025–2029](https://kms.kemkes.go.id/contents/1781147466787-5344b228c82a971fc5447a467394a896.pdf) — ketidakmerataan sembilan jenis tenaga prioritas.
7. [Rencana Aksi Program Pelayanan Kesehatan Rujukan 2025–2029](https://keslan.kemkes.go.id/lakip_files/RAP%20DITJEN%20KESLAN%202025-2029.pdf) — kendala jaringan, adopsi RME, integrasi SISRUTE, PRB, dan koordinasi obat.
8. [Permenkes 6/2024 tentang Standar Teknis SPM Kesehatan](https://jdih.kemkes.go.id/storage/documents/pdfs/2024permenkes006.pdf) dan [policy brief implementasi USG ANC](https://www.badankebijakan.kemkes.go.id/policy-brief-ir-2024/) — K6, kunjungan dokter/USG, rujukan horizontal, dan variasi jadwal layanan.
9. [Peta Jalan Eliminasi Malaria 2025–2045](https://malaria.kemkes.go.id/sites/default/files/2025-03/20250219100417KMK%20No%20HK%2001%2007%20MENKES%201988%202024%20ttg%20Peta%20Jalan%20Eliminasi%20Malaria%20dan%20Pencegahan%20Penularan%20Kembali%20di%20Indonesia%20Th%202025%202045%20signed.pdf) — layanan/logistik menurut endemisitas dan jejaring fasilitas yang ditunjuk.

### Koreksi sumber lama

`KMK HK.01.07/MENKES/730/2025` bukan Formularium Nasional. Dokumen itu mengatur [nilai klaim harga obat Program Rujuk Balik](https://jdih.kemkes.go.id/documents/keputusan-menteri-kesehatan-nomor-hk0107menkes7302025). Rujukan Fornas item M11 kini dikunci ke KMK 1199/2025. Klaim kandidat lama yang memakai Fornas 2019/2023 tidak boleh disalin tanpa verifikasi ulang.

## Aturan keputusan

1. **Fornas bukan buku stok.** Tercantum di FPKTP berarti boleh/ditanggung sesuai restriksi, bukan pasti ada di setiap rak.
2. **Standar bukan potret universal hari ini.** PMK menetapkan kemampuan yang dituju; pemenuhan alat dan SDM masih bertahap serta berbeda antarwilayah.
3. **Gap alat tidak membenarkan diagnosis tebakan.** Gunakan kemampuan yang tersedia, jejaring spesimen/pemeriksaan, evaluasi ulang, atau rujuk.
4. **Friksi rujukan tidak boleh menjadi alasan menunggu.** Stabilisasi dan aktivasi rujukan berjalan paralel; jalur kontingensi harus ada bila aplikasi/jaringan gagal.
5. **Tidak ada substitusi improvisasi.** Kekosongan satu obat tidak otomatis membenarkan antibiotik sistemik, terapi di luar restriksi, atau regimen profilaksis tanpa protokol.
6. **Panel hanya ditambah bila mengubah perilaku.** Fakta menarik yang tidak mengubah keputusan tetap di `mutiaraEbm`/`panduanResmi` atau tidak ditambahkan agar debrief tidak overload.

## Ledger 67/67

Status: **REVISI** = catatan lama diperbaiki; **TAMBAH** = catatan baru; **CUKUP-MUTIARA** = konteks sudah ada di lapisan lain; **TANPA-CATATAN** = sengaja tidak ditambah.

### Saraf, mata, dan THT (11)

| Kasus | Status | Alasan keputusan |
|---|---|---|
| `saraf_tension_headache` | TANPA-CATATAN | Diagnosis dan terapi primer tidak bergantung alat/obat khusus yang menciptakan gap operasional unik. |
| `saraf_migrain` | TANPA-CATATAN | Game tidak mewajibkan triptan; jalur analgesik dan red flag yang diajarkan tetap realistis di FKTP. |
| `saraf_vertigo_bppv` | TANPA-CATATAN | Dix-Hallpike/Epley adalah keterampilan bedside; catatan fasilitas akan mengulang clue. |
| `saraf_bells_palsy` | TANPA-CATATAN | Steroid dini, proteksi mata, dan red flag rujukan tidak berubah oleh gap sistem khusus. |
| `saraf_epilepsi_kejang` | TANPA-CATATAN | Kasus menilai pengenalan, keselamatan awal, dan rujukan; tidak memaksa EEG on-site atau terapi improvisasi. |
| `mata_konjungtivitis_alergi` | TANPA-CATATAN | Divergensi steroid sudah eksplisit di `panduanResmi`; panel realita tambahan akan duplikatif. |
| `mata_hordeolum` | TANPA-CATATAN | Kompres, higiene, dan kriteria rujuk dapat dilakukan tanpa gap fasilitas bermakna. |
| `tht_serumen_prop` | TANPA-CATATAN | Kontraindikasi irigasi dan teknik aman lebih penting daripada asumsi stok alat lokal. |
| `tht_epistaksis_anterior` | TANPA-CATATAN | Kompresi dan eskalasi rujukan tetap berlaku; variasi material tampon tidak perlu menjadi jawaban terselubung. |
| `tht_rinosinusitis_akut` | TANPA-CATATAN | Masalah utamanya stewardship antibiotik, sudah diajarkan langsung, bukan keterbatasan sistem unik. |
| `mata_glaukoma_akut` | TANPA-CATATAN | Variasi stok obat tidak pernah mengubah urgensi rujukan; panel tambahan berisiko memberi alasan menunda. |

### Kronis dan kegawatan terkait (8)

| Kasus | Status | Alasan keputusan |
|---|---|---|
| `hipertensi_esensial` | REVISI | Menjelaskan rollout EKG/lab tanpa menghapus evaluasi organ target atau mengarang hasil. |
| `dm_tipe2` | TAMBAH | Ketiadaan HbA1c/chemistry analyzer tidak boleh menunda diagnosis yang memenuhi kriteria glukosa; pemeriksaan lanjutan dijejaringkan. |
| `gastritis` | TANPA-CATATAN | Tata laksana dan alarm symptoms tidak bergantung gap fasilitas unik pada skenario ini. |
| `asma_ringan` | TAMBAH | Fornas memuat ICS, tetapi stok/device bervariasi; kekosongan tidak boleh berubah menjadi SABA-tunggal permanen. |
| `otitis_media_akut` | REVISI | Mengganti normalisasi “terkaan bulging” dengan dokumentasi, evaluasi ulang/rujuk, dan stewardship dosis. |
| `anemia_defisiensi_bumil` | TANPA-CATATAN | Hb dan tablet tambah darah adalah layanan inti; gap generik stok tidak mengubah algoritma kasus. |
| `pneumonia_balita` | TANPA-CATATAN | Oksigen/stabilisasi dan rujukan sudah menjadi proses wajib; catatan kekurangan alat dapat menormalisasi omission berbahaya. |
| `stroke_iskemik` | TAMBAH | Mengunci rujukan paralel dengan stabilisasi serta jalur kontingensi saat SISRUTE/jaringan bermasalah. |

### Respirasi dan gastrointestinal (10)

| Kasus | Status | Alasan keputusan |
|---|---|---|
| `bronkitis_akut` | TANPA-CATATAN | Stewardship antibiotik dan suportif sudah jelas tanpa ketergantungan alat khusus. |
| `rinitis_alergi` | TANPA-CATATAN | Diagnosis klinis dan terapi primer tidak memiliki gap sistem unik. |
| `tonsilitis_akut` | TANPA-CATATAN | Keputusan antibiotik berbasis kriteria klinis; panel stok tidak diperlukan. |
| `ppok_eksaserbasi` | TANPA-CATATAN | Penilaian derajat, terapi awal, dan ambang rujuk sudah menjadi inti kasus; variasi stok bersifat generik. |
| `gerd` | TANPA-CATATAN | Alarm symptoms dan trial terapi primer tidak menciptakan mismatch FKTP khusus. |
| `dispepsia_fungsional` | TANPA-CATATAN | Diagnosis kerja dan follow-up tidak bergantung pemeriksaan yang dipaksakan on-site oleh game. |
| `disentri_basiler` | TANPA-CATATAN | Algoritma klinis, hidrasi, dan antibiotik terindikasi sudah cukup; tidak ada workaround fasilitas yang perlu diajarkan. |
| `askariasis` | TANPA-CATATAN | Antelmintik dan edukasi tersedia dalam jalur primer tanpa gap struktural unik. |
| `hemoroid_grade1` | REVISI | Keterbatasan anoskop/kolonoskopi tidak boleh menghasilkan label hemoroid otomatis atau melewatkan red flag. |
| `apendisitis_akut` | TANPA-CATATAN | Ketiadaan imaging di FKTP memperkuat, bukan mengubah, keputusan rujuk berdasarkan klinis. |

### KIA dan jiwa (10)

| Kasus | Status | Alasan keputusan |
|---|---|---|
| `kia_anc_kehamilan_normal` | TAMBAH | PMK 6/2024 mengikat K6, dua kunjungan dokter/USG, dan rujukan horizontal bila kemampuan lokal belum ada. |
| `kia_isk_kehamilan` | TANPA-CATATAN | Antibiotik aman kehamilan dan kontrol kultur/klinis tidak memiliki gap operasional unik pada skenario. |
| `kia_preeklampsia_berat` | TANPA-CATATAN | MgSO4/stabilisasi pra-rujuk adalah standar keselamatan; konteks kekurangan tidak boleh melemahkan kewajiban itu. |
| `kia_abortus_iminens` | REVISI | USG dijaringkan bila tidak tersedia saat itu; progestin empiris tidak menggantikan konfirmasi viabilitas. |
| `kia_kb_konseling` | TANPA-CATATAN | Kasus menguji konseling pemilihan metode, bukan jaminan stok satu produk atau prosedur. |
| `jiwa_gangguan_cemas` | TANPA-CATATAN | Intervensi psikososial dan follow-up dapat diajarkan tanpa membuat asumsi angka SDM yang cepat usang. |
| `jiwa_depresi_ringan` | REVISI | Mengganti statistik layanan yang tak terverifikasi dengan standar SDM bertahap dan jalur task-sharing/rujuk yang aman. |
| `jiwa_insomnia` | TANPA-CATATAN | Higiene tidur/CBT-I principles tidak memerlukan panel sistem tambahan; keterbatasan psikoterapi sudah terwakili di depresi. |
| `jiwa_skizofrenia` | TANPA-CATATAN | Kontinuitas rumatan dan rujukan sudah ada; menambah angka psikiater berisiko cepat usang tanpa mengubah aksi. |
| `kia_malaria_falsiparum` | REVISI | Logistik dan akses tes dibingkai menurut endemisitas; malaria impor harus dijejaringkan, bukan diterapi presumtif. |

### Metabolik dan muskuloskeletal (10)

| Kasus | Status | Alasan keputusan |
|---|---|---|
| `mm_gout_artritis_akut` | REVISI | Fornas mengizinkan kolkisin/NSAID tetapi stok bervariasi; pilihan alternatif wajib berbasis kontraindikasi, bukan “diklofenak selalu ada”. |
| `mm_dislipidemia` | REVISI | Membetulkan kesan simvastatin satu-satunya opsi; intensitas mengikuti indikasi, restriksi, dan formularium aktual. |
| `mm_obesitas` | TANPA-CATATAN | Konseling dan penilaian risiko tidak bergantung alat/obat khusus. |
| `mm_osteoartritis_lutut` | TANPA-CATATAN | Terapi nonfarmakologis dan analgesia primer tidak punya gap struktural unik. |
| `mm_low_back_pain` | TANPA-CATATAN | Fokus red flag dan aktivitas aman; imaging yang tidak rutin justru sesuai praktik primer. |
| `mm_mialgia` | TANPA-CATATAN | Skenario klinis sederhana tanpa ketergantungan sumber daya khusus. |
| `mm_artritis_reumatoid` | TANPA-CATATAN | Kebutuhan DMARD/spesialis sudah tercermin sebagai rujukan; keterlambatan sistem tidak boleh dijadikan terapi pengganti. |
| `mm_hipertensi_urgensi` | TANPA-CATATAN | Konfirmasi TD, eksklusi kerusakan organ, dan penurunan bertahap tetap dapat dilakukan di FKTP. |
| `mm_gagal_jantung_kongestif` | TANPA-CATATAN | Skenario menilai pengenalan dan rujukan; kebutuhan oksigen tetap berbasis hipoksemia, bukan asumsi fasilitas. |
| `mm_isk_bawah` | TANPA-CATATAN | Diagnosis klinis dan terapi primer tidak memaksa pemeriksaan lanjutan on-site. |

### Infeksi (8)

| Kasus | Status | Alasan keputusan |
|---|---|---|
| `ispa_common_cold` | TANPA-CATATAN | Suportif dan larangan antibiotik tidak memerlukan konteks fasilitas tambahan. |
| `faringitis_akut` | TANPA-CATATAN | Kriteria klinis dan stewardship sudah cukup tanpa asumsi tes cepat universal. |
| `dengue_df` | TAMBAH | Rawat jalan mensyaratkan akses kontrol dan serial hematokrit/trombosit sesuai fase/indikasi, bukan rasa aman dari satu hasil lab. |
| `demam_tifoid` | REVISI | Kultur dijejaringkan bila diperlukan; keterbatasan on-site tidak membenarkan Widal tunggal sebagai pengganti. |
| `diare_akut_anak` | TANPA-CATATAN | ORS/zink, derajat dehidrasi, dan rujukan dapat diajarkan tanpa gap sistem unik. |
| `tb_paru` | CUKUP-MUTIARA | `mutiaraEbm` sudah menjelaskan TCM versus BTA dan jejaring spesimen; panel kedua akan mengulang pesan. |
| `skabies` | TANPA-CATATAN | Permetrin, terapi kontak, dan higiene tidak membutuhkan konteks operasional tambahan pada skenario. |
| `konjungtivitis_bakterial` | REVISI | Mengajarkan medication reconciliation tetes mata dan red flag; tidak menormalisasi trial steroid. |

### Kulit (10)

| Kasus | Status | Alasan keputusan |
|---|---|---|
| `kulit_dermatitis_kontak` | TANPA-CATATAN | Eliminasi pencetus dan terapi topikal primer tidak memiliki gap struktural unik. |
| `kulit_tinea_korporis` | TANPA-CATATAN | Diagnosis morfologis dan terapi topikal tetap realistis; KOH bukan syarat mutlak pada gambaran klasik. |
| `kulit_pioderma_impetigo` | REVISI | Restriksi mupirosin diperbarui; stok topikal kosong tidak otomatis membenarkan antibiotik oral. |
| `kulit_urtikaria_akut` | TANPA-CATATAN | Antihistamin, penilaian anafilaksis, dan rujukan tidak bergantung gap fasilitas khusus. |
| `kulit_herpes_zoster` | REVISI | Memperjelas asiklovir FPKTP versus valasiklovir FPKTL dan beban kepatuhan tanpa menyarankan penggantian liar. |
| `kulit_varisela` | REVISI | Kontak rentan memerlukan koordinasi sensitif waktu; profilaksis tidak boleh diimprovisasi tanpa protokol/arahan spesialis. |
| `kulit_kandidiasis_kutis` | REVISI | KOH mengikuti kemampuan lab; terapi empiris dibatasi morfologi klasik dan kegagalan harus dievaluasi ulang. |
| `kulit_pedikulosis_kapitis` | TANPA-CATATAN | Terapi pasien/kontak dan dekontaminasi dapat dilakukan di jalur primer. |
| `kulit_veruka_vulgaris` | TANPA-CATATAN | Pilihan observasi/keratolitik dan rujukan lesi atipikal sudah cukup tanpa klaim stok nitrogen cair. |
| `kulit_morbili` | TANPA-CATATAN | Isolasi, vitamin A, notifikasi, dan red flag tidak berubah karena variasi fasilitas. |

## Pagar implementasi

Tes di `src/engine/m11pengayaan.test.ts` mengunci bahwa:

- sedikitnya 19 kasus memiliki `catatanRealita` setelah audit;
- lima gap prioritas baru tetap ada;
- setiap catatan nonkosong, sudah di-trim, dan maksimal 420 karakter;
- frasa yang menormalisasi tebakan, klaim stok absolut, atau substitusi improvisasi ditolak;
- `mutiaraEbm`, `catatanRealita`, dan `panduanResmi` tetap tidak memengaruhi skor maupun `sidikJariPack`.

Karena lapisan ini display-only, perubahan tidak memerlukan bump `REVISI_ENGINE` dan tidak mengubah replay/save yang sudah ada.
