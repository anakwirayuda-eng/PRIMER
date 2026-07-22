# M13-14 IGD - Log Keputusan Dokter

**Reviewer:** dr. Anak Agung Bagus Wirayuda, MD, PhD

**Peran:** Penanggung Jawab Klinis PRIMERA

**Tanggal mulai:** 2026-07-22

**Artefak review:** `M13_14_IGD_ADJUDICATION.html`

## Aturan pencatatan

- Keputusan berasal dari reviewer klinis; CODEX melakukan riset, menyusun rekomendasi, dan mencatatnya.
- `Perlu edit - disetujui` berarti reviewer menyetujui patch specification yang disajikan, bukan menyatakan konten lama sudah benar.
- Aktivasi akademik baru dilakukan setelah semua perubahan diterapkan, artefak diregenerasi, dan gerbang teknis serta editorial lulus.
- Perubahan runtime dikumpulkan menjadi satu content release agar save/fingerprint tidak bergerak 14 kali.

## Kemajuan

| No. | Kasus | Keputusan dokter | Status implementasi |
|---:|---|---|---|
| 1 | `igd_asfiksia_neonatorum` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 2 | `igd_cedera_kepala_sedang` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 3 | `igd_eklampsia` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 4 | `igd_gigitan_ular_berbisa` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 5 | `igd_keracunan_organofosfat` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 6 | `igd_ketoasidosis_diabetik` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 7 | `igd_luka_bakar_luas` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 8 | `igd_perdarahan_pascasalin` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 9 | `igd_pneumotoraks_tension_trauma` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 10 | `igd_status_epileptikus` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 11 | `igd_stroke_iskemik_window` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 12 | `igd_sumbatan_jalan_napas_anak` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 13 | `igd_syok_sepsis` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |
| 14 | `igd_tenggelam` | **Perlu edit - disetujui** | Diterapkan di `igd-adjudication-2026-07-22` |

## IGD-1 - Asfiksia Neonatorum

**Pernyataan reviewer:** `IGD-1: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Patch specification yang disetujui:**

1. Ubah frekuensi ventilasi bantuan dari `40-60/menit` menjadi `30-60/menit` sesuai AHA/AAP 2025.
2. Nyatakan bayi cukup bulan; mulai ventilasi dengan udara ruangan, pasang pulse oximeter preduktal, lalu titrasi oksigen terhadap target berbasis menit kehidupan. Jangan memakai angka SpO2 tanpa waktu pengukuran.
3. Bila HR tetap kurang dari 60/menit setelah 30 detik ventilasi yang benar-benar mengembangkan dada, lakukan langkah koreksi ventilasi dan gunakan airway alternatif bila tersedia serta operator kompeten sebelum/bersamaan dengan kompresi.
4. Kompresi tetap 3:1 bersama ventilasi; naikkan oksigen ke 100 persen bila tersedia tanpa menunda tindakan, lalu titrasi turun setelah ROSC.
5. Bila HR tetap kurang dari 60/menit setelah 60 detik kompresi dan ventilasi adekuat, epinefrin intravaskular menjadi langkah berikutnya.
6. Hapus klaim bahwa kebanyakan bayi dengan presentasi berat ini pulih hanya dengan langkah awal.
7. Nyatakan tujuan transfer sebagai RS dengan kemampuan perawatan neonatus dan tekankan resusitasi berlanjut selama transfer.

**Sumber keputusan:**

- AHA/AAP, *2025 Guidelines for Neonatal Resuscitation*: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation
- Kementerian Kesehatan RI, kurikulum pelatihan resusitasi dan kegawatan neonatus bagi tim FKTP, 2025: https://ditmutunakes.kemkes.go.id/index.php/detail-kurikulum-pelatihan/pelatihan-pelayanan-anc-dengan-deteksi-dini-fokus-preeklampsia-dan-pencegahan-prematuritas-serta-pelayanan-resusitasi-dan-kegawatan-neonatus-bagi-dokter-bidan-dan-perawat-di-fktp/4d7a457a4e7a4d774d7a67744d7a417a4f4330304e444d354c5749314d7a59744d7a637a4e444d344d7a557a4e544d7a
- UKK Neonatologi IDAI, *Panduan Provider Resusitasi Neonatus Resneo ID*, 2024: https://www.idai.or.id/publications/buku-idai/buku-panduan-provider-resusitasi-neonatus-resneo-id-edisi-pertama

## IGD-2 - Cedera Kepala Sedang

**Pernyataan reviewer:** `IGD-2: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Patch specification yang disetujui:**

1. Ubah klasifikasi cedera kepala sedang dari `GCS 9-13` menjadi `GCS 9-12`; ingatkan bahwa GCS bukan satu-satunya ukuran beban cedera.
2. Nyatakan sasaran oksigenasi sebagai `SpO2 >=94%`, bukan pemberian oksigen otomatis tanpa menilai saturasi dan jalan napas.
3. Ganti klaim `GCS serial adalah monitor tekanan intrakranial termurah` dengan penjelasan bahwa GCS dan pupil serial adalah pemantauan neurologis dasar, bukan pengukuran ICP.
4. Ganti `log roll bersama papan` dengan pemiringan en bloc terkoordinasi, stabilisasi servikal manual, dan kesiapan suction; jangan menyiratkan penggunaan spinal board berkepanjangan.
5. Perjelas bahwa diazepam tidak diberikan hanya untuk menenangkan pasien, tetapi analgesia, sedasi prosedural, atau tata laksana jalan napas yang terindikasi tidak boleh ditahan demi mempertahankan angka GCS.
6. Pertahankan larangan hiperventilasi rutin. Ventilasi terkontrol hanya menjadi tindakan penyelamatan singkat pada ancaman herniasi oleh tim kompeten dengan monitoring yang sesuai.
7. Jangan memberi manitol empiris hanya karena muntah. Osmoterapi bukan tindakan wajib kasus ini di FKTP dan hanya dipertimbangkan menurut protokol, kemampuan monitoring, serta tanpa menunda transfer.
8. Nyatakan tujuan sebagai RS dengan CT dan kemampuan trauma/neurosurgical, dengan monitoring, restriksi gerak spinal, serta petugas yang mampu menangani perburukan jalan napas selama transfer.
9. Ganti respons bernada menyalahkan keluarga mengenai biaya dengan penjelasan kegawatan yang empatik serta aktivasi ambulans, JKN, dan dukungan sosial agar biaya tidak menunda keselamatan.
10. Tambahkan ACS Best Practices Guidelines: Traumatic Brain Injury 2024 sebagai sumber mutakhir. TXA tidak dijadikan tindakan wajib FKTP tanpa adjudikasi protokol, waktu cedera, kontraindikasi, dan ketersediaan.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- American College of Surgeons, *Best Practices Guidelines: The Management of Traumatic Brain Injury*, 2024: https://www.facs.org/media/vgfgjpfk/best-practices-guidelines-traumatic-brain-injury.pdf
- NICE, *Head Injury: Assessment and Early Management*, NG232: https://www.nice.org.uk/guidance/NG232/chapter/recommendations
- Brain Trauma Foundation, *Guidelines for Prehospital Management of TBI, 2nd Edition*: https://braintrauma.org/coma/guidelines/pre-hospital-2nd-edition

## Kebijakan tampilan bukti yang disetujui

Reviewer meminta referensi kasus tampil pada penjelasan atau debrief akhir dan dapat dibuka di browser bawaan komputer. Implementasi mengikuti prinsip berikut:

- tampilkan parafrasa keputusan klinis yang singkat sebagai isi utama;
- tampilkan sumber dalam panel ringkas yang tertutup secara default agar tidak menambah beban kognitif;
- bedakan pedoman Indonesia dan EBM internasional, sertakan tahun dan label yang dapat dipahami;
- buka hanya URL HTTPS melalui browser OS, bukan di dalam renderer;
- gunakan kutipan literal secara hemat hanya bila redaksi atau ambang angka sumber perlu dipertahankan secara presisi;
- jangan menampilkan panel sebelum keputusan terakhir bila isinya dapat membocorkan jawaban.

## IGD-3 - Eklampsia

**Pernyataan reviewer:** `IGD-3: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Patch specification yang disetujui:**

1. Definisikan eklampsia sebagai kejang baru pada kehamilan atau pascapersalinan yang berkaitan dengan gangguan hipertensi dan tidak lebih baik dijelaskan oleh penyebab lain; jangan menjadikan koma sebagai kriteria alternatif yang setara dengan kejang.
2. Tegaskan proteksi cedera, posisi lateral kiri, kesiapan suction/jalan napas, larangan memasukkan benda ke mulut, dan larangan menahan ekstremitas secara paksa.
3. Nyatakan regimen loading PPK secara aman: 4 g atau 10 mL MgSO4 40% diencerkan dengan 10 mL air steril, lalu diberikan IV perlahan selama 20 menit. Jangan menyiratkan MgSO4 40% disuntikkan IV tanpa pengenceran.
4. Sebelum dosis lanjutan, pastikan refleks patela ada, frekuensi napas minimal 16/menit, dan produksi urin minimal 0,5 mL/kg/jam. Bila terjadi depresi napas, hentikan MgSO4 dan berikan kalsium glukonas 1 g atau 10 mL larutan 10% IV selama 10 menit sesuai protokol.
5. Tangani tekanan darah 180/115 segera dengan antihipertensi yang sesuai protokol dan kemampuan fasilitas. Bila nifedipin oral digunakan, obat ditelan dan bukan diberikan sublingual. Sasaran awal adalah keluar dari rentang hipertensi berat dengan pemantauan, bukan menurunkan mendadak sampai normal.
6. Jangan menjadikan rumatan MgSO4 selama transfer sebagai kewajiban universal. Bila regimen penuh tidak dapat diberikan dan dipantau secara aman, berikan loading dose lalu transfer segera; bila sumber daya dan pengawalan kompeten tersedia, rumatan dapat dilanjutkan sesuai protokol tanpa menunda transfer.
7. Diazepam hanya menjadi jalan darurat terakhir bila MgSO4 benar-benar tidak tersedia, dengan kesiapan jalan napas dan transfer; bukan alternatif yang setara.
8. Ganti klaim `persalinan adalah terapi definitif` dengan prinsip stabilisasi ibu lebih dahulu, kemudian tim obstetri menentukan waktu dan cara kelahiran menurut keadaan ibu-janin. Jangan menyiratkan eklampsia otomatis berarti seksio sesarea segera.
9. Rujuk ke RS dengan layanan obstetri emergensi dan perawatan neonatus. Oksigen tepat untuk vignette ini karena SpO2 93% dan kejang aktif, bukan kewajiban rutin tanpa menilai oksigenasi.
10. Edema wajah dan tungkai boleh tetap menjadi tekstur vignette, tetapi tidak boleh diajarkan sebagai syarat diagnosis.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- WHO, *Recommendations for Prevention and Treatment of Pre-eclampsia and Eclampsia*: https://www.who.int/publications/i/item/9789241548335
- WHO, *Pre-eclampsia Fact Sheet*, 2025: https://www.who.int/news-room/fact-sheets/detail/pre-eclampsia
- NICE, *Hypertension in Pregnancy: Diagnosis and Management*, NG133: https://www.nice.org.uk/guidance/ng133/chapter/recommendations

## IGD-4 - Gigitan Ular Berbisa

**Pernyataan reviewer:** `oke silakan ditindaklanjuti yg perlu dan dibuat seindah-sejelas mungkin tanpa penuh sesak tanpa cognitive overload` pada 2026-07-22, merujuk rekomendasi `IGD-4 Perlu edit - disetujui` yang langsung mendahuluinya.

**Dossier riset:** `M13_14_IGD4_REALITA_FKTP_RESEARCH.md`

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Ringkasan alasan:** draf lama melepaskan ikatan ketat terlalu dini, menyederhanakan sindrom gigitan ular, menyebut persiapan antihistamin/steroid dengan penekanan yang keliru, merujuk hanya berdasarkan keberadaan antibisa, dan mengikat kasus ke PPK FKTP 1186/2022 yang tidak memuat gigitan ular. Paket revisi juga menambahkan alur konsultasi-rujukan Indonesia, Realita FKTP, perlindungan tenaga kesehatan, pelaporan GHBTB, dan tiga kasus nyata yang disajikan secara etis.

**Patch specification yang diajukan:**

1. Pelepasan ikatan ketat hanya dilakukan terkontrol ketika resusitasi, adrenalin, pemantauan, dan antivenom yang sesuai siap; akses IV saja tidak cukup.
2. Gunakan pendekatan sindromik dan serial, bukan dikotomi viperid-elapid atau identifikasi keluarga yang terlalu pasti.
3. Jangan menggosok, memijat, menginsisi, mengisap, memberi es/ramuan, atau menyuruh keluarga menangkap ular; imobilisasi dan dokumentasikan progresi.
4. Nyatakan perdarahan gusi sebagai envenomasi sistemik yang tidak menunggu 20WBCT atau pemeriksaan lain untuk mulai koordinasi definitif.
5. Antivenom hanya untuk envenomasi yang terindikasi dan harus cocok dengan sindrom/spesies; jangan lakukan skin test rutin.
6. Siapkan adrenalin IM dan resusitasi untuk reaksi antivenom; antihistamin/steroid bukan profilaksis rutin atau pengganti adrenalin.
7. Rujuk berdasarkan kemampuan nyata: produk dan stok antivenom, koagulasi/transfusi, airway/ventilasi, renal support, SDM, dan monitoring; konfirmasi penerimaan.
8. Hapus binding `ppk_fktp_2022`; gunakan WHO 2016, BKPK 2025, portal GHBTB 2026, dan Permenkes 16/2024 sesuai fungsi masing-masing.
9. Tambahkan `Realita FKTP` yang menjelaskan konsentrasi keahlian, distribusi stok, jejaring GHBTB, serta batas klaim "satu-satunya ahli".
10. Tambahkan tiga caselet sumber resmi: Kefamenanu (keselamatan nakes dan otonomi klinis), Samarinda (konsultasi-logistik berhasil), dan Baduy (akses geografis dan stok terpilih).
11. Tambahkan perlindungan nakes menurut UU 17/2023, PP 28/2024, dan Permenkes 13/2025 tanpa menjadikannya alasan meninggalkan tindakan penyelamatan nyawa.
12. Tutup jembatan UKP-UKM melalui pelaporan GHBTB, edukasi tanpa torniket, pemetaan risiko lingkungan/pekerjaan, dan follow-up disabilitas.

**Batas etik:** kasus dr. Icha tidak didramatisasi sebagai NPC atau hubungan sebab tunggal. Tidak ada detail metode bunuh diri. Fakta, dugaan, dan proses hukum dibedakan; sumber resmi dibuka dari panel bukti.

**Keputusan reviewer:** **Perlu edit - disetujui.** Penyajian wajib memakai progressive disclosure: ringkasan utama singkat, tiga caselet dalam panel tertutup, dan sumber berlabel jelas agar pengayaan tidak menambah beban kognitif.

## IGD-5 - Keracunan Organofosfat

**Pernyataan reviewer:** `IGD-5: Keracunan Organofosfat setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` dan patch specification yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** diagnosis, urgensi atropin, perlindungan penolong, dekontaminasi, dan keputusan rujuk sudah tepat. Nilai klinis saat ini sekitar **7,1/10**. Risiko utamanya adalah urutan tindakan yang dapat dibaca sebagai "mandikan dahulu", dosis berbasis "satu ampul", endpoint atropinisasi "paru kering", dan asumsi bahwa pralidoksim semata-mata urusan rumah sakit. Paket di bawah ditargetkan membawa kasus ke **>=8,7/10** tanpa menambah satu babak baru.

**Patch specification yang diajukan:**

1. Ubah langkah pertama menjadi respons tim paralel: gunakan APD; segera lakukan suction, oksigen/ventilasi, dan atropin; pada saat yang sama petugas terlindung melepas serta mengemas pakaian terkontaminasi dan mencuci kulit/rambut dengan sabun-air. Ancaman ABC tidak menunggu dekontaminasi selesai.
2. Ganti istilah `satu ampul` dengan dosis dalam miligram. Untuk pasien dewasa ini, mulai atropin `1-2 mg IV/IO`, lalu gandakan tiap 5 menit menurut respons. Konsentrasi atau isi ampul tidak boleh menjadi satuan klinis.
3. Ganti endpoint `PARU YANG KERING` dengan sasaran yang aman: bronkorea dan bronkospasme terkendali, suara napas/air entry membaik, oksigenasi membaik, serta bradikardia dan perfusi pulih. Ukuran pupil dan pengeringan seluruh sekret bukan sasaran.
4. Setelah atropinisasi awal, pertahankan efek dengan infus atropin yang dititrasi bila pompa, monitoring, dan petugas kompeten tersedia. Bila tidak, gunakan bolus ulang bertitrasi sesuai protokol sambil mempercepat transfer; jangan mengimprovisasi infus yang tidak dapat diawasi.
5. Tambahkan kesiapan bag-valve-mask dan airway definitif dini bila ventilasi gagal. Atropin mengatasi efek muskarinik tetapi tidak membalikkan paralisis nikotinik. Bila intubasi diperlukan, hindari suksinilkolin dan mivakurium karena blokade dapat memanjang.
6. Revisi kalimat pralidoksim: terapi ini layak dipertimbangkan dini pada keracunan organofosfat berat, tetapi efektivitasnya bergantung senyawa dan ketersediaannya tidak boleh diasumsikan di Sukamaju. Konsultasi dan transfer ke fasilitas mampu dilakukan tanpa menunda atropin, airway, atau dekontaminasi.
7. Perjelas APD dan dekontaminasi: sarung tangan tahan bahan kimia, apron/gown, dan pelindung mata sesuai risiko; pakaian dilepas dan dikemas tertutup; kulit serta rambut dicuci sabun-air; cegah kontaminasi staf, ruangan, ambulans, dan limpasan air.
8. Jangan membawa botol pestisida terkontaminasi secara lepas. Utamakan foto label; bila wadah perlu dibawa, segel/double-bag secara aman. Catat bahan aktif, konsentrasi, rute, waktu, dan perkiraan jumlah paparan.
9. Pertahankan bilas lambung/arang aktif sebagai jawaban salah hanya untuk paparan dermal pada vignette ini. Umpan balik tidak boleh mengajarkan bahwa dekontaminasi gastrointestinal selalu dilarang; bilas lambung berisiko besar, sedangkan arang aktif hanya dipertimbangkan pada keadaan tertelan yang terpilih dan jalan napas aman.
10. Perjelas risiko sindrom perantara sebagai kelemahan leher/proksimal dan otot napas yang dapat timbul setelah krisis kolinergik tampak mereda. Karena itu pasien memerlukan observasi serta dukungan ventilasi rumah sakit, bukan dipulangkan setelah sekret terkendali.
11. Rujuk berdasarkan kapabilitas nyata: kemampuan airway/ventilasi, monitoring berkelanjutan, stok atropin yang cukup, pemberian rumatan, konsultasi toksikologi, oksim bila terindikasi/tersedia, dan perawatan intensif. Konfirmasi penerimaan dan teruskan terapi selama transfer terpantau.
12. Tutup jembatan UKP-UKM: setelah stabilisasi, pastikan apakah paparan kerja, kecelakaan, atau disengaja; lakukan penilaian psikososial privat bila relevan; telusuri rekan kerja yang ikut terpapar; koordinasikan pelaporan sesuai jalur daerah; dan berikan pencegahan tanpa menyalahkan petani (APD, baca label, jangan menyemprot melawan angin, simpan di wadah asli jauh dari pangan/air/anak).
13. Hapus binding generik `ppk_fktp_2022` karena PPK 1186/2022 tidak menyediakan bab khusus organofosfat. Gunakan Buku Pedoman Keracunan Kemenkes 2024 sebagai konteks Indonesia, AHA 2025 sebagai algoritme mutakhir, WHO 2008/2026 untuk layanan berjenjang dan paparan kimia, Fornas 1199/2025 untuk ketersediaan normatif atropin, serta Permenkes 16/2024 untuk rujukan.

**Realita FKTP yang diajukan, versi layar utama:**

> Atropin injeksi tercantum dalam Formularium Nasional untuk FKTP, tetapi tercantum tidak sama dengan stok bedside yang cukup untuk keracunan berat; kebutuhan dosis dapat jauh melebihi pemakaian bradikardia biasa. Pralidoksim tidak diasumsikan tersedia di Sukamaju, dan sistem poison center nasional masih dalam tahap penguatan. Karena itu tim harus mengobati sindrom kolinergik segera, mengenali keterbatasan fasilitas, mengidentifikasi bahan aktif dengan aman, dan mengonfirmasi RS yang mampu melanjutkan airway, atropin, oksim, serta pemantauan. Setelah pasien selamat, kasus kembali ke UKM: cari paparan bersama, perbaiki praktik kerja dan penyimpanan, serta koordinasikan pelaporan lintas sektor.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: empat pesan saja - `lindungi tim`, `ABC + atropin segera`, `titrasi pada respons`, `rujuk sambil terapi berjalan`.
- Panel `Realita FKTP`: tertutup secara default; memuat ketersediaan atropin, keterbatasan oksim/poison center, dan jembatan UKM.
- Panel `Bukti klinis`: sumber berlabel Indonesia/internasional dan dapat dibuka melalui browser OS setelah kasus selesai.
- Detail regimen, airway, dan pelaporan tidak dimasukkan ke label tombol; detail muncul pada umpan balik atau panel bukti setelah keputusan.

**Catatan sumber dan keterbatasan:**

- AHA 2025 memberi rekomendasi kuat untuk atropin segera, airway dini, APD, dan dekontaminasi; pralidoksim dinilai reasonable pada keracunan organofosfat berat. Dosis tabel AHA adalah atropin dewasa 1-2 mg, digandakan tiap 5 menit.
- Buku Kemenkes 2024 mencantumkan atropin dewasa 2-4 mg IV tiap 5-10 menit dan pralidoksim, tetapi bukan PNPK/PPK serta memiliki inkonsistensi dosis pediatrik internal. Ia dipakai untuk konteks Indonesia, bukan disalin sebagai algoritme tanpa tapis.
- Fornas 1199/2025 mencantumkan atropin injeksi 0,25 mg/mL pada FPKTP dan FPKTL. Pencarian teks dokumen yang ditinjau tidak menemukan pralidoksim; ini mendukung keputusan untuk tidak mengasumsikan stok lokal, bukan membuktikan obat mustahil tersedia lewat jalur lain.
- BKPK masih mencantumkan inisiasi virtual poison center sebagai pertanyaan kebijakan. Game tidak boleh berpura-pura bahwa satu nomor konsultasi toksikologi nasional sudah selalu operasional.

**Sumber keputusan:**

- AHA, *2025 Guidelines - Organophosphates and Carbamates*: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation
- AHA, *Table 4 - Commonly Used Doses of Antidotes*: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation/content/guidelines-accordion/toxicology-nested-section/table-4
- WHO, *Clinical Management of Acute Pesticide Intoxication*, 2008: https://www.who.int/publications/i/item/9789241597456
- WHO, *Interim Clinical Guidance for Toxic Chemical Exposures*, 2026: https://www.who.int/brunei/news/detail-global/04-06-2026-empowering-health-care-workers-to-save-lives-after-toxic-chemical-exposures--who-interim-clinical-guidance
- BKPK Kemenkes, *Buku Pedoman Keracunan Alami dan Non Alami*, 2024: https://repository.badankebijakan.kemkes.go.id/id/eprint/5608/
- Kementerian Kesehatan RI, *Fornas 1199/2025*: https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/
- BKPK Kemenkes, *Policy Questions - Virtual Poison Center*: https://www.badankebijakan.kemkes.go.id/policy-question/
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- BPOM, *Analisis Data Kasus Keracunan Obat dan Makanan 2024*: https://pusakom.pom.go.id/riset-kajian/detail/analisis-data-kasus-keracunan-obat-dan-makanan-tahun-2024

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-5 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-6 - Ketoasidosis Diabetik pada Dewasa

**Pernyataan reviewer:** `yes dan lanjut` pada 2026-07-22, merujuk rekomendasi `Perlu edit - disetujui` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** urutan besar kasus sudah benar: kenali krisis hiperglikemik, pulihkan volume, jangan memulai insulin tanpa mengetahui dan mampu memantau kalium, hindari bikarbonat rutin, lalu rujuk dengan cairan tetap berjalan. Nilai klinis saat ini sekitar **8,0/10**. Kekurangannya bukan perubahan arah terapi, melainkan diagnosis yang terlalu definitif tanpa bukti asidosis, cairan yang dikunci hanya ke NaCl 0,9%, penjelasan fisiologi insulin yang berlebihan, tujuan rujukan yang masih berbasis nama spesialis, dan pemicu `insulin habis` yang belum ditutup kembali ke kontinuitas UKP-UKM. Paket di bawah ditargetkan membawa kasus ke **>=9,0/10**.

**Patch specification yang diajukan:**

1. Tegaskan bahwa pasien dewasa ini diketahui memiliki **DM tipe 1** agar ICD `E10.1`, kebutuhan insulin basal, dan populasi algoritme tidak disimpulkan hanya dari usia muda serta kata `insulin-dependent`.
2. Pada fase sebelum pemeriksaan asam-basa tersedia, gunakan istilah **suspek KAD berat/krisis hiperglikemik dengan ketosis**, bukan diagnosis biokimia final. Ajarkan tiga komponen diagnosis KAD: diabetes atau hiperglikemia, ketosis, dan asidosis metabolik. GDS 480 mg/dL, keton urin kuat, Kussmaul, dehidrasi, dan gangguan kesadaran cukup untuk tindakan serta rujukan emergensi, tetapi tidak membuktikan komponen asidosis tanpa pH atau bikarbonat.
3. Ubah langkah pertama menjadi `nilai ABC, lindungi jalan napas dari aspirasi, pasang sekurangnya satu akses IV yang andal, dan mulai kristaloid isotonik`. Akses kedua boleh dipasang bila mudah dan tidak menunda transfer, tetapi tidak dijadikan ritual wajib.
4. Jangan mengunci cairan ke NaCl 0,9%. Pada dewasa tanpa gangguan jantung atau ginjal, gunakan **NaCl 0,9% atau kristaloid seimbang sesuai stok/protokol**, umumnya 500-1.000 mL/jam pada 2-4 jam awal dengan penilaian ulang tekanan darah, nadi, perfusi, kesadaran, input-output, dan risiko overload. Pada vignette ini, satu liter awal lalu reassessment tetap masuk akal.
5. Pertahankan jawaban salah `insulin bolus besar hanya karena GDS 480`, tetapi ganti umpan balik lama. Bahaya utamanya adalah insulin dimulai tanpa mengetahui/mengoreksi kalium dan tanpa monitoring memadai, bukan klaim sederhana bahwa insulin `menarik air ke dalam sel lalu memperdalam syok`. Di fasilitas mampu, insulin diberikan setelah cairan awal berjalan dan kalium dinilai; di Sukamaju yang tidak dapat memeriksa serta memantau kalium, lanjutkan cairan dan transfer tanpa insulin improvisasi.
6. Ganti kalimat absolut `kalium tidak pernah diberikan bolus` menjadi instruksi presisi: **jangan memberikan kalium sebagai IV push atau penggantian cepat tanpa data**. Kalium diberikan sebagai infus terkontrol menurut kadar serum, fungsi ginjal/diuresis, ECG bila tersedia, dan protokol; insulin ditunda bila kalium terlalu rendah.
7. Pertahankan larangan bikarbonat rutin. Jelaskan pada debrief bahwa bikarbonat hanya dipertimbangkan pada asidosis sangat berat, sekitar `pH <7,0`, di fasilitas dengan monitoring; napas Kussmaul saja tidak cukup menjadi indikasi.
8. Jangan menjadikan turunnya GDS atau keton urin sebagai endpoint resolusi. Resolusi KAD dinilai dengan pulihnya keton darah dan asidosis (`beta-hydroxybutyrate`, pH atau bikarbonat); glukosa dapat turun lebih dahulu, dan keton urin dapat tampak menetap atau meningkat ketika beta-hydroxybutyrate berubah menjadi asetoasetat.
9. Karena SpO2 98%, pertahankan **tanpa oksigen rutin**. Lakukan monitoring, suction/kesiapan airway, serta eskalasi ventilasi hanya bila oksigenasi atau ventilasi gagal. Gangguan kesadaran menjadikan pasien ini kandidat layanan intensif dan meningkatkan risiko aspirasi.
10. Ubah tujuan rujukan dari sekadar `RS dengan penyakit dalam` menjadi RS yang telah mengonfirmasi penerimaan dan mampu melakukan pemeriksaan serial kalium, glukosa, pH/bikarbonat dan keton; infus insulin dengan pompa/protokol; monitoring ECG serta diuresis; perawatan airway; dan ICU bila gangguan kesadaran menetap. Cairan, catatan jumlah masuk, respons klinis, hasil GDS/keton, waktu dosis insulin terakhir, serta obat pasien ikut dalam handoff.
11. Telusuri pencetus tanpa menunda transfer: putusnya insulin, infeksi, infark/iskemia, stroke, pankreatitis, obat tertentu termasuk SGLT2 inhibitor, kehamilan bila relevan, dan masalah psikososial. Jangan menerima `obat habis` sebagai akhir anamnesis atau menyalahkan pasien.
12. Tutup jembatan UKP-UKM: setelah stabil, cari mengapa insulin habis (stok, resep/PRB-JKN, biaya, jarak, transport, jam layanan, alat suntik, penyimpanan/cold chain, atau distress); pulihkan suplai insulin dan alat monitoring sebelum pulang; ajarkan sick-day rules, jangan menghentikan insulin basal tanpa rencana klinis, tanda bahaya, pemeriksaan keton bila tersedia, serta jalur kontak cepat. Buat callback ke pengelolaan logistik Puskesmas bila masalahnya sistemik atau dialami pasien lain.
13. Hapus `ppk_fktp_2022` sebagai binding langsung algoritme KAD. KMK 1186/2022 memuat DM tipe 2 dan HHNK, tetapi tidak menyediakan protokol KAD tersendiri. Gunakan PERKENI 2021 sebagai pedoman profesi Indonesia yang langsung membahas krisis hiperglikemik; pakai konsensus internasional 2024 dan ADA Standards of Care 2026 untuk pembaruan diagnosis, cairan, monitoring, serta pencegahan kekambuhan; gunakan Fornas 1199/2025 hanya untuk ketersediaan normatif insulin dan Permenkes 16/2024 untuk logika rujukan berbasis kemampuan.

**Realita FKTP yang diajukan, versi layar utama:**

> Insulin regular dan NPH tercantum dalam Formularium Nasional untuk pelayanan tingkat pertama, tetapi tercantum tidak menjamin stok pasien tidak pernah putus dan tidak berarti Puskesmas otomatis mampu menjalankan infus insulin KAD. Terapi ini memerlukan pemeriksaan kalium dan asam-basa, pemantauan glukosa serial, pompa atau protokol infus, serta petugas yang dapat merespons hipokalemia, hipoglikemia, dan perburukan jalan napas. Di Sukamaju, tindakan aman adalah mengenali suspek KAD, memulai kristaloid isotonik, menjaga ABC, mengonfirmasi RS yang mampu, dan mengirim pasien dengan terapi serta monitoring berlanjut. Setelah selamat, `insulin habis` harus menjadi masalah sistem yang ditutup, bukan kesalahan pasien yang dilupakan.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: empat pesan - `curigai KAD, jangan menunggu semua hasil`, `cairan + ABC dahulu`, `insulin hanya dengan kalium dan monitoring`, `rujuk sambil terapi berjalan`.
- Panel `Realita FKTP`: tertutup secara default; memuat batas kemampuan infus insulin dan jembatan akses insulin.
- Panel `Bukti klinis`: tampil setelah kasus selesai; pisahkan pedoman Indonesia, EBM internasional, ketersediaan obat, dan regulasi rujukan.
- Detail angka kalium, kriteria resolusi, dan sick-day rules ditempatkan pada umpan balik/panel bukti, bukan dijejalkan ke label pilihan.

**Catatan sumber dan keterbatasan:**

- Konsensus internasional 2024 mendefinisikan KAD dengan tiga komponen: diabetes/hiperglikemia, ketosis, dan asidosis. Ia menerima NaCl 0,9% maupun kristaloid seimbang serta menyarankan 500-1.000 mL/jam pada 2-4 jam awal untuk dewasa tanpa gangguan jantung atau ginjal.
- Konsensus 2024 menunda insulin bila kalium kurang dari 3,5 mmol/L, tidak merekomendasikan bikarbonat rutin, dan hanya mempertimbangkannya pada `pH <7,0`. Resolusi memerlukan perbaikan keton dan asidosis, bukan sekadar GDS kurang dari 200 mg/dL.
- ADA Standards of Care 2026 kembali menegaskan bahwa seluruh kriteria harus terpenuhi untuk diagnosis formal dan meminta edukasi pencegahan KAD/HHS dalam perencanaan pulang.
- PERKENI 2021 memberi konteks Indonesia yang langsung membahas KAD, tetapi beberapa angka dan langkahnya mendahului konsensus 2024. Ia dipakai sebagai baseline lokal dan ditapis dengan EBM terbaru, bukan disalin tanpa pembaruan.
- Fornas 1199/2025 membuktikan ketersediaan normatif human insulin di FPKTP, bukan stok aktual, kesinambungan rantai pasok, atau kesiapan menjalankan protokol KAD.

**Sumber keputusan:**

- PERKENI, *Pedoman Petunjuk Praktis Terapi Insulin pada Pasien Diabetes Melitus*, 2021: https://pbperkeni.or.id/wp-content/uploads/2021/11/22-10-21-_-Website-Pedoman-Petunjuk-Praktis-Terapi-Insulin-Pada-Pasien-Diabetes-Melitus-Ebook.pdf
- ADA/EASD/JBDS/AACE/DTS, *Hyperglycemic Crises in Adults With Diabetes: A Consensus Report*, 2024: https://www.diabetes.org.uk/sites/default/files/2024-07/Hyperglycaemic%20Crisis%20Global%20Consensus.pdf
- ADA, *Diabetes Care in the Hospital: Standards of Care in Diabetes - 2026*: https://diabetesjournals.org/care/article/49/Supplement_1/S339/163925/16-Diabetes-Care-in-the-Hospital-Standards-of-Care
- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022 (ditinjau untuk batas provenance): https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- Kementerian Kesehatan RI, *Fornas 1199/2025*: https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-6 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-11 - Suspek Stroke Akut dalam Jendela Reperfusi

**Pernyataan reviewer:** `setuju next` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** pengenalan FAST, saksi onset, pemeriksaan glukosa, larangan aspirin sebelum CT, larangan neuroprotektor, pra-notifikasi, dan pilihan RS ber-CT sudah kuat. Nilai klinis saat ini sekitar **7,9/10**. Dua cacat materialnya adalah subtipe `iskemik/I63.9` ditetapkan sebelum pencitraan dan jawaban tekanan darah mengajarkan larangan absolut dengan fisiologi penumbra yang terlalu disederhanakan. Kasus juga belum menutup perjalanan akut ke rehabilitasi, pencegahan sekunder, dan perbaikan sistem rujukan. Paket di bawah ditargetkan membawa kasus ke **>=9,1/10**.

**Patch specification yang diajukan:**

1. Pertahankan id teknis untuk kompatibilitas, tetapi ubah label klinis fase FKTP dari `Stroke Iskemik dalam Jendela Terapi/I63.9` menjadi **`Suspek Stroke Akut dalam Jendela Reperfusi/I64`** sampai CT. Ini menyamakan IGD dengan kasus poli `stroke_iskemik` yang sudah diadjudikasi pada M13-0B. CT kepala nonkontras membedakan iskemik dan perdarahan; gejala klinis saja tidak boleh menetapkan subtipe.
2. Bedakan dan dokumentasikan tiga waktu bila relevan: `last known well`, waktu gejala pertama ditemukan, dan waktu onset yang disaksikan. Pada vignette ini onset disaksikan pukul 07.00 dan kedatangan pukul 08.30, sehingga jendela 90 menit valid. Simpan nomor saksi agar tim stroke dapat mengonfirmasi bila keluarga terpisah selama transfer.
3. Ubah umpan balik glukosa dari `menyingkirkan peniru stroke` menjadi **menyingkirkan hipoglikemia sebagai salah satu mimic yang cepat dibalik**. GDS 132 mg/dL tidak membuktikan stroke iskemik dan tidak menyingkirkan kejang pascaiktal, migrain, toksik-metabolik, tumor, atau mimic lain; evaluasi tambahan tidak boleh menunda rujukan.
4. Lakukan pemeriksaan neurologis singkat yang dapat diulang: FAST/defisit fokal, kesadaran, pupil, gaze, bahasa, lengan dan tungkai, serta skrining keparahan/LVO yang telah dilatih. NIHSS lengkap atau pemeriksaan panjang tidak boleh menjadi syarat keberangkatan dari FKTP.
5. Karena SpO2 97%, pertahankan **tanpa oksigen rutin**. Jaga ABC, hindari hipoksia dan hipotensi, serta berikan kristaloid hanya bila dehidrasi, pra-syok, atau syok. Jangan menggunakan cairan dekstrosa kecuali untuk hipoglikemia.
6. Tambahkan `NPO sampai skrining menelan`: jangan memberikan makanan, minuman, atau obat oral, termasuk aspirin dan antihipertensi oral, sebelum kemampuan menelan dinilai. Ini menutup risiko aspirasi yang saat ini tidak terlihat dalam tiga langkah.
7. Revisi jawaban tekanan darah. Pada TD ulang **182/100**, jangan memberi kaptopril/nifedipin sublingual dan jangan menunda transfer untuk normalisasi tekanan darah. Namun jangan mengajarkan bahwa tekanan darah akut selalu `kompensatoris` atau setiap penurunan pasti `memadamkan penumbra`. Nilai ini sudah di bawah ambang pra-trombolisis `<185/110 mmHg`; monitor dan laporkan. Bila tekanan melewati ambang reperfusi atau terdapat kegawatan hipertensi lain, penurunan terkontrol dengan obat IV yang dapat dititrasi dilakukan menurut protokol di fasilitas mampu, tanpa target intensif `<140` dan tanpa menunda reperfusi.
8. Pertahankan larangan antiplatelet/antikoagulan pra-pencitraan. Tambahkan bahwa setelah perdarahan disingkirkan, pilihan trombolisis, aspirin, atau dual antiplatelet bergantung pada disabilitas defisit, pencitraan, waktu, kontraindikasi, serta strategi reperfusi; pasien ini tidak boleh dianggap kandidat aspirin hanya karena FAST positif.
9. Pertahankan neuroprotektor sebagai jawaban salah. Umpan balik dibuat profesional: tidak ada neuroprotektor yang menggantikan pencitraan dan reperfusi berbasis bukti; obat tambahan tidak boleh menunda transport. Hapus nada `kebiasaan yang menenangkan dokter` agar debrief tidak terdengar mengejek praktik atau pemain.
10. Sebelum berangkat, kumpulkan cepat tanpa menahan ambulans: obat antikoagulan/antiplatelet dan waktu dosis terakhir, riwayat perdarahan/operasi/trauma atau stroke sebelumnya, baseline fungsi, komorbid, alergi, berat badan perkiraan, serta nomor kontak saksi. Rekam pemeriksaan neurologis dan perubahan selama di FKTP.
11. Pertahankan RS 25 menit dengan CT dan layanan stroke sebagai jawaban benar dibanding RS 10 menit tanpa CT. Perjelas bahwa aturan universalnya bukan `selalu pilih RS lebih jauh`, melainkan **ikuti jejaring lokal dan pilih kemampuan yang mengubah terapi**: CT 24 jam dan trombolisis; CTA/skrining LVO serta jalur EVT atau transfer cepat bila dicurigai LVO. Bila sistem transfer antar-RS sangat cepat dan RS terdekat benar-benar thrombolysis-capable, keputusan bypass dapat berbeda.
12. Tambahkan target operasional PNPK: pra-notifikasi/telemedisin bila tersedia, konfirmasi penerimaan, dan target keberangkatan **<=30 menit setelah keputusan rujuk**. Handoff menyertakan last-known-well/onset, GDS, tekanan darah serial, SpO2, defisit, status NPO, obat/kontraindikasi, dan perubahan selama transfer terpantau.
13. Tutup bridge UKP-UKM melalui dua callback. `Hiperakut`: catat onset-to-arrival, decision-to-departure, tujuan dan kegagalan jejaring untuk audit Puskesmas/Dinkes serta edukasi komunitas `SEGERA KE RS`. `Pascapulang`: rujuk balik untuk rehabilitasi, skrining disfagia/kebutuhan rumah, dukungan caregiver, kepatuhan antitrombotik sesuai diagnosis final, dan pengendalian hipertensi, DM, lipid, merokok, fibrilasi atrium, aktivitas, serta depresi pascastroke.
14. Bersihkan provenance pada clue. Hapus sitasi bare `PPK FKTP KMK 1186/2022` yang tidak muncul pada panel sumber dan telah diamandemen KMK 1936/2022. Gunakan PNPK Stroke KMK 304/2026 sebagai baseline Indonesia dan AHA/ASA 2026 sebagai pembaruan EBM. Catat pada metadata editorial, bukan UI utama, bahwa nomor dokumen menyebut 2026 sementara halaman tanda tangan literal bertanggal 17 April 2025.

**Realita FKTP yang diajukan, versi layar utama:**

> Di FKTP, tugas dokter bukan menebak iskemik versus perdarahan, melainkan mengenali suspek stroke, menjaga ABC, mengecek glukosa, mengunci waktu, dan mengantar pasien secepatnya ke kemampuan yang dapat mengubah terapi. Dalam skenario ini, RS 10 menit tanpa CT menambah satu perpindahan, sedangkan RS 25 menit memiliki CT dan layanan stroke; karena itu tujuan kedua lebih masuk akal. Keputusan rute tetap mengikuti jejaring setempat: pasien dengan dugaan LVO mungkin perlu langsung ke pusat trombektomi, sedangkan daerah dengan transfer antar-RS yang sangat cepat dapat memakai pola lain. Setiap keterlambatan dicatat agar kasus individu memperbaiki sistem desa.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: `kenali + kunci waktu`, `cek glukosa`, `jangan obat oral/antitrombotik pra-CT`, dan `pra-notifikasi ke kemampuan reperfusi`.
- Angka BP, pilihan trombolisis/EVT, serta daftar kontraindikasi berada di panel `Bukti klinis`, tertutup secara default.
- Bridge UKM tampil sebagai satu kartu ringkas `Jejak Waktu Stroke`; detail audit sistem dan rujuk balik dibuka hanya bila pemain memilih memperdalam.
- Jangan menampilkan diagnosis subtipe selama tiga langkah keputusan. Pada debrief, jelaskan bahwa kasus akhir dapat terbukti iskemik, tetapi keputusan FKTP dibuat ketika subtipe masih belum diketahui.

**Catatan sumber dan keterbatasan:**

- PNPK 304/2026 meminta pasien stroke akut dibawa ke RS dengan layanan stroke, menghindari antiplatelet/antikoagulan pra-rumah sakit, tidak menurunkan tekanan darah secara agresif, dan menargetkan keberangkatan rujukan dalam <=30 menit.
- PNPK menetapkan CT nonkontras sebagai pemeriksaan awal untuk membedakan iskemik dan perdarahan serta sasaran tekanan darah sebelum rtPA `<185/110 mmHg`. Karena pasien 182/100, normalisasi tekanan darah di FKTP tidak diperlukan.
- AHA/ASA 2026 menerima alteplase atau tenecteplase dalam jendela 4,5 jam pada pasien terpilih, memperluas kriteria EVT, dan menekankan bahwa routing harus mengikuti kemampuan serta performa sistem lokal. Ia tidak mendukung penurunan sistolik intensif ke `<140 mmHg` setelah reperfusi.
- Nama `Suspek Stroke Akut/I64` konsisten dengan resolusi dokter M13-0B pada kasus poli yang sama; membiarkan prototipe IGD tetap `Stroke Iskemik/I63.9` akan menciptakan kontradiksi internal.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Stroke*, KMK 304/2026: https://keslan.kemkes.go.id/unduhan/fileunduhan1780387545_996111.pdf
- AHA/ASA, *2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke*: https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke
- AHA/ASA, *Top Things to Know - 2026 AIS Guideline*: https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke/top-things-to-know
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- M13-0B internal precedent: `M13_0B_DELTA_AUDIT_2026.md`, bagian Delta Stroke.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-11 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-8 - Perdarahan Pascasalin Primer dengan Syok

**Pernyataan reviewer:** `IGD-8: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** pengenalan perdarahan pascasalin, syok, 4T, respons simultan, oksitosin, traneksamat dini, kompresi bimanual, dan pra-notifikasi sudah kuat. Nilai klinis saat ini sekitar **8,2/10**. Risiko materialnya adalah status plasenta tidak jelas meski kasus mengunci atonia, umpan balik mengajarkan traneksamat seolah harus menunggu giliran, kristaloid ditulis sebagai `guyur` tanpa reassessment atau hubungan dengan darah, dan kompresi/tampon selama perjalanan diperlakukan sebagai kewajiban universal tanpa menyatakan kompetensi serta kesiapan fasilitas. Paket di bawah ditargetkan membawa kasus ke **>=9,2/10** sekaligus membuat jembatan UKP-UKM PPH terasa nyata.

**Patch specification yang diajukan:**

1. Pertahankan ICD `O72.1`, tetapi beri label klinis **`Perdarahan Pascasalin Primer dengan Syok, kemungkinan Atonia Uteri`**. Nyatakan bahwa plasenta sudah lahir dan kelengkapannya sedang diperiksa. Uterus lembek serta respons terhadap masase mendukung atonia, tetapi pencarian `Tone, Tissue, Trauma, Thrombin` tetap berjalan dan diagnosis penyebab tidak boleh dikunci hanya dari satu temuan.
2. Tambahkan deteksi objektif tanpa membuat pemain menunggu angka: ukur kehilangan darah dengan kantong atau drape terkalibrasi bila tersedia dan pantau aliran, tonus, nadi, tekanan darah, kesadaran, perfusi, serta suhu. Ambang WHO adalah kehilangan darah >500 mL, atau >300 mL disertai tanda vital abnormal; **clinical judgement tetap cukup** pada perdarahan deras dengan syok seperti vignette ini.
3. Aktifkan respons perdarahan obstetri dan bagi peran sejak langkah pertama: satu petugas memimpin ABC/resusitasi, satu menjalankan bundel PPH dan mencatat waktu/dosis, satu menghubungi transport serta RS, dan satu memastikan bayi serta pendamping tidak terlantar. Jangan menunggu dokter obstetri untuk memulai respons pertama.
4. Ajarkan bundel **MOTIVE** sebagai tindakan paralel yang selesai secepatnya, idealnya dalam 15 menit: Massage uterus, Oxytocic, Tranexamic acid, IV fluids, Vaginal/genital tract examination, dan Escalation. Urutan internal tidak penting dan semua komponen yang tersedia tetap diberikan walau ada perbaikan awal.
5. Nyatakan regimen oksitosin dengan satuan klinis: oksitosin `10 IU` IV yang diencerkan dan diberikan perlahan selama 1-2 menit, atau IM; lanjutkan infus menurut protokol, misalnya `20 IU dalam 1 L` selama sekitar 4 jam. Profilaksis oksitosin saat kala III tidak menghapus kebutuhan terapi PPH. Hindari bolus IV cepat dan hindari mengulang `dosis demi dosis` tanpa rencana.
6. Berikan asam traneksamat `1 g IV selama 10 menit` sedini mungkin dan dalam 3 jam setelah kelahiran. Ulangi `1 g` bila perdarahan masih berlangsung setelah 30 menit atau berulang dalam 24 jam. Koreksi umpan balik pilihan lama: kesalahannya adalah **menunggu 15 menit sebelum menjalankan masase dan uterotonika**, bukan karena traneksamat tidak boleh diberikan pada awal respons.
7. Pasang dua akses IV besar bila dapat dilakukan tanpa menunda tindakan lain, ambil darah untuk Hb, golongan/crossmatch, koagulasi dan pemeriksaan terkait, tetapi jangan menunggu hasil. Gunakan kristaloid isotonik hangat secara terukur dengan reassessment, jaga kehangatan, dan hindari istilah `guyur`. Kristaloid adalah jembatan, bukan pengganti darah; pra-notifikasi harus membuat darah dan protokol perdarahan masif siap di tujuan.
8. Periksa 4T secara cepat dan aman: tonus uterus, kelengkapan plasenta/retensi jaringan, robekan jalan lahir atau ruptur/inversi, serta kemungkinan koagulopati. Pemeriksaan tidak boleh berubah menjadi eksplorasi uterus buta atau penjahitan robekan kecil yang mengalihkan resusitasi dari syok dan sumber utama.
9. Bila perdarahan berlanjut, pilih uterotonika tambahan menurut stok dan kontraindikasi. Ergometrin dihindari pada hipertensi/preeklamsia atau penyakit jantung; prostaglandin tertentu dihindari pada asma. Misoprostol `800 mcg sublingual` dapat dipakai bila oksitosin tidak tersedia atau mutunya tidak dapat dijamin, tetapi bukan alasan untuk menunda transfer atau menumpuk obat tanpa evaluasi.
10. Gunakan kompresi bimanual oleh tenaga terlatih sebagai tindakan sementara bila atonia tidak merespons. Jelaskan tindakan dan beri dukungan/analgesia sejauh keadaan memungkinkan, gunakan pencegahan infeksi, serta rancang pemindahan dengan jumlah petugas yang cukup agar kontrol perdarahan dapat dipertahankan secara aman. Jangan mengajarkan bahwa tangan internal harus selalu dipertahankan tanpa henti di setiap ambulans, apa pun kompetensi kru dan keselamatan perjalanan.
11. Tampon balon atau kondom kateter hanya menjadi jembatan bila protokol PPH, alat steril, operator terlatih, monitoring, jalur darah/operasi, dan eskalasi segera benar-benar tersedia. Karena `sukamaju_middle_v1` adalah Puskesmas perdesaan nonrawat-inap dan PONED tidak diasumsikan, vignette harus menyatakan readiness bila tindakan ini diberi kredit. Bila tidak ready, lanjutkan tindakan yang aman dan transfer tanpa menunggu improvisasi alat.
12. Ubah tujuan rujukan dari sekadar `RS dengan obgyn` menjadi fasilitas yang telah mengonfirmasi penerimaan dan mampu menyediakan darah/transfusi masif, anestesi, kamar operasi, kendali sumber obstetri, perawatan intensif, dan dukungan neonatus. Hindari transfer berantai Polindes-Puskesmas-PONED-RS bila jalur langsung ke kemampuan definitif lebih cepat; Sukamaju hanya menjadi titik stabilisasi bila memang itu rute tercepat dan aman.
13. Handoff wajib memuat waktu persalinan dan mulai perdarahan, perkiraan/ukuran kehilangan darah, status dan kelengkapan plasenta, tren tanda vital dan kesadaran, dugaan 4T, semua uterotonika/TXA beserta dosis-waktu, cairan masuk, intervensi mekanik, respons, komorbid/kontraindikasi, serta kondisi bayi. Dokumentasikan siapa penerima dan rencana darah/operasi di tujuan.
14. Tutup bridge UKP-UKM melalui dua callback. `Kesiapan semua persalinan`: audit stok dan cold chain oksitosin, stok TXA, drape terkalibrasi, set IV, kompetensi tim, simulasi PPH, ambulans, komunikasi, serta jejaring darah; banyak PPH tidak memiliki faktor risiko yang dapat diprediksi. `Kasus individual`: lakukan audit maternal near-miss atas keterlambatan pengenalan, keputusan, transport dan darah; setelah pulang tindak lanjuti anemia, pemulihan fisik, laktasi, kesehatan mental/trauma, kontrasepsi, dan kebutuhan keluarga.
15. Perbaiki provenance. Jadikan PNPK Tata Laksana Komplikasi Kehamilan KMK 91/2017 sebagai floor Indonesia langsung untuk PPH, dengan PPK FKTP KMK 1186/2022 sebagai jalur praktis FKTP. Gunakan WHO/FIGO/ICM 2025 dan Implementation Guide 2026 untuk ambang diagnosis, MOTIVE, regimen mutakhir, serta implementasi sistem. Hapus frasa mengambang `panduan Kemenkes/POGI` bila tidak ada sumber yang dapat dibuka. Fornas 1199/2025 hanya membuktikan listing normatif obat; Permenkes 16/2024 mengatur logika jejaring rujukan.

**Realita FKTP yang diajukan, versi layar utama:**

> Oksitosin dan asam traneksamat tercantum dalam Formularium Nasional untuk FKTP, tetapi listing tidak menjamin stok, cold chain, jumlah ampul, tim terlatih, atau ambulans selalu siap. Snapshot nasional Rifaskes 2019 bahkan mencatat oksitosin parenteral hanya tersedia pada 56,4% Puskesmas nonrawat-inap; angka historis ini bukan inventaris Sukamaju hari ini, tetapi alasan readiness harus terlihat. Dalam skenario ini, obat, dua akses IV, tenaga terlatih, transport, dan RS penerima harus dinyatakan. Bila satu komponen tidak ready, pemain tetap menjalankan bagian MOTIVE yang aman, mengendalikan perdarahan sebisanya, dan mempercepat transfer tanpa terkena hukuman tersembunyi. Setelah ibu selamat, kasus kembali ke UKM sebagai audit stok, kompetensi, waktu rujuk, dan akses darah.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: empat pesan - `kenali syok tanpa menunggu hitungan`, `MOTIVE paralel dalam 15 menit`, `kendalikan perdarahan sambil resusitasi`, dan `pra-notifikasi ke darah + operasi`.
- Regimen obat, kontraindikasi uterotonika, dan syarat tampon berada di panel `Bukti klinis`, tertutup secara default.
- Bridge UKM tampil sebagai satu kartu `Jejak 40 Menit`: kapan darah dikenali, bundel dimulai, keputusan rujuk dibuat, ambulans berangkat, dan darah/operasi siap.
- Gunakan label peran tim atau garis waktu singkat, bukan paragraf tambahan di tiga tombol keputusan.

**Catatan sumber dan keterbatasan:**

- WHO/FIGO/ICM 2025 memperkenalkan deteksi pada >300 mL dengan tanda vital abnormal, mempertahankan >500 mL atau clinical judgement, dan meminta bundel MOTIVE segera. Quick card WHO meminta bundel selesai dalam 15 menit dan menegaskan urutan komponen tidak penting.
- Quick card WHO memberi oksitosin 10 IU IV lambat/IM, TXA 1 g IV selama 10 menit, dosis TXA kedua setelah 30 menit bila perdarahan berlanjut, serta pengukuran darah objektif bila tersedia.
- PNPK KMK 91/2017 secara langsung memuat PPH, 4T, respons simultan, masase, oksitosin, kompresi bimanual, tampon kondom, resusitasi dan rujukan. Bagian obat serta perangkat yang lebih tua ditapis dengan WHO 2025, bukan dibuang sebagai konteks lokal.
- WHO menempatkan tampon balon pada sistem yang menjalankan protokol PPH dan memiliki prasyarat implementasi. Baseline M13-RP1 tidak menganggap Sukamaju PONED; readiness harus dinyatakan, bukan diasumsikan dari nama Puskesmas.
- Fornas 1199/2025 mencantumkan oksitosin injeksi 10 IU/mL dan asam traneksamat injeksi untuk FPKTP dengan restriksi. Ini bukan bukti stok bedside atau cold-chain aktual.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Komplikasi Kehamilan*, KMK 91/2017: https://www.kemkes.go.id/app_asset/file_content_download/17012281586566ae7eec8862.58707574.pdf
- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- WHO/FIGO/ICM, *Consolidated Guidelines for Prevention, Diagnosis and Treatment of PPH*, 2025: https://www.who.int/publications/i/item/9789240115637
- WHO/FIGO/ICM/Jhpiego/UNFPA, *PPH Implementation Guide*, 2026: https://www.who.int/publications/i/item/9789240116115
- WHO, *PPH Quick Card*, updated November 2025: https://cdn.who.int/media/docs/default-source/integrated-health-services-%28ihs%29/csy/pph-quick-card.pdf?sfvrsn=359ae7aa_1
- WHO, *Recommendation on Uterine Balloon Tamponade*, 2021: https://www.who.int/publications/i/item/9789240013841
- Kementerian Kesehatan RI, *Fornas 1199/2025*: https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, khususnya profil `sukamaju_middle_v1` dan data Rifaskes 2019.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-8 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-9 - Pneumotoraks Tensi Traumatik dengan Syok Obstruktif

**Pernyataan reviewer:** `IGD-9: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** kasus sudah benar mengenali kegawatan klinis, melarang penundaan untuk foto toraks, memberi oksigen, melakukan dekompresi di sisi sakit, menghindari tepi bawah iga, memantau kekambuhan, dan tetap merujuk setelah respons. Nilai klinis saat ini sekitar **7,2/10**. Masalah material berada tepat pada prosedur inti: lokasi tusuk tidak pernah disebut, panjang kateter tidak dinyatakan, desis udara dianggap konfirmasi, cairan ditolak secara absolut pada pasien trauma yang mungkin mengalami syok campuran, dan WSD disebut selalu melampaui FKTP alih-alih dikaitkan dengan readiness. Paket di bawah ditargetkan membawa kasus ke **>=9,2/10**.

**Patch specification yang diajukan:**

1. Pertahankan id teknis dan ICD `S27.0`, tetapi gunakan label **`Pneumotoraks Tensi Traumatik dengan Syok Obstruktif`**. Diagnosis tetap klinis dan tindakan tidak menunggu pencitraan pada pasien dengan hipotensi serta kompromi napas berat seperti vignette ini.
2. Ajarkan pola, bukan triad buku teks: mekanisme trauma toraks, perburukan cepat, distres/hipoksia, gerak dada dan suara napas unilateral turun atau hilang, serta gangguan perfusi. Distensi vena leher dan deviasi trakea boleh ada pada vignette, tetapi merupakan tanda yang tidak sensitif atau terlambat dan tidak boleh menjadi syarat. Vena leher dapat datar bila trauma juga menyebabkan hipovolemia.
3. Batasi indikasi dekompresi: lakukan hanya pada **dugaan pneumotoraks tensi dengan instabilitas hemodinamik atau kompromi respirasi berat**, bukan setiap pneumotoraks atau setiap suara napas unilateral menurun. Pada pasien stabil, pencitraan/eFAST dan tata laksana terkontrol tetap relevan.
4. Ganti dialog `Tolak foto toraksnya` dengan `jangan menunda dekompresi untuk foto`. eFAST boleh membantu bila alat dan operator terlatih sudah berada di sisi pasien serta tidak menunda tindakan; hasil negatif tidak menyingkirkan pneumotoraks. Ini juga menghilangkan kontradiksi dengan profil Sukamaju yang tidak mengasumsikan radiologi ready.
5. Karena SpO2 79%, berikan oksigen konsentrasi tinggi dan lakukan penilaian trauma ABCDE secara paralel. Pasang akses IV, cari perdarahan lain, lindungi tulang belakang sesuai mekanisme, dan jaga suhu. Koreksi umpan balik lama: dekompresi memang mendahului bolus cairan, tetapi trauma dapat menimbulkan syok campuran; cairan/darah tidak boleh dinyatakan tidak berguna secara universal.
6. Nyatakan resource sebelum pilihan prosedur: operator terlatih, kateter dekompresi besar yang **cukup panjang untuk dinding dada pasien** (untuk skenario dewasa ini perangkat 14G sekitar 8 cm), antiseptik, sarung tangan, oksigen, monitoring, dan transport tersedia. Kateter IV pendek biasa dapat gagal mencapai pleura; pemain tidak boleh dihukum oleh alat yang diam-diam tidak memadai.
7. Tentukan lokasi secara eksplisit menurut protokol dan anatomi. Untuk skenario dewasa ini pilih sela iga ke-4 atau ke-5 pada garis anterior aksila/sekitar safe triangle; sela iga ke-2 garis midklavikula tetap diakui sebagai alternatif dalam pedoman tertentu. Tusuk tepat di atas tepi iga bawah pada sela yang dipilih, hindari arah terlalu medial, terlalu rendah, atau terlalu posterior, dan jangan menjadikan garis puting sebagai landmark tunggal.
8. Revisi langkah teknik: desinfeksi tanpa menunda keadaan mengancam nyawa, masukkan jarum-kateter tegak lurus sesuai lokasi sampai pleura tercapai, majukan kateter dan keluarkan jarum, lalu biarkan sistem berventilasi sesuai perangkat/protokol serta fiksasi dengan aman. Jangan meninggalkan instruksi samar `kanul terbuka` sebagai keseluruhan tata laksana.
9. Hapus klaim bahwa desis udara `mengonfirmasi diagnosis`. Desis dapat tidak terdengar dan dekompresi dapat gagal karena lokasi, panjang, kink, sumbatan, atau dislodgement. Keberhasilan dinilai dari respons serial: kerja napas, ekspansi/suara napas, SpO2, tekanan darah, nadi, kesadaran dan perfusi. Bila tidak membaik atau kembali memburuk, segera nilai ulang diagnosis, sisi, patensi dan kebutuhan dekompresi ulang/teknik alternatif oleh petugas yang kompeten.
10. Pertahankan needle decompression sebagai jembatan yang benar untuk profil Sukamaju. Open/finger thoracostomy atau tube thoracostomy dapat lebih andal bila dilakukan tim yang sangat terlatih dengan alat, tata kelola, dan quality assurance, tetapi tidak ready dalam vignette ini. Ganti umpan balik `WSD melampaui lingkup FKTP` dengan `WSD tidak tersedia dan tidak aman dilakukan oleh tim Sukamaju saat ini`; kemampuan fasilitas, bukan nama tingkat layanan, menjadi batasnya.
11. Setelah respons, jangan cabut kateter atau menutup jalur secara kedap. Fiksasi, pantau patensi dan kekambuhan, teruskan oksigen sesuai respons, dan siapkan dekompresi ulang bila tension kambuh. Bila ventilasi tekanan positif menjadi perlu, pastikan dekompresi efektif karena tekanan positif dapat mempercepat kekambuhan.
12. Rujuk tanpa menunggu foto dokumentasi ke fasilitas yang telah mengonfirmasi penerimaan dan mampu melakukan chest drain, pencitraan trauma, ventilasi, transfusi, bedah/trauma dan perawatan intensif. Handoff memuat mekanisme, sisi dan temuan, lokasi/perangkat/waktu dekompresi, respons, komplikasi, tren vital, terapi lain, serta kecurigaan cedera penyerta.
13. Beri analgesia dan dukungan komunikasi setelah ancaman segera teratasi tanpa menunda tindakan. Jelaskan bahwa perbaikan adalah hasil dekompresi sementara, bukan paru yang sudah sembuh. Foto toraks atau eFAST tetap diperlukan setelah stabilisasi di fasilitas mampu untuk cedera toraks dan posisi drainase definitif.
14. Tutup bridge UKP-UKM melalui dua callback. `Trauma individu`: dokumentasikan lokasi kecelakaan, penggunaan helm, alkohol/kelelahan, kondisi jalan, waktu ditemukan, respons PSC/ambulans dan cedera penyerta tanpa menyalahkan korban. `Kesiapan sistem`: setiap needle decompression masuk audit indikasi, sisi, landmark, panjang perangkat, respons dan komplikasi; cek stok kateter panjang, kompetensi berkala dengan simulasi, serta waktu menuju chest drain. Temuan berulang diteruskan ke Puskesmas, PSC/Dinkes dan lintas sektor keselamatan jalan.
15. Perbaiki provenance. Jadikan PNPK Tata Laksana Trauma KMK 132/2017 dan PPK FKTP KMK 1186/2022 sebagai floor Indonesia, tetapi jangan mengklaim keduanya menetapkan lokasi dekompresi modern secara rinci. Gunakan WHO-ICRC Basic Emergency Care untuk konteks layanan pertama sumber daya terbatas, NICE NG39 yang masih aktif untuk indikasi dan pilihan teknik berbasis kompetensi, WSES-AAST 2025 untuk pembaruan teknik trauma toraks, dan NAEMSP 2024 untuk risiko salah indikasi/kegagalan serta quality assurance. Hapus sitasi mengambang `prinsip ATLS` bila edisi atau akses sumber tidak tersedia di panel bukti.

**Realita FKTP yang diajukan, versi layar utama:**

> Needle decompression masuk kompetensi kegawatdaruratan yang dapat diajarkan di layanan primer; WHO Indonesia bahkan memasukkannya dalam pelatihan Basic Emergency Care untuk tenaga Puskesmas. Namun pelatihan nasional tidak membuktikan setiap Puskesmas selalu memiliki operator kompeten, kateter cukup panjang, monitoring, atau ambulans pada setiap jam. Karena prosedur ini satu-satunya tindakan penyelamat pada vignette, kasus harus menyatakan semua resource tersebut ready sebelum pemain memilih. Sukamaju melakukan dekompresi jarum sebagai jembatan, memantau kegagalan/kekambuhan, dan mengirim pasien ke chest drain definitif. Setiap tindakan kemudian diaudit agar prosedur langka ini tidak berubah menjadi tusukan refleks pada semua sesak pascatrauma.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: `diagnosis klinis pada pasien tidak stabil`, `oksigen + dekompresi tanpa menunggu gambar`, `nilai keberhasilan dari pasien, bukan desis`, dan `rujuk untuk chest drain`.
- Sebelum langkah teknik, tampilkan strip resource singkat: `operator terlatih`, `kateter 14G panjang`, `monitoring`, dan `ambulans ready`.
- Setelah keputusan, tampilkan satu diagram anatomi sederhana dengan lokasi lateral yang dipilih, alternatif anterior, serta penanda `di atas iga`; jangan menjejalkan anatomi ke label tombol.
- Panel `Bukti klinis` memisahkan floor Indonesia, panduan layanan terbatas, dan pembaruan trauma internasional. Detail kegagalan kateter serta pilihan thoracostomy berada di panel tertutup.
- Bridge UKM tampil sebagai kartu `Audit Satu Tusukan`: indikasi, alat, landmark, respons dan komplikasi, lalu tindak lanjut kesiapan sistem.

**Catatan sumber dan keterbatasan:**

- PNPK Trauma 132/2017 menempatkan Puskesmas sebagai ujung tombak evaluasi awal, stabilisasi dan rujukan trauma, tetapi teksnya tidak memberi algoritme needle decompression dewasa yang cukup rinci untuk menjadi satu-satunya sumber prosedur.
- PPK 1186/2022 menyebut dekompresi jarum atau tube thoracostomy pada syok obstruktif serta menyediakan daftar alat pneumotoraks, tetapi bab pneumotoraksnya terutama membahas pneumotoraks spontan dan tidak menentukan site/length modern.
- NICE NG39 membatasi dekompresi pada instabilitas hemodinamik atau kompromi napas berat, melarang penundaan pencitraan pada keadaan itu, dan memilih open thoracostomy bila keahlian tersedia. Ini tidak berarti open thoracostomy layak diasumsikan di Sukamaju.
- WSES-AAST 2025 menempatkan chest tube sebagai terapi definitif dan menerima needle decompression di sela iga ke-2 garis midklavikula atau sela iga ke-5 garis midaksila ketika chest tube tidak tersedia atau dalam layanan prarumah sakit.
- NAEMSP 2024 menyoroti salah indikasi dan rendahnya keberhasilan needle thoracostomy, meminta pendekatan individual terhadap anatomi/perangkat serta quality assurance. Bukti perbandingan teknik tetap banyak bergantung pada studi observasional dan konsensus, sehingga game tidak boleh menyajikan satu site sebagai kebenaran universal tanpa konteks protokol.
- WHO-ICRC BEC mengajarkan kateter 14-16G di sela iga ke-2 garis midklavikula dan transfer segera; ia dipakai sebagai konteks feasible untuk first-contact care, lalu ditriangulasi dengan rekomendasi trauma yang lebih baru.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Trauma*, KMK 132/2017: https://keslan.kemkes.go.id/unduhan/fileunduhan_1610422327_714480.pdf
- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- WHO-ICRC-IFEM, *Basic Emergency Care*: https://www.who.int/teams/integrated-health-services/clinical-services-and-systems/emergency-and-critical-care/bec
- WHO Indonesia, *Empowering Primary Care: WHO Trains Health Workers to Provide Quality Emergency Services*, 2024: https://www.who.int/indonesia/news/detail/05-01-2024-empowering-primary-care--who-trains-health-workers-to-provide-quality-emergency-services
- NICE, *Major Trauma: Assessment and Initial Management*, NG39: https://www.nice.org.uk/guidance/ng39/chapter/recommendations
- WSES-AAST, *Thoracic Trauma Guidelines*, 2025: https://link.springer.com/article/10.1186/s13017-025-00651-1
- NAEMSP, *Prehospital Trauma Compendium: Traumatic Pneumothorax Care*, 2024: https://doi.org/10.1080/10903127.2024.2416978
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, profil `sukamaju_middle_v1`.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-9 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-10 - Status Epileptikus Konvulsif pada Dewasa

**Pernyataan reviewer:** `setuju kamu bahwa perlu edit` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** draf sudah benar mengenali kejang lebih dari lima menit sebagai kegawatan, melindungi pasien dari cedera, melarang restrain dan benda di mulut, memberi oksigen pada hipoksemia, memakai benzodiazepin sebagai lini pertama, membatasi pengulangan, serta tetap merujuk. Nilai klinis saat ini sekitar **6,9/10**. Cacat materialnya adalah rentang usia 15-17 tahun digrounding ke PNPK dewasa, pemeriksaan glukosa baru dijadikan jawaban setelah dua dosis benzodiazepin, dan tidak ada tindakan lini kedua ketika kasus sudah masuk established benzodiazepine-resistant status epilepticus. Frasa `jalan napas aman` juga memberi rasa aman palsu, rute bukal muncul tanpa obat/protokol Indonesia yang dinyatakan, dan tujuan rujukan hanya berbasis nama spesialis. Paket di bawah ditargetkan membawa kasus ke **>=9,2/10**.

**Patch specification yang diajukan:**

1. Pertahankan id teknis dan ICD `G41.9`, tetapi ubah label menjadi **`Status Epileptikus Konvulsif pada Dewasa`** dan rentang usia menjadi 18-45 tahun. KMK 274/2026 adalah PNPK epilepsi dewasa; usia 15-17 tidak boleh masuk diam-diam tanpa jalur pediatrik tersendiri.
2. Ajarkan dua ambang ILAE secara tepat: pada kejang tonik-klonik, `t1 = 5 menit` adalah saat terapi emergensi harus dimulai dan `t2 = 30 menit` adalah saat risiko konsekuensi jangka panjang meningkat. Pemain tidak menunggu menit ke-30 untuk menamai atau mengobati status.
3. Ubah fase pertama menjadi respons tim paralel: catat waktu mulai; panggil bantuan dan aktifkan ambulans/jejaring rujuk sejak status dikenali; lindungi kepala dan jauhkan benda keras; jangan menahan gerakan atau memasukkan benda ke mulut; posisikan lateral bila aman dan feasible; suction hanya sekret/muntahan yang terlihat; beri oksigen karena SpO2 90%; siapkan BVM dan monitor; pasang akses IV tanpa menunda obat; serta periksa glukosa kapiler dalam menit awal. Turn-based UI boleh meminta satu keputusan utama, tetapi narasi harus menjelaskan bahwa tugas-tugas ini berjalan bersamaan.
4. Jangan menyebut jalan napas `sudah aman` hanya karena pasien dimiringkan dan SpO2 naik. Kejang aktif serta benzodiazepin dapat mengganggu ventilasi; nilai gerak dada, frekuensi dan usaha napas, saturasi, sekret, serta kesiapan suction/BVM. Eskalasi airway dilakukan oleh tim kompeten bila ventilasi gagal.
5. Jangan menunda benzodiazepin demi ritual ABC lengkap atau akses IV. Setelah proteksi dan bantuan ventilasi dasar sedang berjalan, berikan dosis adekuat segera. Untuk pasien dewasa ini, PNPK 274/2026 menetapkan diazepam IV 0,1 mg/kgBB, 5-10 mg per dosis, maksimum kumulatif 20 mg, dengan kecepatan maksimum 5 mg/menit; dapat diulang satu kali bila kejang berlanjut. Bila akses IV tidak segera didapat, diazepam rektal sesuai protokol adalah jalur PNPK-FPKTP yang dinyatakan tersedia.
6. Hapus umpan balik yang memperkenalkan rute `bukal` tanpa menyebut obat, sediaan, atau readiness. Midazolam bukal sah pada pedoman tertentu, sedangkan PNPK dewasa Indonesia mencantumkan diazepam rektal untuk FPKTP dan midazolam IM pada bagian FPKTL. Game hanya menampilkan rute yang benar-benar terikat ke sediaan, protokol, dan resource vignette.
7. Rekam waktu, rute, dosis, dan respons setiap benzodiazepin, termasuk obat yang mungkin sudah diberikan keluarga atau petugas pra-fasilitas. Jangan mengulang berdasarkan kesan `masih kejang` tanpa mengetahui dosis kumulatif; jangan pula mengurangi dosis efektif hanya karena takut depresi napas. Risiko napas ditangani dengan monitoring dan dukungan ventilasi, bukan dengan undertreatment.
8. Pindahkan pemeriksaan glukosa dari langkah ketiga ke fase awal. Hipoglikemia dikoreksi segera bila ada, tetapi pemeriksaan atau pemberian glukosa tidak boleh menunda benzodiazepin. Skrining penyebab berjalan paralel dan mencakup obat antiseizure yang terputus, infeksi, stroke, trauma, gangguan elektrolit/metabolik, toksin atau putus alkohol, kehamilan/eklampsia bila relevan, serta kemungkinan kejadian nonepileptik tanpa membiarkan keraguan itu menunda terapi pada presentasi berisiko tinggi.
9. Setelah dua dosis benzodiazepin yang adekuat tanpa terminasi, nyatakan secara eksplisit **established benzodiazepine-resistant status epilepticus**. Jangan berhenti pada `cek gula lalu rujuk`: pasien membutuhkan obat antiseizure IV lini kedua dengan monitoring serta kesiapan airway. WHO 2023, NICE NG217, ACEP 2024, dan ESETT mendukung levetirasetam, fenitoin/fosfenitoin, atau valproat sebagai opsi dengan efektivitas serupa; fenobarbital juga merupakan opsi pada konteks tertentu. Pilihan mengikuti protokol, komorbid, interaksi, kehamilan, ketersediaan, dan kemampuan monitoring, bukan satu obat juara universal.
10. Terapkan graceful degradation secara konkret pada vignette. Sukamaju dinyatakan memiliki diazepam IV/enema, glukometer, oksigen, suction, BVM, akses IV, monitor tanda vital, dan ambulans. Sukamaju **tidak** dinyatakan ready untuk infus lini kedua karena pompa/protokol, monitoring jantung, stok dosis penuh, serta operator tidak semuanya terverifikasi. Karena itu, setelah dua dosis adekuat gagal, tim mempertahankan airway/ventilasi dan monitoring, mengoreksi penyebab reversibel, meminta arahan medis penerima, dan mentransfer segera ke fasilitas yang telah siap memberi lini kedua. Bila kelak profil kasus menyatakan seluruh resource lini kedua ready, terapi tersebut dimulai tanpa menunda transport.
11. Jangan menyamakan `obat tercantum` dengan kemampuan mengeksekusi protokol. Fornas 1199/2025 mencantumkan diazepam injeksi dan enema untuk FPKTP serta beberapa antikonvulsan lain, tetapi listing tidak membuktikan stok hari itu, dosis penuh, pompa, ECG, airway backup, kompetensi, atau tata kelola. Panel Realita FKTP harus menerangkan perbedaan ini singkat dan tanpa memberi kesan Puskesmas tidak boleh berbuat apa-apa.
12. Bila gerakan motorik berhenti tetapi kesadaran tidak pulih, jangan otomatis menyatakan status selesai atau menumpuk benzodiazepin. Lanjutkan ABC, periksa ulang glukosa, suhu, pupil, trauma dan tanda fokal; pertimbangkan fase postiktal, efek obat, penyebab struktural/metabolik, dan non-convulsive status. Fasilitas tujuan harus mampu melakukan EEG serta airway/critical care bila gangguan kesadaran menetap.
13. Ubah tujuan rujukan dari sekadar `RS dengan layanan saraf` menjadi fasilitas yang telah mengonfirmasi penerimaan dan mampu memberi obat lini kedua, ventilasi/intubasi, pemeriksaan elektrolit serta etiologi, CT bila terindikasi, EEG untuk kecurigaan status non-konvulsif, dan ICU. Handoff memuat onset/t1, semiologi, pemulihan di antara kejang, glukosa, kehamilan bila relevan, pemicu, obat rumah, seluruh dosis serta waktu obat emergensi, respons, tren vital, dan dukungan airway selama transfer.
14. Tutup bridge UKP-UKM melalui dua callback. `Individu-keluarga`: setelah stabil, buat rencana emergensi tertulis, ajarkan first aid dan kapan mengaktifkan ambulans, pastikan akses obat rutin/rescue bila diresepkan, telaah kepatuhan tanpa menyalahkan, serta bahas keselamatan air, api, ketinggian, mesin, berkendara, pekerjaan dan kesehatan mental/stigma secara relevan. `Sistem`: setiap status memicu audit waktu onset-ke-benzodiazepin, kecukupan dosis, kesiapan oksigen-suction-BVM, ketersediaan obat rescue, waktu ambulans dan tujuan capable; temuan berulang kembali ke manajemen stok, simulasi tim, edukasi keluarga/sekolah/tempat kerja, dan jejaring Puskesmas-RS. Jangan memalsukan write-back ke indikator PIS-PK bila tidak ada indikator yang cocok.
15. Hubungkan pedagoginya dengan kasus poli epilepsi dewasa yang sudah diadjudikasi: kejang singkat yang sudah berhenti dan pasien pulih bukan alasan otomatis memberi diazepam rektal, sedangkan kejang aktif >=5 menit atau berulang tanpa pulih adalah status yang membutuhkan rescue treatment dan rujukan. Ini mencegah pemain menggeneralisasi satu algoritme ke semua kejang.
16. Perbaiki provenance. Jadikan PNPK Epilepsi Dewasa KMK 274/2026 sebagai floor Indonesia dan ILAE 2015 untuk definisi t1/t2. Tambahkan WHO 2023, NICE NG217 yang diperbarui 2025, kebijakan ACEP 2024, dan ESETT sebagai dasar lini kedua. Fornas 1199/2025 hanya digunakan untuk ketersediaan normatif, sedangkan Permenkes 16/2024 mendasari rujukan berbasis kemampuan. Hapus sitasi mengambang `konsensus PERDOSSI` bila dokumen, tahun, dan URL spesifik tidak hadir pada panel bukti.

**Realita FKTP yang diajukan, versi layar utama:**

> Diazepam injeksi dan enema tercantum dalam Formularium Nasional untuk FPKTP, sehingga Puskesmas bukan sekadar tempat lewat: status dikenali pada menit ke-5, first aid, oksigen/ventilasi, glukosa, dan benzodiazepin adekuat dimulai sambil rujukan bergerak. Namun obat lini kedua yang tercantum di daftar tidak otomatis berarti pompa, ECG, stok dosis penuh, operator, dan airway backup siap pada setiap giliran jaga. Pada encounter ini Sukamaju mampu memberi dua dosis diazepam terukur dan mendukung ventilasi, tetapi tidak mendaku mampu menjalankan infus lini kedua. Setelah gagal, tim tidak menumpuk sedasi atau menunggu: RS capable dikonfirmasi, monitoring berlanjut selama transfer, dan setiap keterlambatan kembali menjadi audit kesiapan sistem.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: `5 menit = mulai`, `ABC dan glukosa berjalan paralel`, `benzodiazepin adekuat - maksimal dua dosis`, dan `gagal dua dosis = lini kedua + transfer capable`.
- Tampilkan timeline ringkas tiga fase, bukan paragraf dosis panjang: `0-5 stabilisasi`, `5-20 benzodiazepin`, `gagal dua dosis -> established SE`.
- Sebelum pilihan obat, tampilkan strip resource singkat: `diazepam IV/enema`, `glukometer`, `O2-suction-BVM`, `monitor`, dan `ambulans ready`; `infus lini kedua belum ready`.
- Panel `Bukti klinis` tertutup secara default dan memisahkan PNPK Indonesia, definisi ILAE, EBM lini kedua, Fornas, serta aturan rujukan.
- Bridge UKM tampil setelah pasien selamat sebagai kartu `Menit yang Hilang`: waktu ke obat, dosis, transport, akses obat rutin/rescue, dan satu perbaikan sistem. Detail keselamatan hidup berada dalam teach-back singkat, bukan daftar panjang di layar utama.

**Catatan sumber dan keterbatasan:**

- PNPK KMK 274/2026 secara eksplisit membatasi regimen awalnya pada pasien dewasa: diazepam IV 0,1 mg/kgBB, 5-10 mg per dosis, maksimum 20 mg dan kecepatan maksimum 5 mg/menit, dapat diulang sekali, atau diazepam rektal saat kejang sambil merujuk. Dokumen juga menetapkan t1 5 menit dan t2 30 menit untuk status tonik-klonik.
- Diagram lini lanjut di PNPK berada sebagai gambar dan ekstraksi teksnya tidak cukup untuk dijadikan satu-satunya rincian algoritme. Karena itu rekomendasi setelah kegagalan benzodiazepin ditriangulasi dengan WHO, NICE, ACEP, dan uji ESETT.
- WHO 2023 menyatakan bahwa setelah dua dosis benzodiazepin, pilihan IV fosfenitoin/fenitoin, levetirasetam, fenobarbital, atau valproat bergantung pada sumber daya dan monitoring; rekomendasinya kondisional dengan kepastian bukti rendah pada dewasa.
- ACEP 2024 memberi rekomendasi Level A bahwa fosfenitoin, levetirasetam, atau valproat dapat digunakan dengan efektivitas serupa pada dewasa yang tetap kejang setelah dosis benzodiazepin optimal.
- ESETT menemukan terminasi kejang dan perbaikan respons pada sekitar separuh pasien: 47% levetirasetam, 45% fosfenitoin, dan 46% valproat, tanpa perbedaan bermakna. Temuan ini mencegah game mengajarkan superioritas palsu.
- NICE NG217 terakhir diperbarui Januari 2025 dan meminta terapi lini kedua setelah dua dosis benzodiazepin. Pembaruan keselamatan valproat harus diperhatikan; game tidak menjadikannya pilihan refleks pada semua pasien.
- Fornas membuktikan listing dan restriksi normatif, bukan stok atau kesiapan prosedural saat encounter. Baseline ASPAK PRIMERA juga merupakan profil authoring, bukan data readiness real-time.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Epilepsi Dewasa*, KMK 274/2026: https://keslan.kemkes.go.id/unduhan/fileunduhan1776933600_244772.pdf
- ILAE, *Definition and Classification of Status Epilepticus*, 2015: https://www.ilae.org/guidelines/definition-and-classification/status-epilepticus-2015
- WHO, *Antiseizure Medicines for Management of Established Status Epilepticus*, updated 2023: https://www.who.int/teams/mental-health-and-substance-use/mental-health-gap-action-programme/resources-centre/epilepsy-and-seizures/Antiseizure-medicines-for-management-of-established-status-epilepticus
- NICE, *Epilepsies in Children, Young People and Adults*, NG217, updated 2025: https://www.nice.org.uk/guidance/ng217/chapter/7-Treating-status-epilepticus-repeated-or-cluster-seizures-and-prolonged-seizures
- American College of Emergency Physicians, *Clinical Policy: Adult Patients Presenting With Seizures*, 2024: https://www.acep.org/siteassets/new-pdfs/clinical-policies/seizures.pdf
- Kapur et al., *Randomized Trial of Three Anticonvulsant Medications for Status Epilepticus (ESETT)*, NEJM 2019: https://www.nejm.org/doi/full/10.1056/NEJMoa1905795
- American Epilepsy Society, *Treatment of Prolonged Seizures in Children and Adults*, 2016: https://aesnet.org/clinical-care/clinical-guidance/guideline-prolonged-seizures
- Kementerian Kesehatan RI, *Fornas 1199/2025*: https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, profil `sukamaju_middle_v1`.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-10 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-7 - Luka Bakar Mayor 25% TBSA dengan Suspek Cedera Inhalasi

**Pernyataan reviewer:** `IGD-7: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** draf sudah mengenali luka bakar mayor, bahaya ruang tertutup, kebutuhan oksigen, pendinginan dengan air, larangan es dan bahan rumah tangga, kebutuhan akses IV, serta transfer. Nilai klinis saat ini sekitar **6,7/10**. Ada satu kontradiksi berbahaya: pembuka menyebut pakaian melekat pada kulit, tetapi pilihan benar meminta pakaian dilepas tanpa larangan mengelupas kain yang melekat. Formula Parkland `4 mL/kg/%TBSA` juga diajarkan seperti satu-satunya kebenaran dan satu jam yang lewat harus `dikejar`, sementara pedoman mutakhir memakai formula hanya sebagai estimasi awal dan menekankan titrasi untuk mencegah fluid creep. SpO2 95% dapat memberi rasa aman palsu pada keracunan CO, dan kasus belum menyatakan kesiapan advanced airway, analgesia, tetanus, antibiotik, maupun tujuan rujukan berbasis kemampuan. Paket di bawah ditargetkan membawa kasus ke **>=9,2/10**.

**Patch specification yang diajukan:**

1. Pertahankan id teknis dan ICD `T31.2`, tetapi ubah label klinis menjadi **`Luka Bakar Mayor 25% TBSA dengan Suspek Cedera Inhalasi`**. Pertahankan populasi dewasa dan SKDI `3B`; ini bukan luka bakar ringan yang selesai ditangani di FKTP, melainkan luka bakar mayor dengan ancaman jalan napas dan rujukan wajib.
2. Buat luas dan kedalaman dapat diaudit: nyatakan distribusi luka menurut Rule of Nines, hitung hanya luka partial-thickness dan full-thickness dalam TBSA, serta jangan memasukkan eritema saja. Gunakan istilah modern `superficial/partial/full thickness` pada penjelasan, sambil tetap mengenalkan padanan derajat lama karena masih ditemukan di PPK dan praktik lokal.
3. Langkah pertama dimulai dari keselamatan lokasi dan penghentian proses bakar. Potong atau lepaskan pakaian panas yang **tidak melekat** dan lepaskan perhiasan; **jangan mengelupas kain yang melekat pada kulit**, tetapi potong mengelilinginya. Koreksi ini harus terlihat pada label pilihan, bukan disembunyikan hanya di debrief.
4. Dinginkan luka dengan air mengalir sejuk/suhu ruang selama total 20 menit bila masih dalam tiga jam sejak kejadian. Pendinginan berjalan paralel dengan ABC pada luka mayor, tidak boleh menunda airway atau transfer, dan dihentikan bila memicu hipotermia. Jaga bagian tubuh yang tidak terbakar tetap hangat. Pertahankan larangan es, pasta gigi, kecap, minyak, mentega, dan pemecahan bula rutin.
5. Perlakukan kebakaran ruang tertutup, serak yang progresif, jelaga di mulut, dan sputum hitam sebagai **suspek kuat cedera inhalasi**, bukan diagnosis pasti hanya dari bulu hidung hangus. Pemeriksaan jalan napas awal yang tampak normal tidak menjamin aman karena edema dapat berkembang.
6. Berikan oksigen konsentrasi tinggi segera. Jelaskan bahwa pulse oximeter standar dapat tetap menunjukkan 95% pada keracunan karbon monoksida karena tidak membedakan oksihemoglobin dan karboksihemoglobin; jangan menunggu angka saturasi turun. Co-oximetry dan evaluasi toksisitas asap dilakukan di fasilitas tujuan tanpa menunda transfer.
7. Tampilkan resource strip sebelum pilihan airway: oksigen dengan kapasitas cukup, suction, BVM, airway adjunct, monitor, akses IV, kristaloid seimbang hangat, balut/seprai bersih, analgesia, dan ambulans dinyatakan ready. Kemampuan advanced airway **tidak boleh diasumsikan**. Bila operator dan perangkat intubasi benar-benar ready serta serak/obstruksi memburuk, amankan airway lebih dini sebelum edema menyulitkan; bila tidak, panggil bantuan airway/retrieval, siapkan ventilasi penyelamatan, dan transfer segera tanpa percobaan intubasi berulang yang traumatik.
8. Jangan mengajarkan antidot sianida sebagai tindakan rutin semua kebakaran ruang tertutup. Pertimbangkan hanya bila ada kombinasi paparan relevan dengan kolaps, gangguan kesadaran, hipotensi, asidosis berat/laktat tinggi, serta protokol dan obat tersedia; konsultasi pusat racun atau tim penerima tidak boleh menunda oksigen dan airway.
9. Untuk dewasa dengan luka bakar `>=20% TBSA`, gunakan formula cairan sebagai **perkiraan awal, bukan target yang harus dihabiskan**. Selaras pembaruan ABA, default authoring kasus ini adalah kristaloid seimbang `2 mL/kg/%TBSA/24 jam`, dengan separuh estimasi delapan jam pertama dihitung sejak waktu terbakar. Pada pasien 60 kg dan 25% TBSA, estimasi awalnya 3.000 mL/24 jam, bukan 6.000 mL. Protocol burn service yang memakai angka lain tetap dapat diikuti bila eksplisit dan terdokumentasi.
10. Hapus frasa bahwa satu jam yang lewat `harus dikejar`. Hitung sisa estimasi fase pertama dari waktu bakar, lalu sesuaikan laju secara bertahap terhadap perfusi, kesadaran, tanda vital, dan urine output; jangan memberi bolus buta untuk mengejar angka. Nilai juga trauma, perdarahan, atau penyebab lain bila hipotensi muncul sangat dini.
11. Mulai satu akses IV besar yang andal dengan cepat dan tambahkan akses kedua bila feasible tanpa menahan keberangkatan. Gunakan kristaloid seimbang hangat dan akses kulit tidak terbakar bila memungkinkan, tetapi akses melalui kulit terbakar dapat dipakai bila diperlukan. Hindari klaim bahwa dua akses selalu lebih penting daripada menit transfer.
12. Target urine output dewasa sekitar `0,5 mL/kg/jam` digunakan sebagai salah satu endpoint di fasilitas yang mampu mengukur dan menitrasi cairan. Kateter urin hanya dipasang bila alat, pencegahan infeksi, monitoring, dan waktu transport memungkinkan; jangan menunda transfer hanya untuk mengejar satu angka dan jangan menyebut urine sebagai penuntun tunggal atau terbaik di lapangan.
13. Berikan analgesia yang dititrasi dengan monitoring tanpa menunda ABC. Hindari injeksi intramuskular karena absorpsinya tidak andal pada syok; pilihan obat dan dosis harus mengikuti protokol, kontraindikasi, serta stok yang benar-benar ready. Setelah pendinginan, tutup luka longgar dengan bahan bersih, kering, dan tidak melekat, cegah hipotermia, dan jangan melakukan debridement luas di FKTP.
14. Nilai status imunisasi tetanus dan berikan vaksin/TIG sesuai jenis luka serta riwayat imunisasi. **Jangan memberi antibiotik sistemik profilaksis rutin** hanya karena luas luka. Bila PPK lama menyiratkan antibiotik spektrum luas untuk luka bakar sedang/berat, panel bukti harus menjelaskan bahwa rekomendasi yang lebih baru tidak mendukung profilaksis rutin; antibiotik diberikan bila ada infeksi atau indikasi lain yang nyata.
15. Ubah tujuan dari sekadar `bedah/pusat luka bakar` menjadi fasilitas yang telah mengonfirmasi penerimaan dan mampu menangani advanced airway/ventilasi, toksisitas asap/CO, resusitasi luka bakar, bedah atau burn service, ICU, serta rehabilitasi. Handoff mencakup waktu dan mekanisme kejadian, ruang tertutup, TBSA/kedalaman, tren airway dan vital, durasi pendinginan, cairan beserta waktu/laju, analgesia, tetanus, intervensi lain, dan respons.
16. Tutup bridge UKP-UKM melalui dua callback. `Pemulihan individu`: kontrol luka, rentang gerak, kontraktur/parut, nutrisi, nyeri/gatal, kesehatan mental, dukungan keluarga, dan kembali bekerja. `Kejadian tempat kerja`: audit tabung/regulator gas, ventilasi dapur, pintu keluar yang macet, alat pemadam, jalur evakuasi, pertolongan pertama yang keliru, serta waktu respons ambulans bersama pemilik warung, desa, pemadam, Puskesmas, dan Dinkes tanpa menyalahkan korban.
17. Perbaiki provenance. Jadikan PNPK Luka Bakar KMK 555/2019 dan PPK FKTP KMK 1186/2022 sebagai floor Indonesia. Gunakan ABA 2023/2024 untuk pembaruan cairan, ANZBA EMSB 2024 dan ANZCOR 2023 untuk first-contact care, CDC untuk keterbatasan pulse oximetry pada CO, AAST 2024 untuk antibiotik, serta ABA referral criteria untuk kapabilitas tujuan. Fornas/ASPAK hanya membuktikan listing atau baseline authoring, bukan stok dan readiness saat encounter.

**Realita FKTP yang diajukan, versi layar utama:**

> Luka bakar mayor bukan perlombaan menghabiskan angka Parkland. Sukamaju menghentikan proses bakar, mendinginkan tanpa membuat hipotermia, memberi oksigen 100% pada dugaan paparan asap, menyiapkan airway dan transfer, lalu memulai kristaloid hangat sebagai estimasi yang terus dititrasi. SpO2 95% tidak menyingkirkan karbon monoksida. Karena advanced airway, co-oximetry, ICU, dan burn service tidak otomatis tersedia di Puskesmas, kesiapan operator, alat, oksigen, serta RS penerima harus tampak sebelum pemain memilih. Setelah pasien selamat, pintu warung yang macet dan keselamatan tabung gas kembali sebagai pekerjaan UKM, bukan sekadar latar dramatik.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: empat pesan - `jangan kelupas kain melekat`, `20 menit dinginkan sambil jaga hangat`, `SpO2 normal tidak menyingkirkan CO`, dan `cairan adalah estimasi yang dititrasi`.
- Tampilkan timeline ringkas `0-20 menit`, `airway + transfer`, dan `resusitasi terukur`; rincian formula serta target urine berada di panel `Bukti klinis` yang tertutup secara default.
- Tampilkan resource strip satu baris sebelum keputusan airway. Jangan menyembunyikan ketidaktersediaan advanced airway sampai setelah pemain menjawab.
- Bridge UKM tampil sebagai kartu singkat `Dari Brankar ke Dapur Aman`: pintu keluar, regulator, APAR, pertolongan pertama, dan satu tindakan korektif yang benar-benar ditindaklanjuti.

**Catatan sumber dan keterbatasan:**

- PNPK Luka Bakar KMK 555/2019 adalah baseline Indonesia khusus luka bakar, tetapi beberapa rincian resusitasi dan antibiotik perlu dibaca bersama EBM yang lebih baru.
- ABA CPG 2023/2024 mencakup dewasa dengan luka bakar `>=20% TBSA` dan merekomendasikan inisiasi `2 mL/kg/%TBSA` untuk mengurangi volume resusitasi. Formula tetap merupakan titik awal dan membutuhkan titrasi klinis.
- ANZBA EMSB 2024 memakai pendekatan praktis first-contact, termasuk pendinginan 20 menit, perlindungan dari hipotermia, penilaian inhalation injury, cairan seimbang hangat, dan urine output sekitar `0,5 mL/kg/jam` pada dewasa. Perbedaan angka awal antarpedoman harus terlihat sebagai variasi protokol yang sah, bukan disembunyikan.
- Pulse oximetry standar tidak dapat diandalkan untuk mengecualikan carboxyhemoglobinemia. Oksigen konsentrasi tinggi didasarkan pada riwayat paparan dan gambaran klinis, bukan menunggu SpO2 rendah.
- Konsensus AAST 2024 tidak merekomendasikan antibiotik profilaksis rutin pada pasien luka bakar; risiko resistensi dan tidak adanya manfaat konsisten membuat bahasa lama PPK perlu diperbarui secara transparan.
- Baseline `sukamaju_middle_v1` menyatakan oksigen, suction/BVM, IV, tetanus, dan transport sebagai Tier C yang wajib dinyatakan bila menjadi syarat jawaban. Ia tidak membuktikan advanced airway atau burn-center capability tersedia setiap saat.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Luka Bakar*, KMK 555/2019: https://keslan.kemkes.go.id/unduhan/fileunduhan_1610415947_843237.pdf
- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- American Burn Association, *Clinical Practice Guidelines on Burn Shock Resuscitation*, published 2023 in JBCR 2024: https://academic.oup.com/jbcr/article/45/3/565/7458089
- Australian and New Zealand Burn Association, *Emergency Management of Severe Burns Manual*, 2024: https://anzba.org.au/assets/2024-EMSB-Manual-19e-v14-cover__.pdf
- Australian and New Zealand Committee on Resuscitation, *First Aid for Burns*, 2023: https://www.anzcor.org/home/first-aid/guideline-9-1-3-first-aid-for-burns
- American Burn Association, *Guidelines for Burn Patient Referral*: https://ameriburn.org/wp-content/uploads/2024/01/one-page-guidelines-for-burn-patient-referral.pdf
- CDC, *Clinical Guidance for Carbon Monoxide Poisoning*: https://www.cdc.gov/carbon-monoxide/hcp/clinical-guidance/index.html
- American Association for the Surgery of Trauma Critical Care Committee, *Antibiotic Prophylaxis in Injury*, 2024: https://pmc.ncbi.nlm.nih.gov/articles/PMC11149135/
- WHO, *Burns Fact Sheet*, 2023: https://www.who.int/news-room/fact-sheets/detail/burns
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, profil `sukamaju_middle_v1`.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-7 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-12 - Aspirasi Benda Asing dengan Sumbatan Jalan Napas Berat pada Anak

**Pernyataan reviewer:** `IGD-12: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** inti algoritme sadar-tidak sadar sudah mengikuti AHA/AAP 2025: sumbatan ringan didorong batuk, sumbatan berat pada anak ditangani dengan lima back blows lalu lima abdominal thrusts, anak yang tidak responsif masuk CPR, benda hanya diambil bila terlihat, dan gejala menetap memerlukan evaluasi bronkoskopi. Nilai klinis saat ini sekitar **7,8/10**. Kekurangannya adalah istilah `sumbatan total` dan beberapa umpan balik terlalu absolut, aktivasi bantuan baru muncul setelah anak pingsan, kesiapan BVM/oksigen/AED pediatrik tidak dinyatakan, dan rujukan hanya berbasis `spesialis anak`. Provenance juga keliru menyatakan PPK 1186/2022 tidak memuat FBAO, padahal terdapat bab Manuver Heimlich 4A, meski algoritmenya belum membedakan bayi-anak dan referensinya lama. Paket di bawah ditargetkan membawa kasus ke **>=9,2/10**.

**Patch specification yang diajukan:**

1. Pertahankan ICD `T17.9` karena lokasi benda belum diketahui, tetapi ubah label menjadi **`Aspirasi Benda Asing dengan Sumbatan Jalan Napas Berat pada Anak`**. Nyatakan anak berusia tiga tahun agar pilihan abdominal thrust tidak ambigu dengan algoritme bayi di bawah satu tahun.
2. Pertahankan SKDI kasus `3B` dengan penjelasan eksplisit: SKDI 2012 menempatkan `aspirasi` pada 3B, sedangkan benda asing trakea definitif berada pada tingkat 2; PPK 1186/2022 menempatkan keterampilan Manuver Heimlich pada 4A. Karena schema hanya memiliki satu field, `3B` mewakili pengenalan serta stabilisasi emergensi aspirasi, bukan klaim bahwa dokter FKTP melakukan bronkoskopi definitif.
3. Ganti istilah `sumbatan total` pada tombol dan umpan balik menjadi **`FBAO berat`**. Tidak mampu bersuara, batuk lemah/tanpa suara, sianosis, perubahan kesadaran, atau apnea menandai obstruksi berat yang memerlukan tindakan; istilah ini lebih sesuai AHA dan tidak mengajarkan kepastian anatomi yang tak dapat dilihat.
4. Saat FBAO berat dikenali dan anak masih responsif, satu anggota tim segera mengaktifkan respons emergensi serta ambulans sementara penolong utama memulai siklus **lima back blows diikuti lima abdominal thrusts**. Ulangi sampai benda keluar atau anak tidak responsif. Jangan menunggu beberapa siklus untuk memanggil bantuan.
5. Bedakan jelas algoritme usia pada debrief: bayi di bawah sekitar satu tahun menerima lima back blows dan lima chest thrusts, tanpa abdominal thrusts; anak sekitar satu tahun sampai pubertas menerima lima back blows lalu lima abdominal thrusts. Jangan menguji dua algoritme sekaligus pada tombol utama kasus anak tiga tahun.
6. Pada sumbatan ringan dengan batuk kuat dan suara masih ada, biarkan anak batuk dalam posisi nyaman dan observasi terus. Jangan memberi back blows, mengorek mulut, memaksa minum, atau membuat anak menangis; intervensi hanya meningkat bila muncul tanda FBAO berat.
7. Hapus bahasa bahwa oksigen `sama sekali tidak berguna`. Pada obstruksi berat, manuver pelepasan memang tidak boleh ditunda oleh pemasangan sungkup, tetapi oksigen, suction, BVM, monitor, dan peralatan resusitasi harus disiapkan paralel dan segera digunakan setelah ada aliran udara atau ventilasi dapat diberikan.
8. Bila anak menjadi tidak responsif, baringkan aman dan mulai CPR dengan kompresi tanpa menunda untuk pulse check dalam algoritme FBAO. Ikuti rasio pediatric BLS sesuai jumlah penolong; setiap kali jalan napas dibuka sebelum ventilasi, lihat mulut dan keluarkan benda hanya bila jelas terlihat serta mudah dijangkau. Jangan melakukan blind finger sweep.
9. Tambahkan BVM dengan masker pediatrik dan oksigen setelah kompresi membuka atau menggeser sumbatan sehingga ventilasi mungkin dilakukan. Bila dada tidak mengembang, reposisi dan lanjutkan siklus CPR; jangan membuang waktu dengan tiupan berulang yang tidak efektif.
10. AED dengan attenuator/pad pediatrik dipasang segera bila anak mengalami cardiac arrest dan alat tersedia, tanpa mengganggu kompresi atau pelepasan benda. AED bukan tindakan pertama saat anak masih responsif dengan FBAO berat.
11. Direct laryngoscopy dan Magill forceps hanya boleh dipakai oleh operator terlatih bila benda terlihat dan perangkat sudah berada di sisi pasien. Jangan meninggalkan CPR untuk mencari alat dan jangan melakukan instrumentasi buta. Perangkat suction anti-choking komersial tidak diberi skor karena AHA/AAP 2025 menyatakan bukti efektivitas serta keamanannya pada anak belum cukup.
12. Setelah bakso keluar, hentikan manuver pelepasan dan nilai ulang ABC, kesadaran, suara, batuk, stridor/wheeze, gerak dada, suara napas bilateral, saturasi, serta tanda trauma. Anak tetap NPO sambil bronkoskopi dipertimbangkan; nebulisasi atau kortikosteroid tidak boleh dipakai untuk menutupi gejala dan menggantikan evaluasi benda tersisa.
13. Pertahankan rujukan karena batuk dan suara napas kasar menetap setelah peristiwa asfiksia. Normalnya SpO2 atau foto toraks tidak menyingkirkan benda organik radiolusen. Namun revisi klaim bahwa setiap abdominal thrust pasti menimbulkan cedera organ: lakukan pemeriksaan klinis dan tingkatkan evaluasi bila ada nyeri, muntah, memar, nyeri tekan, distensi, atau manuver berulang/kuat; alasan utama rujukan kasus ini adalah dugaan retained airway foreign body.
14. Tampilkan resource strip sebelum keputusan: tim terlatih pediatric BLS, oksigen, suction, BVM dan masker ukuran anak, monitor/pulse oximeter, AED dengan pad pediatrik bila tersedia, serta ambulans dinyatakan ready. Laringoskop/Magill dan kompetensinya harus dinyatakan bila akan diberi kredit; bronkoskopi tidak tersedia di Sukamaju.
15. Ubah tujuan rujukan menjadi fasilitas yang telah mengonfirmasi penerimaan dan mampu menyediakan **airway pediatrik, anestesi, THT/pulmonologi anak, bronkoskopi rigid/fleksibel, kamar operasi, serta PICU**. Handoff memuat usia/berat, waktu dan jenis makanan, status awal, jumlah siklus/manuver, periode tidak responsif/CPR, benda yang keluar, tren vital, temuan napas setelahnya, dan terapi selama transfer.
16. Tutup bridge UKP-UKM melalui dua callback. `Keluarga`: teach-back first aid, makanan harus sesuai usia dan dipotong aman, anak duduk tenang serta diawasi saat makan, dan benda kecil dijauhkan. `Komunitas`: latihan choking berkala untuk kader/PAUD/penjual makanan, audit kesiapan BVM pediatrik dan ambulans, serta peninjauan makanan bulat-kenyal seperti bakso tanpa menyalahkan keluarga atau pedagang. Jangan menulis hasilnya ke indikator PIS-PK yang tidak cocok.
17. Perbaiki provenance. Nyatakan PPK 1186/2022 memang memuat Manuver Heimlich sebagai keterampilan 4A, tetapi belum memberi diferensiasi bayi-anak yang memadai dan mengandalkan sumber lama. Gunakan AHA/AAP Pediatric BLS 2025 sebagai algoritme utama yang lebih baru, Queensland Paediatric Clinical Guideline 2025 dan ERS untuk retained foreign body/bronkoskopi, WHO ETAT untuk konteks fasilitas sumber daya terbatas, serta Permenkes 16/2024 untuk rujukan berbasis kemampuan. Hapus rujukan mengambang `MTBS/IDAI` bila tidak ada dokumen, tahun, dan URL spesifik.

**Realita FKTP yang diajukan, versi layar utama:**

> Di Sukamaju, tindakan penyelamat nyawa ini tidak menunggu bronkoskopi: kenali FBAO berat, panggil bantuan, lakukan lima back blows dan lima abdominal thrusts pada anak, lalu mulai CPR bila anak tidak responsif. Tetapi keberhasilan mengeluarkan satu potong bakso belum otomatis membuktikan jalan napas bersih. Batuk dan napas kasar yang menetap memerlukan transfer ke fasilitas dengan airway pediatrik, anestesi, dan bronkoskopi; foto toraks normal pun tidak menyingkirkan benda organik. Setelah episode selesai, keluarga berlatih ulang pertolongan pertama dan desa memperbaiki keselamatan makan anak serta kesiapan respons, bukan mencari siapa yang harus disalahkan.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief berupa tiga kartu urutan: `masih responsif`, `menjadi tidak responsif`, dan `benda keluar tetapi gejala menetap`.
- Perbandingan bayi versus anak diletakkan pada visual mini dua kolom setelah kasus, bukan dicampur ke pilihan utama.
- Resource strip tampil satu baris sebelum fase CPR; detail rasio CPR, AED, dan bronkoskopi berada di panel `Bukti klinis` tertutup.
- Bridge UKM tampil sebagai kartu `Satu Bakso, Dua Keselamatan`: first aid keluarga dan pencegahan makanan/PAUD, masing-masing hanya satu keputusan tindak lanjut.

**Catatan sumber dan keterbatasan:**

- AHA/AAP 2025 adalah pembaruan besar: anak dengan FBAO berat menerima lima back blows lalu lima abdominal thrusts; bila tidak responsif, mulai CPR dengan kompresi tanpa pulse check dan keluarkan hanya benda yang terlihat. Kekuatan rekomendasinya tinggi, tetapi level bukti langsung pediatriknya tetap terbatas (`C-LD`).
- AHA/AAP meminta sistem emergensi diaktifkan segera karena anak dapat cepat mengalami cardiac arrest. Ia juga belum merekomendasikan perangkat suction anti-choking karena bukti anak tidak memadai.
- Queensland Paediatric Clinical Guideline 2025 merekomendasikan bronkoskopi bila riwayat aspirasi disertai temuan abnormal atau gejala respirasi yang menetap. Pemeriksaan dan foto toraks normal tidak menyingkirkan aspirasi.
- PPK 1186/2022 memberi legitimasi tindakan life-saving di layanan primer, tetapi bab Manuver Heimlich memakai algoritme generik dan referensi 2010-2014. Perbedaan tersebut harus disajikan sebagai pembaruan evidence, bukan sebagai klaim bahwa PPK tidak memuat topik.
- Baseline `sukamaju_middle_v1` menempatkan BVM, suction, airway adjunct, monitor, dan transport pada Tier C; semuanya harus dinyatakan ready bila kegagalan penggunaannya diberi penalti.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022, bab Manuver Heimlich: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- KKI, *Standar Kompetensi Dokter Indonesia 2012*: https://indonesia-orthopaedic.org/storage/app/media/Standar-Kompetensi-Dokter-Indonesia-SKDI-KKI-Tahun-2012.pdf
- AHA/AAP, *2025 Pediatric Basic Life Support Guidelines*: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-basic-life-support
- AHA/AAP, *Child Foreign Body Airway Obstruction Algorithm*, 2025: https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-BLS-Child-FBAO-250130.svg
- Children's Health Queensland, *Inhaled Foreign Body - Emergency Management in Children*, approved 2025: https://www.childrens.health.qld.gov.au/for-health-professionals/queensland-paediatric-emergency-care-qpec/queensland-paediatric-clinical-guidelines/foreign-body-inhaled
- European Respiratory Society, *Statement on Interventional Bronchoscopy in Children*: https://publications.ersnet.org/content/erj/50/6/1700901
- WHO, *Paediatric Emergency Triage, Assessment and Treatment*, 2016: https://www.who.int/publications/i/item/9789241510219
- WHO, *Complementary Feeding - Choking Prevention*: https://www.who.int/health-topics/complementary-feeding
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, profil `sukamaju_middle_v1`.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-12 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-13 - Suspek Sepsis dengan Syok, Kemungkinan Sumber Urin

**Pernyataan reviewer:** `IGD-13: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** draf sudah mengenali infeksi dengan disfungsi organ dan hipoperfusi, tidak menunggu laktat atau kultur, memulai kristaloid dengan penilaian ulang, memberi antibiotik IV dini, serta tetap merujuk. Nilai klinis saat ini sekitar **7,1/10**. Namun label `Syok Sepsis` dipakai sebagai diagnosis pasti sebelum kriteria formal dapat dinilai, rentang usia 45-75 tidak konsisten dengan pembuka `lansia`, antibiotik hanya disebut `spektrum luas yang tersedia`, dan rumah sakit yang baru siap dua jam berisiko mengajarkan pasien syok untuk menunggu administrasi. Umpan balik akhir juga menyatakan pasien pasti membutuhkan vasopresor meski tekanan darah 92/60 atau MAP sekitar 71 dan kesadarannya membaik. Paket di bawah ditargetkan membawa kasus ke **>=9,2/10**.

**Patch specification yang diajukan:**

1. Pertahankan id teknis `igd_syok_sepsis`, SKDI `3B`, dan kode utama `A41.9`, tetapi ubah label layar menjadi **`Suspek Sepsis dengan Syok, Kemungkinan Sumber Urin`**. Sepsis-3 mendefinisikan syok septik formal sebagai sepsis dengan kebutuhan vasopresor untuk mempertahankan MAP minimal 65 mmHg dan laktat lebih dari 2 mmol/L setelah resusitasi cairan memadai. FKTP tidak perlu menunggu kedua data itu untuk mengenali kegawatan dan bertindak, tetapi juga tidak boleh mengajarkan bahwa hipotensi awal saja sudah membuktikan label formal tersebut.
2. Tampilkan `A41.9` sebagai kode utama sepsis organisme tidak spesifik dan `R57.2` sebagai kode terkait syok septik di provenance/debrief bila model data hanya mengizinkan satu kode utama. Jangan memakai `R65.21`, karena itu kode ICD-10-CM dan bukan kode dasar ICD-10 WHO yang dipakai katalog permainan.
3. Jadikan pasien spesifik: perempuan 68 tahun, berat aktual 55 kg, tanpa gagal jantung atau sirosis yang diketahui, tetapi fungsi ginjal belum diketahui karena oliguria. Tambahkan data yang memengaruhi keputusan antibiotik: tidak ada alergi beta-laktam berat, rawat inap/antibiotik luas baru-baru ini, kolonisasi MDR, atau riwayat ESBL yang diketahui. Riwayat batu, ginjal tunggal, retensi, kateter, dan infeksi berulang tetap harus ditanyakan karena nyeri pinggang plus oliguria dapat menandai obstruksi terinfeksi.
4. Saat sepsis dengan syok dikenali, aktifkan `huddle sepsis Sukamaju` dan koordinasi rujukan secara paralel, bukan setelah satu liter cairan atau setelah dosis antibiotik selesai. Bagi peran tim: ABC dan monitoring, akses/cairan, glukosa serta sampel yang tidak menunda, antibiotik, komunikasi keluarga, dan pencarian fasilitas penerima. qSOFA boleh tampil sebagai tanda risiko tinggi, bukan sebagai tes diagnosis tunggal.
5. Tampilkan resource strip sebelum pilihan pertama: kristaloid seimbang, dua jalur IV bila feasible, oksigen, pulse oximeter, manset tekanan darah, termometer, glukometer, alat pantau urine, antibiotik jembatan yang telah disetujui, ambulans, dan komunikasi rujukan dinyatakan ready. Laktat, kultur darah, pompa infus vasopresor, protokol vasopresor perifer, dan monitoring tingkat lanjut dinyatakan tidak ready di Sukamaju.
6. Karena SpO2 92%, kesadaran turun, akral dingin, dan pembacaan pulse oximeter dapat kurang andal pada perfusi buruk, verifikasi sinyal lalu berikan oksigen yang dititrasi terhadap respons klinis dan saturasi. Jangan menjadikan `oksigen untuk semua sepsis` atau high-flow tanpa penilaian sebagai aturan universal; airway, kerja napas, perfusi, dan kecukupan suplai selama transfer tetap dinilai serial.
7. Gunakan kristaloid seimbang sebagai pilihan awal. Berikan aliquot 250-500 mL dengan penilaian ulang tekanan darah/MAP, capillary refill, kesadaran, nadi, napas, SpO2, auskultasi paru, dan urine. Angka `sekurang-kurangnya 30 mL/kg dalam tiga jam` dari SSC 2026 menjadi orientasi dengan kepastian bukti rendah, bukan tiga kantong yang wajib dihabiskan. Pada 55 kg, estimasi referensinya sekitar 1.650 mL; volume dan laju harus disesuaikan terhadap respons, penyakit penyerta, serta tanda kelebihan cairan. Passive leg raise atau respons terhadap mini-fluid challenge boleh membantu bila feasible.
8. Revisi pilihan vasopresor agar tidak menyatakan `mulai vasopresor sekarang` selalu salah secara medis. SSC 2026 membuka kemungkinan vasopresor bersamaan dengan cairan pada syok tidak stabil dan menyarankan tidak menunggu akses sentral bila vasopresor memang dibutuhkan. Pilihan itu salah **dalam encounter Sukamaju ini** karena pompa, protokol, monitor, obat, dan operator belum ready. Bila hipotensi berat menetap atau pasien memburuk, tim wajib mengeskalasi ke RS/PSC atau tim retrieval untuk dukungan vasopresor termonitor, bukan mengimprovisasi dopamin atau bolus vasopresor.
9. Periksa glukosa bedside dan lakukan evaluasi singkat penyebab lain atau syok campuran tanpa menunda resusitasi. Ambil kultur darah dan urine sebelum antibiotik hanya bila sarana sudah tersedia dan prosesnya tidak menyebabkan penundaan bermakna. Urinalisis, darah lengkap, fungsi ginjal, dan laktat memperkaya keputusan di fasilitas mampu, tetapi hasilnya bukan tiket untuk mulai resusitasi atau transfer.
10. Ganti tombol generik `antibiotik empiris spektrum luas yang tersedia` dengan keputusan yang dapat diaudit. Untuk encounter ini, protokol jejaring kabupaten/RS menyatakan dua vial seftriakson tersedia sebagai **stok jembatan emergensi** dan memerintahkan `seftriakson 2 g IV dosis pertama` segera setelah alergi berat serta risiko MDR singkat disaring. Catat nama, dosis, rute, dan jam pemberian. Ini bukan resep universal semua urosepsis dan bukan klaim bahwa seftriakson rutin ready di setiap Puskesmas; Fornas 1199/2025 menempatkannya pada FPKTL, sehingga readiness khusus encounter dan otorisasi protokol jejaring harus terlihat. Bila stok/protokol tersebut tidak ada, jangan mengimprovisasi regimen atau menahan transfer.
11. Jangan memakai aminoglikosida sebagai jawaban default pada pasien oliguria dengan fungsi ginjal belum diketahui. Di RS, regimen harus segera ditinjau terhadap fungsi ginjal, kultur, antibiogram lokal, paparan layanan kesehatan, alergi, dan risiko MDR. Stewardship tetap berjalan setelah keputusan menyelamatkan waktu untuk memberi dosis pertama.
12. Tambahkan evaluasi source control: nyeri pinggang, oliguria, riwayat batu, retensi, atau hidronefrosis dapat berarti sistem kemih terinfeksi yang tersumbat. Tujuan rujukan harus memiliki laboratorium/laktat/kultur, ultrasonografi atau CT, ICU/HCU, norepinefrin dengan monitoring, serta urologi/intervensi untuk drainase bila diperlukan. Antibiotik dan cairan tidak menggantikan dekompresi sumber yang tersumbat.
13. Hapus narasi pasif `tempat tidur baru siap sekitar dua jam lagi`. Tim harus menghubungi fasilitas alternatif yang mampu, PSC/jejaring rujukan, atau eskalasi Dinkes sambil resusitasi dan antibiotik berjalan. Ketidaktersediaan bed menjadi hambatan sistem yang dicatat dan ditindaklanjuti, bukan alasan menahan pasien syok di fasilitas tanpa vasopresor dan ICU.
14. Rekonsiliasi langkah akhir. Bila tekanan darah tetap 92/60 atau MAP sekitar 71, perfusi dan kesadaran membaik, jangan menulis bahwa pasien pasti membutuhkan vasopresor saat itu; ia tetap memerlukan transfer karena respons dapat sementara dan source control belum tercapai. Bila tujuan pedagogisnya adalah mengajarkan vasopresor, vignette harus menunjukkan hipotensi persisten dengan MAP di bawah target setelah cairan terukur serta secara eksplisit menghadirkan tim dan resource yang aman. Versi pilot memilih jalur pertama agar tidak mengarang kesiapan retrieval lanjutan.
15. Revisi distractor kortikosteroid. Hidrokortison adalah terapi tambahan terpilih pada septic shock yang masih membutuhkan dukungan vasopresor dalam lingkungan termonitor; ia bukan dosis tinggi pra-rujuk, bukan pengganti antibiotik/cairan/source control, dan tidak wajib diberikan oleh Sukamaju sebelum transfer. Hapus aturan lama yang terlalu kaku seolah steroid baru boleh dipikirkan setelah urutan cairan lalu vasopresor selesai sempurna.
16. Ubah disposisi dari sekadar `penyakit dalam` menjadi fasilitas yang telah mengonfirmasi penerimaan dan mampu menangani shock monitoring, vasopresor, ICU/HCU, kultur/laktat, imaging, serta source control urologis. Handoff memuat waktu pengenalan sepsis, sumber yang dicurigai, alergi/risiko MDR, tren vital dan perfusi, glukosa, total serta waktu cairan berikut responsnya, urine, antibiotik nama-dosis-jam, sampel yang sudah diambil, dan kebutuhan yang belum terpenuhi.
17. Tutup kontinuitas UKP setelah pulang: callback menilai pemulihan ginjal dan urine, rekonsiliasi antibiotik/obat kronis, kelemahan, nutrisi, fungsi dan kognisi pascasepsis, tanda infeksi berulang, serta kemungkinan obstruksi atau batu. Jangan membuat pasien `sembuh` begitu keluar dari rumah sakit.
18. Tutup bridge UKP-UKM dengan kartu **`Satu Jam, Dua Sistem`**. Audit agregat mencakup waktu kenal sepsis, waktu antibiotik, volume dan reassessment cairan, decision-to-departure, penolakan atau keterlambatan bed, stok emergency dose, kelengkapan handoff, dan keterlambatan source control. Puskesmas, RS, PSC, farmasi, laboratorium, dan Dinkes kemudian memperbaiki protokol, antibiogram jejaring, simulasi huddle, serta jalur rujukan. Jangan menulisnya ke indikator PIS-PK yang tidak cocok dan jangan membuka identitas pasien.
19. Perbaiki provenance. PNPK Sepsis KMK 342/2017 dan PPK FKTP KMK 1186/2022 tetap menjadi floor Indonesia, tetapi panel bukti wajib menjelaskan bahwa definisi, EGDT/CVP, akses vasopresor sentral, dan beberapa detail hemodinamiknya berasal dari era lebih lama. SSC 2026 menjadi pembaruan utama untuk cairan individual, vasopresor perifer, antibiotik satu jam, source control, dan quality improvement. Fornas 1199/2025 memeriksa level formulary; baseline ASPAK memeriksa readiness encounter; Permenkes 16/2024 memandu rujukan berbasis kemampuan.

**Realita FKTP yang diajukan, versi layar utama:**

> Sukamaju tidak perlu laktat untuk mengenali bahwa infeksi, bingung akut, oliguria, akral dingin, dan tekanan 82/50 adalah kegawatan. Tim memulai cairan seimbang dalam aliquot, menilai respons setiap kali, memberi dosis antibiotik jembatan yang benar-benar tersedia, dan mencari RS mampu sejak menit pertama. Tetapi `30 mL/kg` bukan tiga kantong otomatis, seftriakson bukan stok universal Puskesmas, dan vasopresor tidak boleh diimprovisasi tanpa pompa, monitor, protokol, serta operator. Bila bed tujuan tertunda, jejaring mencari alternatif; pasien syok tidak menunggu administrasi.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief berupa empat kartu pendek: `kenali tanpa menunggu`, `cairan lalu nilai ulang`, `antibiotik yang dapat diaudit`, dan `rujuk sambil resusitasi`.
- Tampilkan mini-timeline `menit 0`, `setiap aliquot`, `<=60 menit`, dan `berangkat`; detail definisi Sepsis-3 serta kekuatan bukti berada di panel `Bukti klinis` yang tertutup.
- Resource strip membedakan `ready sekarang`, `melalui jejaring`, dan `tidak ready`; pemain tidak perlu menebak inventaris tersembunyi.
- Bridge UKM muncul sesudah debrief sebagai kartu `Satu Jam, Dua Sistem`, bukan sebagai kuliah epidemiologi di tengah resusitasi.

**Catatan sumber dan keterbatasan:**

- SSC 2026 menyatakan sepsis adalah diagnosis klinis, resusitasi dimulai segera, antibiotik untuk possible/probable/definite septic shock diberikan segera dan idealnya dalam satu jam, serta source control dini diprioritaskan. Rekomendasi 30 mL/kg dalam tiga jam berkepastian rendah dan disertai kewajiban individualisasi serta reassessment.
- SSC 2026 juga memperbolehkan vasopresor bersamaan dengan cairan pada syok tidak stabil dan menyarankan memulai secara perifer daripada menunggu akses sentral. Ini tidak membuktikan semua FKTP aman melakukannya; kesiapan alat, obat, protokol, monitoring, dan operator tetap menentukan.
- PNPK 2017 secara formal menyasar layanan primer dan rumah sakit, tetapi tata laksananya dominan ICU, memakai definisi serta konsep hemodinamik lama, dan tidak memberi algoritme rujuk FKTP yang operasional. Ia dipertahankan sebagai baseline regulasi, bukan satu-satunya sumber klinis.
- Seftriakson 2 g IV adalah keputusan authoring khusus encounter dengan dugaan sumber urin komunitas, skrining alergi/MDR negatif, dan protokol jejaring tertulis. Pemain tidak diberi kesan bahwa regimen ini cocok untuk semua sumber, semua pasien, atau semua pola resistensi.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Sepsis*, KMK 342/2017: https://keslan.kemkes.go.id/unduhan/fileunduhan_1610419769_850165.pdf
- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- Society of Critical Care Medicine, *Surviving Sepsis Campaign International Guidelines 2026*: https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026
- Singer et al., *The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3)*, JAMA 2016: https://jamanetwork.com/journals/jama/fullarticle/2492881
- Kementerian Kesehatan RI, *Fornas 1199/2025*: https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, profil `sukamaju_middle_v1`.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-13 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-14 - Tenggelam Nonfatal dengan Gagal Napas dan Hipotermia Ringan

**Pernyataan reviewer:** `IGD-14: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` dan patch specification yang langsung mendahuluinya.

**Status:** sign-off dokter tercatat; patch specification disetujui untuk implementasi runtime.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** draf sudah menempatkan hipoksia sebagai masalah utama, memprioritaskan ventilasi, melarang Heimlich dan posisi kepala di bawah untuk mengeluarkan air, melakukan penghangatan, menghindari antibiotik serta steroid profilaksis, dan merujuk pasien yang membutuhkan bantuan napas. Nilai klinis saat ini sekitar **7,5/10**. Kekurangan utamanya adalah rentang usia 10-30 tahun mencampur algoritme anak dan dewasa, rujukan baru tampak sebagai keputusan setelah 30 menit, alasan penghangatan memakai bahasa terlalu absolut, dan istilah `cedera paru tertunda` disampaikan dengan cara yang dapat menghidupkan mitos `secondary drowning`. Kasus juga belum mencari penyebab pasien jatuh, belum membedakan respiratory arrest dari cardiac arrest, dan tujuan rujuknya hanya `penyakit dalam`. Paket di bawah ditargetkan membawa kasus ke **>=9,3/10**.

**Patch specification yang diajukan:**

1. Pertahankan id teknis `igd_tenggelam`, ICD `T75.1`, dan SKDI `3B`, tetapi gunakan label **`Tenggelam Nonfatal dengan Gagal Napas dan Hipotermia Ringan`**. Gunakan definisi WHO: drowning adalah proses gangguan napas akibat submersion/immersion dalam cairan, dengan luaran kematian, morbiditas, atau tanpa morbiditas. Hapus istilah `near-drowning`, `dry`, `wet`, `freshwater`, `saltwater`, dan `secondary drowning` sebagai kategori klinis.
2. Tetapkan pasien sebagai laki-laki 22 tahun agar algoritme resusitasi dewasa tidak bercampur dengan pediatrik. Buat suhu 33,8 derajat masuk akal dengan konteks sungai desa setelah hujan pada dini hari, pakaian basah, dan durasi evakuasi. Nyatakan estimasi berat badan serta metode pengukuran suhu; termometer biasa yang tidak dapat membaca suhu rendah tidak boleh dianggap sebagai core temperature presisi.
3. Perkaya handoff saksi tanpa memperlambat tindakan: perkiraan waktu submersi, waktu ditemukan, apakah kejadian disaksikan, suhu/kondisi arus dan kontaminasi air, jenis rescue, napas bantuan/CPR yang sudah diberikan, waktu napas pertama, muntah, dan respons. Jangan memberi prognosis pasti hanya dari satu perkiraan durasi yang tidak andal.
4. Sejak pasien tiba, aktifkan tim dan rujukan secara paralel. Satu petugas menangani airway/ventilasi, satu memantau sirkulasi dan menyiapkan AED, satu mengeringkan serta menghangatkan setelah ventilasi berjalan, dan satu menghubungi fasilitas penerima. Langkah ketiga bukan waktu pertama kali memutuskan rujuk, melainkan dialog menghadapi permintaan pulang saat transfer sudah dikoordinasikan.
5. Tampilkan resource strip: BVM dengan masker dewasa dan reservoir, oksigen dengan kapasitas transfer, suction, airway adjunct, pulse oximeter, monitor/ECG, AED, glukometer, low-reading thermometer bila ada, selimut/active warming, cairan kristaloid hangat, dan ambulans dinyatakan ready. Advanced airway, ventilator, NIV/CPAP, blood gas, dan ICU dinyatakan melalui RS jejaring, bukan ready di Sukamaju.
6. Pada pasien dengan nadi 54/menit tetapi napas hanya 6/menit dan dangkal, tindakan benar adalah membuka airway, mengeluarkan hanya benda/muntahan yang terlihat atau mengganggu ventilasi, lalu memberi **assisted ventilation segera** dengan BVM dan oksigen. Gunakan two-person mask seal bila tenaga tersedia, airway adjunct sesuai kompetensi, volume secukupnya sampai dada tampak naik, dan hindari ventilasi terlalu cepat atau bertekanan tinggi yang memperbesar distensi lambung serta regurgitasi.
7. Jangan menghabiskan waktu menyedot busa halus yang terus terbentuk bila ventilasi masih dapat dilakukan. Bila muntahan atau material padat benar-benar menghalangi ventilasi, miringkan singkat dan lakukan directed suction dengan interupsi minimal. Abdominal thrust hanya relevan bila ada benda padat penyebab FBAO, bukan untuk mengeluarkan air dari paru.
8. Tampilkan cabang algoritme yang hilang pada debrief. Bila nadi ada tetapi napas tidak efektif, teruskan rescue breathing/assisted ventilation dan nilai ulang. Bila tidak ada tanda sirkulasi atau terjadi cardiac arrest, mulai CPR **dengan napas dan kompresi**, bukan compression-only sebagai pilihan ideal. Untuk dewasa gunakan 30:2; trained rescuer boleh memulai dengan napas, dan CPR tidak boleh ditunda untuk mencari atau memasang AED. Keringkan dada seperlunya lalu gunakan AED begitu tersedia tanpa menghentikan CPR lebih lama dari perlu.
9. Setelah napas spontan kembali, jangan berpindah terlalu cepat ke kanula nasal hanya karena satu angka membaik. Nilai kesadaran, ventilasi, kerja napas, auskultasi, muntah, dan tren SpO2. Titrasi oksigen menuju sekitar 94-98% pada pasien non-arrest sambil mempertahankan bantuan ventilasi bila napas tetap tidak adekuat. NIV dapat dipertimbangkan di fasilitas mampu hanya bila pasien sadar, kooperatif, dan tidak muntah; depressed consciousness atau kegagalan ventilasi memerlukan advanced airway oleh operator terampil.
10. Hindari imobilisasi spinal rutin. Lakukan spinal motion restriction hanya bila ada mekanisme atau temuan yang mendukung, seperti terjun dari ketinggian, benturan kepala/leher, defisit neurologis, atau riwayat tidak jelas dengan kecurigaan trauma. Pada kejadian terpeleset yang disaksikan tanpa axial loading, airway dan ventilasi tidak boleh ditunda demi papan spinal.
11. Revisi bahasa hipotermia. Suhu 33,8 derajat adalah hipotermia ringan, tetapi tetap dapat memperburuk bradikardia, koagulasi, dan pemulihan. Ventilasi menjadi prioritas menit pertama, sementara pelepasan pakaian basah, pengeringan, insulasi, active external warming pada batang tubuh, dan penanganan lembut dilakukan paralel segera setelah ada petugas kedua. Cairan IV hangat dan oksigen hangat-lembap hanya digunakan bila ready. Hapus klaim bahwa menggosok tungkai pada suhu ini pasti memicu fibrilasi ventrikel; larang karena tidak efektif, dapat mencederai kulit, meningkatkan vasodilatasi perifer, dan tidak menggantikan rewarming terkontrol.
12. Pantau ECG/irama, tekanan darah, napas, kesadaran, glukosa, suhu, dan perfusi. Beri kristaloid isotonic hangat hanya bila ada hipovolemia atau hipotensi yang relevan; jangan memberi cairan untuk `menetralkan air tawar` atau `air laut`. Perbedaan jenis air tidak menghasilkan algoritme resusitasi awal yang berbeda.
13. Pertahankan larangan antibiotik dan kortikosteroid profilaksis, tetapi hilangkan kata absolut. Antibiotik dipertimbangkan bila kemudian ada pneumonia/sepsis atau paparan air yang benar-benar sangat tercemar, idealnya dipandu kultur dan pola mikrobiologi lokal karena patogennya dapat tidak lazim. Demam, leukositosis, atau infiltrat awal dapat berasal dari pneumonitis kimia dan tidak otomatis membuktikan infeksi. Steroid tidak diberikan rutin khusus untuk drowning-associated lung injury.
14. Pemeriksaan penunjang mengikuti kondisi, bukan paket wajib. GDS dan ECG membantu mencari penyebab; blood gas membantu pada hipoksemia/distres; pemeriksaan lain disesuaikan dengan trauma, toksikologi, atau penyakit penyerta. Foto toraks awal normal tidak menjamin tidak ada cedera paru, tetapi foto abnormal juga tidak menentukan prognosis; jangan menunggu foto untuk memulai transfer.
15. Cari penyebab kejadian setelah ABC berjalan: terpeleset murni, arus, kelelahan, alkohol/zat, hipoglikemia, kejang, sinkop, aritmia/long-QT, infark, trauma kepala, atau tindakan menyakiti diri. Saksi yang mengatakan `kepeleset` menjadi data awal, bukan akhir penalaran. Penilaian keselamatan dan kesehatan mental dilakukan secara privat serta tidak menghambat resusitasi.
16. Pertahankan rujukan karena pasien sempat tidak sadar, SpO2 80%, RR 6/menit, membutuhkan BVM, masih batuk, dan mengalami hipotermia. Jangan menjelaskan keputusan dengan mitos bahwa pasien yang sudah sepenuhnya normal dapat meninggal mendadak berhari-hari kemudian karena `air tersisa`. Pasien ringan yang kemudian benar-benar asimtomatik, mental dan pemeriksaan napas normal, tidak membutuhkan airway support, serta stabil setelah observasi 4-6 jam di fasilitas mampu dapat dipertimbangkan pulang. Pasien dalam vignette ini jelas tidak termasuk kelompok tersebut.
17. Ubah tujuan rujukan dari `penyakit dalam` menjadi fasilitas yang telah mengonfirmasi penerimaan dan mampu melakukan emergency airway, NIV/ventilasi, blood gas, imaging sesuai indikasi, monitoring kontinu, rewarming, serta ICU. Handoff memuat kronologi submersi dan rescue, bantuan napas/CPR, muntah/aspirasi, dugaan trauma atau penyebab medis, tren neurologis/respirasi/suhu, oksigen dan ventilasi yang diberikan, serta respons.
18. Tambahkan callback pascapulang: fungsi kognitif dan neurologis, batuk/sesak, toleransi aktivitas, gangguan tidur atau kecemasan, evaluasi sinkop/kejang/aritmia bila dicurigai, penggunaan alkohol/zat, serta kesiapan kembali ke aktivitas air. Edukasi diberikan tanpa mempermalukan pasien atau penolong.
19. Tutup bridge UKP-UKM melalui kartu **`Dari Sungai ke Sistem Aman`**. Audit agregat mencatat lokasi dan jam kejadian, cuaca/arus, penerangan dan akses tebing, penggunaan pelampung, alkohol, waktu ditemukan, rescue yang aman atau berbahaya, waktu napas bantuan, kesiapan oksigen/BVM/AED, serta response-to-departure. Desa, Puskesmas, BPBD/Basarnas, PSC, sekolah, kelompok pemancing, dan pengelola lokasi memilih intervensi nyata: pegangan/pagar pada akses berisiko, pelampung dan throw-bag, lifejacket, penerangan, peringatan arus, buddy system, pengawasan anak, latihan `reach/throw, do not go`, serta CPR dengan napas. Ukur near-miss dan waktu respons, bukan hanya kematian; jangan memaksakannya ke indikator PIS-PK yang tidak cocok.
20. Perbaiki provenance. PPK FKTP 1186/2022 tetap menjadi floor BHD umum tetapi tidak memiliki bab drowning spesifik. AHA 2025 Special Circumstances menggantikan pembaruan terfokus AHA/AAP 2024 sebagai acuan resusitasi utama. ANZCOR 2026 memberi detail ventilasi, oksigen, dan hipotermia yang dapat diaudit; WMS 2024 memberi terminologi, antibiotik, imaging, observasi, serta pencegahan. WHO Global Status Report 2024 menjadi dasar bridge UKM, Permenkes 16/2024 memandu tujuan rujukan berbasis kemampuan, dan UU 29/2014 memberi konteks koordinasi pencarian-pertolongan Indonesia.

**Realita FKTP yang diajukan, versi layar utama:**

> Pada drowning, menit pertama dipakai untuk mengembalikan napas, bukan `mengeluarkan air`. Sukamaju memberi ventilasi efektif, menyiapkan CPR dengan napas bila nadi hilang, mengeringkan dan menghangatkan secara paralel, lalu meneruskan pasien ke fasilitas yang mampu menangani cedera paru dan hipoksia. Pasien ini tetap dirujuk karena sempat tidak sadar dan membutuhkan BVM, bukan karena mitos `secondary drowning`. Sesudahnya, titik sungai yang licin, keterlambatan rescue, keterampilan napas bantuan, dan kesiapan pelampung menjadi pekerjaan UKM bersama desa serta jejaring SAR.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief hanya empat kartu: `napas dulu`, `bila nadi hilang: CPR dengan napas`, `hangatkan paralel`, dan `rujuk karena pernah gagal napas`.
- Gunakan mini-timeline `diangkat dari air`, `menit pertama`, `napas kembali`, dan `transfer`; detail observasi pasien ringan serta pemeriksaan penyebab berada di panel `Bukti klinis` tertutup.
- Resource strip memisahkan `ready di Sukamaju` dan `tersedia di RS`. Jangan menguji advanced airway atau NIV tanpa menyatakan operator dan alat.
- Bridge UKM muncul setelah debrief sebagai satu kartu `Dari Sungai ke Sistem Aman` dengan satu pilihan intervensi lokasi dan satu pilihan penguatan rescue, bukan daftar kampanye panjang.

**Catatan sumber dan keterbatasan:**

- AHA 2025 menekankan ventilasi sebagai inti resusitasi drowning. Pada cardiac arrest, CPR ideal mencakup napas dan kompresi; CPR tidak ditunda untuk AED, dan trained rescuer dapat memulai dengan napas. Bukti langsung untuk beberapa rincian masih observasional atau expert opinion.
- ANZCOR 2026 memakai lima ventilasi awal pada korban yang tidak bernapas normal serta sasaran SpO2 94-98% setelah napas/sirkulasi kembali. Kasus ini memiliki nadi dan gagal napas, sehingga layar utama menilai assisted ventilation, bukan meminta pemain menghafal dua algoritme sekaligus.
- WMS 2024 mendukung transfer segera pada gangguan kesadaran, hipotensi, batuk berat, atau temuan paru abnormal. Rekomendasi observasi 4-6 jam dan discharge terutama berasal dari studi observasional, banyak di antaranya pediatrik; ia tidak berlaku untuk pasien vignette yang memerlukan BVM.
- WHO 2024 menyebut intervensi pencegahan berbasis komunitas seperti pembatas akses air, keterampilan renang dan water safety, rescue-resuscitation, lifejacket/aturan perahu, pengawasan anak, dan manajemen risiko banjir. Pilihan Sukamaju harus mengikuti hazard lokal, bukan menyalin semua intervensi sekaligus.
- Hipotermia 33,8 derajat tidak membenarkan penundaan ventilasi, tetapi juga tidak boleh disepelekan. Bahasa final mengajarkan dua pekerjaan berjalan paralel bila tim tersedia.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- American Heart Association, *2025 Adult and Pediatric Special Circumstances of Resuscitation*, bagian Drowning dan Hypothermia: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation
- ANZCOR, *Guideline 11.10 Resuscitation in Special Circumstances*, 2026: https://www.anzcor.org/home/adult-advanced-life-support/guideline-11-10-resuscitation-in-special-circumstances
- Wilderness Medical Society, *Clinical Practice Guidelines for the Treatment and Prevention of Drowning: 2024 Update*: https://doi.org/10.1177/10806032241227460
- WHO, *Global Status Report on Drowning Prevention 2024*: https://www.who.int/publications/i/item/9789240103962
- Badan Nasional Pencarian dan Pertolongan, *UU 29/2014 tentang Pencarian dan Pertolongan*: https://jdih.basarnas.go.id/produk-hukum/427
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, profil `sukamaju_middle_v1`.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-14 dikunci untuk batch implementasi runtime. Dengan keputusan ini, adjudikasi klinis 14/14 selesai.

## Penutupan Implementasi

- Seluruh 14 keputusan dokter telah diterapkan pada release konten `igd-adjudication-2026-07-22`.
- Empat belas kasus IGD hasil adjudikasi aktif di mode Karier dan tetap dikecualikan dari mode Ujian. Kebijakan kasus IGD lama yang sudah aktif tidak berubah.
- ID langkah, ID pilihan, kunci benar-salah, dan efek stabilitas dipertahankan; perubahan berfokus pada ketepatan klinis, bahasa, debrief, realita sumber daya FKTP, kontinuitas, dan bridge UKP-UKM.
- Verifikasi akhir: TypeScript bersih; freeze `18/18`; Vitest `1257/1257` pada 133 file; soak 90 hari dan uji adversarial lulus; production build dan bundle budget lulus.
- Installer: `dist/PRIMERA test-beta Setup 1.1.0-beta.1.exe` (107.936.221 byte).
- SHA-256 installer: `CF9B2957359BB2D736680FC8C526AC6B96278B1791AADAD2C6F9097A94905BC9`.
